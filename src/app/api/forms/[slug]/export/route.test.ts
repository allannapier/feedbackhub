import { GET } from './route'; // Assuming route.ts is in the same directory
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => {
  const mockAuthGetUser = jest.fn();
  const mockFrom = jest.fn();
  const mockSupabaseClient = {
    auth: {
      getUser: mockAuthGetUser,
    },
    from: mockFrom,
  };
  return {
    createClient: jest.fn(() => mockSupabaseClient),
  };
});

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('API Route: /api/forms/[slug]/export', () => { // Updated description
  let mockAuthGetUser: jest.Mock;
  let mockFrom: jest.Mock;

  const actualFormId = 'form-id-for-responses-987'; // An actual ID for linking Form to Response
  const testSlug = 'test-form-slug-123'; // The slug used in the URL
  const testUserId = 'user-abc-789';

  beforeEach(() => {
    mockAuthGetUser = (createClient() as any).auth.getUser;
    mockFrom = (createClient() as any).from;
    
    mockAuthGetUser.mockReset();
    mockFrom.mockReset();

    // Default behavior for from().select().eq().single() and from().select().eq()
    mockFrom.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }), // Default to form not found
    }));
  });

  const mockRequest = (method: string = 'GET') => {
    return {
      method,
      headers: new Headers(),
    } as NextRequest;
  };

  test('should return 401 if user is not authenticated', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Unauthorized' } });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } }); // Use slug

    expect(response.status).toBe(401);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Unauthorized');
  });

  test('should return 404 if form is not found by slug or user does not have access', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    
    // Simulate form not found by slug
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn((column: string, value: string) => {
            if (column === 'slug' && value === testSlug) return mockFrom();
            if (column === 'userId' && value === testUserId) return mockFrom();
            return mockFrom();
          }),
          single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Not found' } }),
        };
      }
      return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } }); // Use slug

    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Form not found or access denied.');
  });

  test('should return CSV with only headers if form has no responses', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnValue({ // Ensure select returns 'this' for chaining
             eq: jest.fn((column: string, value: string) => {
              if (column === 'slug' && value === testSlug) return mockFrom();
              if (column === 'userId' && value === testUserId) return mockFrom();
              return mockFrom();
            }),
            single: jest.fn().mockResolvedValue({ data: { id: actualFormId }, error: null }), // Form found by slug
          }),
        };
      }
      if (table === 'Response') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn((column: string, value: string) => { // Responses fetched by actualFormId
            if (column === 'formId' && value === actualFormId) {
              return { data: [], error: null }; // Return empty array for responses
            }
            return { data: [], error: null }; // Default empty if not matching
          }),
        };
      }
       return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } }); // Use slug

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(`attachment; filename="responses-${testSlug}.csv"`); // Use slug in filename
    
    const csvData = await response.text();
    expect(csvData).toBe("ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared");
  });
  
  test('should return 404 if form fetch by slug results in a non-PGRST116 error', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Some other database error' } }),
        };
      }
      return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Form not found or access denied.');
  });

  test('should return 500 if there is a database error fetching responses', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { id: actualFormId }, error: null }),
          }),
        };
      }
      if (table === 'Response') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn((column: string, value: string) => {
            if (column === 'formId' && value === actualFormId) {
               return Promise.resolve({ data: null, error: { message: 'Responses DB error' } });
            }
            return Promise.resolve({ data: null, error: null });
          }),
        };
      }
      return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } }); // Use slug

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Failed to fetch responses.');
  });

  test('should successfully export responses as CSV when form is found by slug', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    
    const sampleResponses = [
      { 
        id: 'resp1', 
        createdAt: new Date('2023-01-01T10:00:00Z').toISOString(), 
        rating: 5, 
        text: 'Great!', 
        answer: null, 
        respondentName: 'John Doe', 
        respondentEmail: 'john@example.com', 
        shared: true 
      },
      // ... more responses if needed
    ];

    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn((column: string, value: string) => { // Form lookup by slug
              if (column === 'slug' && value === testSlug) return mockFrom();
              if (column === 'userId' && value === testUserId) return mockFrom();
              return mockFrom();
            }),
            single: jest.fn().mockResolvedValue({ data: { id: actualFormId }, error: null }), // Returns actualFormId
          }),
        };
      }
      if (table === 'Response') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn((column: string, value: string) => { // Responses lookup by actualFormId
            if (column === 'formId' && value === actualFormId) {
              return { data: sampleResponses, error: null };
            }
            return { data: [], error: null };
          }),
        };
      }
       return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } }); // Use slug

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(`attachment; filename="responses-${testSlug}.csv"`); // Use slug in filename

    const csvData = await response.text();
    const expectedCsvHeader = "ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared";
    const expectedCsvRow1 = `resp1,${new Date('2023-01-01T10:00:00Z').toISOString()},5,Great!,,John Doe,john@example.com,true`;
    
    const lines = csvData.split('\n');
    expect(lines[0]).toBe(expectedCsvHeader);
    expect(lines[1]).toBe(expectedCsvRow1);
  });
});
