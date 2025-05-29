const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('Running migration to add user fields and consent...')

  try {
    // Add new columns to Response table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE "Response" 
        ADD COLUMN IF NOT EXISTS "respondentCompany" TEXT,
        ADD COLUMN IF NOT EXISTS "respondentPhone" TEXT,
        ADD COLUMN IF NOT EXISTS "consentToShare" BOOLEAN NOT NULL DEFAULT false;
      `
    })

    if (error) {
      console.error('Migration error:', error)
      process.exit(1)
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

runMigration()
