import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { 
      formId, 
      rating, 
      text, 
      answer, 
      respondentEmail, 
      respondentName 
    } = body

    // Validate required fields
    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      )
    }

    // Verify form exists and is active
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, isActive')
      .eq('id', formId)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (!form.isActive) {
      return NextResponse.json({ error: 'Form is not active' }, { status: 400 })
    }

    // Create response
    const { data: response, error } = await supabase
      .from('responses')
      .insert({
        formId,
        rating,
        text,
        answer,
        respondentEmail,
        respondentName
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating response:', error)
      return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
    }

    return NextResponse.json({ response }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
