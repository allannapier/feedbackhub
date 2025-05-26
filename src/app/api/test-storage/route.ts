import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase storage connection...')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Service key exists:', !!supabaseServiceKey)
    
    // Test listing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    console.log('Available buckets:', buckets)
    if (bucketsError) console.error('Buckets error:', bucketsError)
    
    // Test listing testimonials bucket specifically
    const { data: bucketContents, error: listError } = await supabase.storage
      .from('testimonials')
      .list('')
    console.log('Testimonials bucket contents:', bucketContents)
    if (listError) console.error('List error:', listError)
    
    // Test creating a simple file
    const testBuffer = Buffer.from('test file content')
    const testFileName = `test-${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(testFileName, testBuffer, {
        contentType: 'text/plain',
        upsert: true
      })
    
    console.log('Test upload result:', { uploadData, uploadError })
    
    return NextResponse.json({
      success: true,
      buckets: buckets,
      bucketsError: bucketsError,
      bucketContents: bucketContents,
      listError: listError,
      testUpload: { uploadData, uploadError }
    })
    
  } catch (error: any) {
    console.error('Storage test error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
