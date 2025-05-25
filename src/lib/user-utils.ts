import { createClient } from '@/lib/supabase/server'

export async function ensureUserExists(authUser: any) {
  const supabase = await createClient()
  
  // Check if user exists in our User table
  const { data: existingUser, error: userCheckError } = await supabase
    .from('User')
    .select('id')
    .eq('id', authUser.id)
    .single()

  if (!existingUser) {
    // Create user in our User table
    const { error: createUserError } = await supabase
      .from('User')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0]
      })

    if (createUserError) {
      throw new Error(`Failed to create user profile: ${createUserError.message}`)
    }
  }
  
  return true
}
