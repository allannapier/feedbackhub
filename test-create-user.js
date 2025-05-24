// Test creating a user in the database
// Run this with: node test-create-user.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fcedxvdoercnkyhnzwzf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZWR4dmRvZXJjbmt5aG56d3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxODkwMzksImV4cCI6MjA0NTc2NTAzOX0.7rVUdEq-eog3TLuEk98Knd61-iHftVJCpwKoLEmuPvY'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZWR4dmRvZXJjbmt5aG56d3pmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDE4OTAzOSwiZXhwIjoyMDQ1NzY1MDM5fQ.EZNltw6eeVs0rkNGcLX7j7F3S3YMUgkrRiWzh1TASMI'

const supabase = createClient(supabaseUrl, serviceKey)

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // First check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('*')
      .eq('email', 'napieraiagent@gmail.com')
      .single()
    
    if (existingUser) {
      console.log('User already exists:', existingUser)
      return existingUser
    }
    
    // Get the auth user ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error listing auth users:', authError)
      return
    }
    
    const authUser = authUsers.users.find(u => u.email === 'napieraiagent@gmail.com')
    
    if (!authUser) {
      console.error('Auth user not found')
      return
    }
    
    console.log('Found auth user:', authUser.id, authUser.email)
    
    // Create user in our User table
    const { data: newUser, error: createError } = await supabase
      .from('User')
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || null
      })
      .select()
      .single()
    
    if (createError) {
      console.error('Error creating user:', createError)
      return
    }
    
    console.log('✅ User created successfully:', newUser)
    return newUser
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createTestUser()
