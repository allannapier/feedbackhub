const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage...')
    
    // Check if the testimonials bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets()

    if (listError) {
      console.error('Error listing buckets:', listError)
      return
    }

    const testimonialsExists = buckets.some(bucket => bucket.name === 'testimonials')

    if (!testimonialsExists) {
      console.log('Creating testimonials bucket...')
      const { data, error } = await supabase
        .storage
        .createBucket('testimonials', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg'],
          fileSizeLimit: 1024 * 1024 * 5 // 5MB limit
        })

      if (error) {
        console.error('Error creating bucket:', error)
      } else {
        console.log('✅ Testimonials bucket created successfully')
      }
    } else {
      console.log('✅ Testimonials bucket already exists')
    }

    console.log('🚀 Storage setup complete!')
    
  } catch (error) {
    console.error('❌ Error setting up storage:', error)
  }
}

setupStorage()
