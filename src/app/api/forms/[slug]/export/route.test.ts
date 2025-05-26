import { GET } from './route'; // Assuming route.ts is in the same directory
import { createClient } from '@/lib/supabase/server'; // This will be the mock
import { NextRequest } from 'next/server';
// import { cookies } from 'next/headers'; // cookies() is called inside the actual createClient, not directly in the route handler anymore for client init

// Mock Supabase methods that will be used by the client instance
const mockAuthGetUser = jest.fn();
const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn((tableName: string) => {
  // Return structure that supports chaining: .select().eq().single() or .select().eq()
  return {
    select: jest.fn().mockReturnThis(), // Allows form.select('id').eq(...)
    eq: jest.fn((column, value) => { // Allows form.eq('slug', slug).eq('userId', userId)
      // For form fetching, which uses .single()
      if (tableName === 'Form') {
        return { single: mockSingle };
      }
      // For response fetching, which does not use .single() directly after eq
      // but expects the result of eq to be the final { data, error } object
      // This needs to be more flexible based on how it's called in the tests.
      // The actual implementation in tests below will override this per call.
      return { data: [], error: null }; 
    }),
    // Add other methods like .single() if needed directly on `from()` in some cases
    // single: mockSingle, // If from().single() was a pattern
  };
});


// Mock createClient from server
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({ // createClient takes no args and returns our mocked client
    auth: { getUser: mockAuthGetUser },
    from: mockFrom,
  })),
}));

// Mock next/headers
// cookies() is called within the actual createClient, so we might not need to mock it here
// unless other parts of the test setup or the route handler itself directly use it.
// The route handler itself no longer calls cookies() directly for createClient.
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('API Route: /api/forms/[slug]/export', () => {
  // We don't need mockSupabaseClient instance here anymore,
  // as createClient() is called inside GET and returns the mocked instance.
  // mockAuthGetUser and mockFrom are already defined above and are the jest.fn() mocks themselves.

  const actualFormId = 'form-id-for-responses-987';
  const testSlug = 'test-form-slug-123';
  const testUserId = 'user-abc-789';

  beforeEach(() => {
    // Reset all mock function states before each test
    mockAuthGetUser.mockReset();
    mockFrom.mockReset();
    mockSelect.mockReset(); // Ensure all parts of the chain are reset
    mockEq.mockReset();
    mockSingle.mockReset();

    // Default behavior for form fetching (can be overridden in specific tests)
    // This setup is crucial for tests that expect a successful form fetch.
    mockFrom.mockImplementation((table: string) => {
      if (table === 'Form') {
        return {
          select: jest.fn().mockReturnThis(), // .select('id')
          eq: jest.fn((column: string, value: string) => { // .eq('slug', ...) or .eq('userId', ...)
            // This needs to return an object that has .single()
            return { single: mockSingle };
          }),
        };
      }
      if (table === 'Response') {
        return {
          select: jest.fn().mockReturnThis(), // .select(...)
          eq: mockEq, // .eq('formId', actualFormId) - this will return { data, error }
        };
      }
      return {}; // Default empty object if table name doesn't match
    });
    // Default for .single() used in form fetch
    mockSingle.mockResolvedValue({ data: { id: actualFormId }, error: null });
    // Default for .eq() used in response fetch (which doesn't chain .single())
    mockEq.mockResolvedValue({ data: [], error: null }); 
  });

  const mockRequest = (method: string = 'GET') => {
    return {
      method,
      headers: new Headers(),
    } as NextRequest;
  };

  test('should return 401 if user is not authenticated', async () => {
    mockAuthGetUser.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Unauthorized' } });

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(401);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Unauthorized');
  });

  test('should return 404 if form is not found by slug or user does not have access', async () => {
    mockAuthGetUser.mockResolvedValueOnce({ data: { user: { id: testUserId } }, error: null });
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'Not found' } }); // Form.single() returns not found

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Form not found or access denied.');
  });

  test('should return CSV with only headers if form has no responses', async () => {
    mockAuthGetUser.mockResolvedValueOnce({ data: { user: { id: testUserId } }, error: null });
    // Form is found by default mockSingle setup (returns { data: { id: actualFormId }, error: null })
    mockEq.mockResolvedValueOnce({ data: [], error: null }); // Response.eq() returns empty data

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(`attachment; filename="responses-${testSlug}.csv"`);
    
    const csvData = await response.text();
    expect(csvData).toBe("ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared");
  });
  
  test('should return 404 if form fetch by slug results in a non-PGRST116 error', async () => {
    mockAuthGetUser.mockResolvedValueOnce({ data: { user: { id: testUserId } }, error: null });
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Some other database error' } }); // Form.single() returns other error

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Form not found or access denied.');
  });

  test('should return 500 if there is a database error fetching responses', async () => {
    mockAuthGetUser.mockResolvedValueOnce({ data: { user: { id: testUserId } }, error: null });
    // Form is found by default mockSingle setup
    mockEq.mockResolvedValueOnce({ data: null, error: { message: 'Responses DB error' } }); // Response.eq() returns error

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Failed to fetch responses.');
  });

  test('should successfully export responses as CSV when form is found by slug', async () => {
    mockAuthGetUser.mockResolvedValueOnce({ data: { user: { id: testUserId } }, error: null });
    // Form is found by default mockSingle setup
    
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
    ];
    mockEq.mockResolvedValueOnce({ data: sampleResponses, error: null }); // Response.eq() returns sample data

    const request = mockRequest();
    const response = await GET(request, { params: { slug: testSlug } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe(`attachment; filename="responses-${testSlug}.csv"`);

    const csvData = await response.text();
    const expectedCsvHeader = "ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared";
    const expectedCsvRow1 = `resp1,${new Date('2023-01-01T10:00:00Z').toISOString()},5,Great!,,John Doe,john@example.com,true`;
    
    const lines = csvData.split('\n');
    expect(lines[0]).toBe(expectedCsvHeader);
    expect(lines[1]).toBe(expectedCsvRow1);
  });
});
