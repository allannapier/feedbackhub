import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { migration_key } = await request.json()
    
    // Simple security check - you should remove this endpoint after use
    if (migration_key !== 'add_user_fields_migration_2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Apply migration using raw SQL
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
      return NextResponse.json({ error: 'Migration failed', details: error }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Migration completed successfully'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
