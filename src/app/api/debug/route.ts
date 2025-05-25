import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in our User table
    const { data: dbUser, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at
      },
      dbUser: dbUser,
      userError: userError
    })
  } catch (error) {
    console.error('Debug API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
