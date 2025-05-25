import { GET } from './route'; // Adjust path as necessary
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
    // Mock necessary cookie methods if your createClient uses them
    get: jest.fn(), 
    // ... other methods
  })),
}));


describe('API Route: /api/forms/[formId]/export', () => {
  let mockSupabaseClient: any;
  let mockAuthGetUser: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    // Reset mocks for each test
    mockAuthGetUser = (createClient() as any).auth.getUser;
    mockFrom = (createClient() as any).from;
    
    mockAuthGetUser.mockReset();
    mockFrom.mockReset();

    // Default behavior for from().select().eq().single() and from().select().eq()
    // This allows chaining and can be overridden in specific tests
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
      // Add other properties as needed by your handler
    } as NextRequest;
  };

  const testFormId = 'test-form-123';
  const testUserId = 'user-abc-789';

  test('should return 401 if user is not authenticated', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Unauthorized' } });

    const request = mockRequest();
    const response = await GET(request, { params: { formId: testFormId } });

    expect(response.status).toBe(401);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Unauthorized');
  });

  test('should return 404 if form is not found or user does not have access', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    // Simulate form not found (default mockFrom behavior) or explicitly:
    mockFrom.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn((col, val) => { // Check which eq is called
        if (col === 'id' && val === testFormId) return mockFrom(); // chain
        if (col === 'userId' && val === testUserId) return mockFrom(); // chain
        return mockFrom();
      }),
      single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Not found' } }),
    }));

    const request = mockRequest();
    const response = await GET(request, { params: { formId: testFormId } });

    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Form not found or access denied.');
  });

  test('should return CSV with only headers if form has no responses', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    // Form found
    const formMock = mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: testFormId, userId: testUserId }, error: null }),
        };
      }
      if (table === 'Response') { // No responses
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: [], error: null }),
        };
      }
      return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() };
    });


    const request = mockRequest();
    const response = await GET(request, { params: { formId: testFormId } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(`attachment; filename="responses-${testFormId}.csv"`);
    
    const csvData = await response.text();
    expect(csvData).toBe("ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared");
  });

  test('should return 500 if there is a database error fetching form', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        };
      }
       return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { formId: testFormId } });

    expect(response.status).toBe(404); // The code returns 404 if form error and not PGRST116
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Form not found or access denied.');
  });
  
   test('should return 500 if there is a database error fetching responses', async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: testUserId } }, error: null });
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: testFormId, userId: testUserId }, error: null }),
        };
      }
      if (table === 'Response') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Responses DB error' } }),
        };
      }
       return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { formId: testFormId } });

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Failed to fetch responses.');
  });


  test('should successfully export responses as CSV', async () => {
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
      { 
        id: 'resp2', 
        createdAt: new Date('2023-01-02T11:30:00Z').toISOString(), 
        rating: null, 
        text: 'Okay product, "could be better"', 
        answer: 'Maybe', 
        respondentName: 'Jane, Smith', 
        respondentEmail: 'jane@example.com', 
        shared: false 
      },
    ];

    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: testFormId, userId: testUserId }, error: null }),
        };
      }
      if (table === 'Response') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: sampleResponses, error: null }),
        };
      }
      return { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis() };
    });

    const request = mockRequest();
    const response = await GET(request, { params: { formId: testFormId } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(`attachment; filename="responses-${testFormId}.csv"`);

    const csvData = await response.text();
    const expectedCsvHeader = "ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared";
    const expectedCsvRow1 = `resp1,${new Date('2023-01-01T10:00:00Z').toISOString()},5,Great!,,John Doe,john@example.com,true`;
    const expectedCsvRow2 = `resp2,${new Date('2023-01-02T11:30:00Z').toISOString()},,"Okay product, ""could be better""","Maybe","Jane, Smith",jane@example.com,false`;
    
    const lines = csvData.split('\n');
    expect(lines[0]).toBe(expectedCsvHeader);
    expect(lines[1]).toBe(expectedCsvRow1);
    expect(lines[2]).toBe(expectedCsvRow2);
  });
});
