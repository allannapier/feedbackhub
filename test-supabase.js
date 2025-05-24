// Test Supabase connection
// Run this with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fcedxvdoercnkyhnzwzf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZWR4dmRvZXJjbmt5aG56d3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxODkwMzksImV4cCI6MjA0NTc2NTAzOX0.7rVUdEq-eog3TLuEk98Knd61-iHftVJCpwKoLEmuPvY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('Connection error:', error.message)
      if (error.message.includes('relation "User" does not exist')) {
        console.log('✅ Connection successful! Database schema needs to be created.')
      }
    } else {
      console.log('✅ Connection successful! Tables exist.')
      console.log('Data:', data)
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
  }
}

testConnection()
