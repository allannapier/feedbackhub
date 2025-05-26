import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      feedback = 'Great service!', 
      rating = '5', 
      customerName = 'Anonymous', 
      businessName = 'Our Business',
      format = 'facebook' // facebook, linkedin, instagram, twitter
    } = body

    // Generate a unique hash for this testimonial combination
    const testimonialId = crypto
      .createHash('md5')
      .update(`${feedback}-${rating}-${customerName}-${businessName}-${format}`)
      .digest('hex')

    const fileName = `testimonial-${testimonialId}-${format}.png`
    
    // Check if image already exists in storage
    const { data: existingFile } = await supabase.storage
      .from('testimonials')
      .list('', { search: fileName })

    if (existingFile && existingFile.length > 0) {
      // Return existing URL
      const { data: { publicUrl } } = supabase.storage
        .from('testimonials')
        .getPublicUrl(fileName)
      
      return NextResponse.json({ 
        success: true, 
        imageUrl: publicUrl,
        cached: true 
      })
    }

    // Generate new image
    const clampedRating = Math.max(1, Math.min(5, parseInt(rating)))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    
    // Truncate feedback for better display
    const maxFeedbackLength = format === 'instagram' ? 120 : format === 'twitter' ? 80 : 100
    const truncatedFeedback = feedback.length > maxFeedbackLength 
      ? feedback.substring(0, maxFeedbackLength) + '...' 
      : feedback

    // Set dimensions and styling based on format
    const getFormatConfig = () => {
      switch (format) {
        case 'instagram':
          return {
            width: 1080,
            height: 1080,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            accentColor: '#4f46e5',
            businessFontSize: '48px',
            quoteFontSize: '100px',
            feedbackFontSize: '36px',
            starsFontSize: '48px',
            nameFontSize: '32px'
          }
        case 'linkedin':
          return {
            width: 1200,
            height: 627,
            gradient: 'linear-gradient(135deg, #0077B5 0%, #00a0dc 100%)',
            accentColor: '#0077B5',
            businessFontSize: '40px',
            quoteFontSize: '80px',
            feedbackFontSize: '28px',
            starsFontSize: '40px',
            nameFontSize: '24px'
          }
        case 'twitter':
          return {
            width: 1200,
            height: 675,
            gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%)',
            accentColor: '#1DA1F2',
            businessFontSize: '36px',
            quoteFontSize: '72px',
            feedbackFontSize: '24px',
            starsFontSize: '36px',
            nameFontSize: '20px'
          }
        default: // facebook
          return {
            width: 1200,
            height: 630,
            gradient: 'linear-gradient(135deg, #4267B2 0%, #5b7bd5 100%)',
            accentColor: '#4267B2',
            businessFontSize: '36px',
            quoteFontSize: '80px',
            feedbackFontSize: '28px',
            starsFontSize: '40px',
            nameFontSize: '24px'
          }
      }
    }

    const config = getFormatConfig()

    // Generate the image
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            background: config.gradient,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            padding: format === 'instagram' ? '60px' : '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: format === 'instagram' ? '32px' : '24px',
              padding: format === 'instagram' ? '80px' : '60px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '90%',
              textAlign: 'center',
              border: format === 'linkedin' ? `4px solid ${config.accentColor}` : 'none',
            }}
          >
            {/* Business Name */}
            <div
              style={{
                fontSize: config.businessFontSize,
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              {businessName}
            </div>
            
            {/* Quote Symbol */}
            <div
              style={{
                fontSize: config.quoteFontSize,
                color: config.accentColor,
                marginBottom: '32px',
                lineHeight: 1,
              }}
            >
              "
            </div>
            
            {/* Feedback Text */}
            <div
              style={{
                fontSize: config.feedbackFontSize,
                color: '#374151',
                lineHeight: 1.4,
                marginBottom: '40px',
                fontStyle: 'italic',
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {truncatedFeedback}
            </div>
            
            {/* Stars */}
            <div
              style={{
                fontSize: config.starsFontSize,
                marginBottom: '32px',
                color: '#fbbf24',
              }}
            >
              {stars}
            </div>
            
            {/* Customer Name */}
            <div
              style={{
                fontSize: config.nameFontSize,
                color: '#6b7280',
                fontWeight: 600,
                marginBottom: '24px',
              }}
            >
              — {customerName}
            </div>
            
            {/* Powered by */}
            <div
              style={{
                fontSize: format === 'instagram' ? '20px' : '16px',
                color: config.accentColor,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Powered by FeedbackHub
            </div>
          </div>
        </div>
      ),
      {
        width: config.width,
        height: config.height,
      }
    )

    // Convert to buffer
    const imageBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)
    
    console.log(`Generated image buffer: ${buffer.length} bytes`)
    console.log(`Uploading to bucket: testimonials, filename: ${fileName}`)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      })

    console.log('Upload result:', { uploadData, uploadError })

    if (uploadError) {
      console.error('Upload error details:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    console.log('Upload successful, getting public URL...')

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('testimonials')
      .getPublicUrl(fileName)
      
    console.log('Public URL:', publicUrl)

    // Debug: List bucket contents to verify upload
    try {
      const { data: bucketContents, error: listError } = await supabase.storage
        .from('testimonials')
        .list('')
      console.log('Bucket contents after upload:', bucketContents)
      if (listError) console.error('List error:', listError)
    } catch (listErr) {
      console.error('Error listing bucket:', listErr)
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      cached: false,
      testimonialId,
      uploadData: uploadData
    })

  } catch (error: any) {
    console.error('Error generating testimonial:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testimonialId = searchParams.get('id')
    const format = searchParams.get('format') || 'facebook'

    if (!testimonialId) {
      return NextResponse.json(
        { success: false, error: 'Missing testimonial ID' },
        { status: 400 }
      )
    }

    const fileName = `testimonial-${testimonialId}-${format}.png`
    
    // Get the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('testimonials')
      .download(fileName)

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    // Convert blob to buffer
    const buffer = await data.arrayBuffer()

    // Return the image with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })

  } catch (error: any) {
    console.error('Error serving testimonial image:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
