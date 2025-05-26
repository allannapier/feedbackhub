import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to convert JSON data to CSV
function convertToCSV(data: any[], identifier: string) { // Changed formId to identifier
  if (!data || data.length === 0) {
     return "ID,CreatedAt,Rating,Text,Answer,RespondentName,RespondentEmail,Shared";
  }

  const headers = ["ID","CreatedAt","Rating","Text","Answer","RespondentName","RespondentEmail","Shared"];
  const csvRows = [headers.join(',')];

  const keyMap: { [key: string]: string } = {
    ID: 'id',
    CreatedAt: 'createdAt',
    Rating: 'rating',
    Text: 'text',
    Answer: 'answer',
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
        if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
      } else if (value instanceof Date) {
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
  { params }: { params: { slug: string } } // Changed from formId to slug
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { slug } = params; // Changed from formId to slug

  // 1. Authenticate the user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Fetch the Form using slug and userId to get the actual form.id
  const { data: form, error: formError } = await supabase
    .from('Form')
    .select('id') // We need the actual ID to fetch responses
    .eq('slug', slug) // Use slug to find the form
    .eq('userId', user.id)
    .single();

  if (formError || !form) {
    if (formError && formError.code !== 'PGRST116') {
      console.error('Error fetching form by slug:', formError);
    }
    return new NextResponse(
      JSON.stringify({ error: 'Form not found or access denied.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const formId = form.id; // This is the actual ID for the Response table

  // 3. Fetch responses for the given formId
  const { data: responses, error: responsesError } = await supabase
    .from('Response')
    .select('id, createdAt, rating, text, answer, respondentName, respondentEmail, shared')
    .eq('formId', formId); // Use the fetched formId here

  if (responsesError) {
    console.error('Error fetching responses:', responsesError);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch responses.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // If no responses, convertToCSV will return only headers
  const csvData = convertToCSV(responses || [], slug); // Pass slug for consistency if needed by convertToCSV

  // 5. Return CSV data with appropriate headers
  return new Response(csvData, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="responses-${slug}.csv"`, // Use slug in filename
    },
  });
}
