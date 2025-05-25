import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: forms, error } = await supabase
      .from('forms')
      .select(`
        *,
        responses:responses(count)
      `)
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching forms:', error)
      return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
    }

    return NextResponse.json({ forms })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, question, type, settings } = body

    // Validate required fields
    if (!title || !question || !type) {
      return NextResponse.json(
        { error: 'Title, question, and type are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = generateSlug(10)

    const { data: form, error } = await supabase
      .from('forms')
      .insert({
        userId: user.id,
        title,
        question,
        type,
        slug,
        settings: settings || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating form:', error)
      return NextResponse.json({ error: 'Failed to create form' }, { status: 500 })
    }

    return NextResponse.json({ form }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
