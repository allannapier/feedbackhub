import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to convert JSON data to CSV
// Based on the provided example, with corrections for key mapping and escaping
function convertToCSV(data: any[], formId: string) {
  if (!data || data.length === 0) {
    // Return header even if there's no data, or an empty string if preferred
    // For this case, let's return header + a line indicating no responses
    // return "ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared\nNo responses found for this form.";
    // Or, more simply, just the header if empty data means an empty CSV body is expected.
     return "ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared";
  }

  const headers = ["ID","CreatedAt","Rating","Text","Answer","RespondentName","RespondentEmail","Shared"];
  const csvRows = [headers.join(',')];

  const keyMap: { [key: string]: string } = {
    ID: 'id',
    CreatedAt: 'createdAt',
    Rating: 'rating',
    Text: 'text',
    Answer: 'answer', // Assuming 'answer' is a direct field name in your Response table
    RespondentName: 'respondentName',
    RespondentEmail: 'respondentEmail',
    Shared: 'shared'
  };

  data.forEach(item => {
    const values = headers.map(header => {
      const key = keyMap[header];
      let value = item[key];

      if (value === null || typeof value === 'undefined') {
        value = '';
      } else if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      } else if (typeof value === 'number') {
        value = String(value);
      } else if (typeof value === 'string') {
        // Escape quotes and handle commas/newlines/carriage returns
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
      }
      // For Date objects, format them appropriately
      else if (value instanceof Date) {
        value = value.toISOString();
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  return csvRows.join('\n');
}


export async function GET(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { formId } = params;

  // 1. Authenticate the user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Verify form ownership
  const { data: form, error: formError } = await supabase
    .from('Form') // Ensure your table name is correct, e.g., 'forms' or 'Form'
    .select('id, userId') // Select userId to confirm ownership
    .eq('id', formId)
    .eq('userId', user.id)
    .single();

  if (formError || !form) {
    // Log the error for debugging if it's a server error, not just 'not found'
    if (formError && formError.code !== 'PGRST116') { // PGRST116: 'single' row not found
      console.error('Error fetching form:', formError);
    }
    return new NextResponse(
      JSON.stringify({ error: 'Form not found or access denied.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Fetch responses for the given formId
  // Ensure your 'Response' table is named correctly, e.g., 'responses' or 'Response'
  // And field names like 'respondentName', 'respondentEmail' are correct.
  const { data: responses, error: responsesError } = await supabase
    .from('Response') // Ensure your table name is correct
    .select('id, createdAt, rating, text, answer, respondentName, respondentEmail, shared')
    .eq('formId', formId);

  if (responsesError) {
    console.error('Error fetching responses:', responsesError);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch responses.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!responses || responses.length === 0) {
    // Return CSV with only headers if no responses, or a message
    const csvData = convertToCSV([], formId); // Pass empty array
     return new Response(csvData, {
      status: 200, // OK, but data is empty
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="responses-${formId}.csv"`,
      },
    });
  }

  // 4. Convert response data to CSV
  const csvData = convertToCSV(responses, formId);

  // 5. Return CSV data with appropriate headers
  return new Response(csvData, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="responses-${formId}.csv"`,
    },
  });
}
