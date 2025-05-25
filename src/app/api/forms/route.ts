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
      .from('Form')
      .select(`
        *,
        responses:Response(count)
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

    // Ensure user exists in our User table
    const { data: existingUser, error: userCheckError } = await supabase
      .from('User')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      // Create user in our User table
      const { error: createUserError } = await supabase
        .from('User')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0]
        })

      if (createUserError) {
        console.error('Error creating user:', createUserError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
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
      .from('Form')
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
