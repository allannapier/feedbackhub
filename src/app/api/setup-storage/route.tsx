import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if the testimonials bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets()

    if (listError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Error listing buckets: ' + listError.message 
      })
    }

    const testimonialsExists = buckets?.some(bucket => bucket.name === 'testimonials')

    if (!testimonialsExists) {
      // Create the testimonials bucket
      const { data, error } = await supabase
        .storage
        .createBucket('testimonials', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg'],
          fileSizeLimit: 1024 * 1024 * 5 // 5MB limit
        })

      if (error) {
        return NextResponse.json({ 
          success: false, 
          error: 'Error creating bucket: ' + error.message 
        })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Testimonials bucket created successfully',
        bucketCreated: true
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'Testimonials bucket already exists',
        bucketCreated: false
      })
    }

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
