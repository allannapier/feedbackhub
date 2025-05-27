import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    // Debug timestamp to ensure fresh deployment
    console.log('Image generation started at:', new Date().toISOString())
    
    const body = await request.json()
    const { 
      feedback = 'Great service!', 
      rating = '5', 
      customerName = 'Anonymous', 
      businessName = 'Our Business',
      format = 'facebook', // facebook, linkedin, instagram, twitter
      directDownload = false // New parameter for direct download
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
      // If requesting direct download and file exists, return it
      if (directDownload) {
        const { data, error } = await supabase.storage
          .from('testimonials')
          .download(fileName)
        
        if (data && !error) {
          const buffer = await data.arrayBuffer()
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Content-Disposition': `attachment; filename="${fileName}"`,
            },
          })
        }
      }
      
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

    // Generate the image - PROFESSIONAL DESIGN
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: config.gradient,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
            padding: '80px 60px',
          }}
        >
          {/* Background decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: '24px',
            }}
          />
          
          {/* Quote icon */}
          <div
            style={{
              fontSize: config.quoteFontSize,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '40px',
              fontWeight: 'bold',
            }}
          >
            "
          </div>
          
          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '90%',
              zIndex: 2,
            }}
          >
            {/* Feedback text */}
            <div
              style={{
                fontSize: config.feedbackFontSize,
                color: 'white',
                lineHeight: 1.4,
                marginBottom: '40px',
                fontWeight: '400',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
            >
              {truncatedFeedback}
            </div>
            
            {/* Stars */}
            <div
              style={{
                fontSize: config.starsFontSize,
                color: '#FFD700',
                marginBottom: '30px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                letterSpacing: '4px',
              }}
            >
              {stars}
            </div>
            
            {/* Customer name */}
            <div
              style={{
                fontSize: config.nameFontSize,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '600',
                marginBottom: '50px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              — {customerName}
            </div>
            
            {/* Business name */}
            <div
              style={{
                fontSize: config.businessFontSize,
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '20px 40px',
                borderRadius: '50px',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              {businessName}
            </div>
          </div>
          
          {/* Bottom branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: '500',
            }}
          >
            Powered by FeedbackHub
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

    // If requesting direct download, return the image buffer directly
    if (directDownload) {
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    }

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
    
    // Get parameters
    const feedback = searchParams.get('feedback')
    const rating = searchParams.get('rating') || '5'
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    const format = searchParams.get('format') || 'facebook'
    const download = searchParams.get('download') === 'true'
    const id = searchParams.get('id') // For existing testimonial downloads
    
    // Case 1: Download existing testimonial by ID
    if (id && !feedback) {
      const fileName = `testimonial-${id}-${format}.png`
      
      const { data, error } = await supabase.storage
        .from('testimonials')
        .download(fileName)

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Image not found' },
          { status: 404 }
        )
      }

      const buffer = await data.arrayBuffer()
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    }
    
    // Case 2: Generate and download new testimonial
    if (feedback && download) {
      // Generate the testimonial ID
      const testimonialId = crypto
        .createHash('md5')
        .update(`${feedback}-${rating}-${customerName}-${businessName}-${format}`)
        .digest('hex')

      const fileName = `testimonial-${testimonialId}-${format}.png`
      
      // Check if already exists
      const { data: existingFile } = await supabase.storage
        .from('testimonials')
        .list('', { search: fileName })

      if (existingFile && existingFile.length > 0) {
        // Download existing file
        const { data, error } = await supabase.storage
          .from('testimonials')
          .download(fileName)
        
        if (data && !error) {
          const buffer = await data.arrayBuffer()
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Content-Disposition': `attachment; filename="${fileName}"`,
            },
          })
        }
      }
      
      // Generate new image
      const clampedRating = Math.max(1, Math.min(5, parseInt(rating)))
      const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
      const maxFeedbackLength = format === 'instagram' ? 120 : format === 'twitter' ? 80 : 100
      const truncatedFeedback = feedback.length > maxFeedbackLength 
        ? feedback.substring(0, maxFeedbackLength) + '...' 
        : feedback

      const getFormatConfig = () => {
        switch (format) {
          case 'instagram':
            return { width: 1080, height: 1080, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
          case 'linkedin':
            return { width: 1200, height: 627, gradient: 'linear-gradient(135deg, #0077B5 0%, #00a0dc 100%)' }
          case 'twitter':
            return { width: 1200, height: 675, gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%)' }
          default: // facebook
            return { width: 1200, height: 630, gradient: 'linear-gradient(135deg, #4267B2 0%, #5b7bd5 100%)' }
        }
      }

      const config = getFormatConfig()

      const imageResponse = new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: config.gradient,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'Inter, system-ui, sans-serif',
              position: 'relative',
              padding: '80px 60px',
            }}
          >
            {/* Background decorative elements */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                borderRadius: '24px',
              }}
            />
            
            {/* Quote icon */}
            <div
              style={{
                fontSize: format === 'instagram' ? '80px' : '60px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '40px',
                fontWeight: 'bold',
              }}
            >
              "
            </div>
            
            {/* Main content container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                maxWidth: '90%',
                zIndex: 2,
              }}
            >
              {/* Feedback text */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '32px' : format === 'twitter' ? '22px' : '26px',
                  color: 'white',
                  lineHeight: 1.4,
                  marginBottom: '40px',
                  fontWeight: '400',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                }}
              >
                {truncatedFeedback}
              </div>
              
              {/* Stars */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '40px' : format === 'twitter' ? '32px' : '36px',
                  color: '#FFD700',
                  marginBottom: '30px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  letterSpacing: '4px',
                }}
              >
                {stars}
              </div>
              
              {/* Customer name */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '28px' : format === 'twitter' ? '18px' : '22px',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: '600',
                  marginBottom: '50px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                — {customerName}
              </div>
              
              {/* Business name */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '40px' : format === 'twitter' ? '30px' : '32px',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  padding: '20px 40px',
                  borderRadius: '50px',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                {businessName}
              </div>
            </div>
            
            {/* Bottom branding */}
            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '40px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '500',
              }}
            >
              Powered by FeedbackHub
            </div>
          </div>
        ),
        {
          width: config.width,
          height: config.height,
        }
      )

      const imageBuffer = await imageResponse.arrayBuffer()
      const buffer = Buffer.from(imageBuffer)

      // Upload to storage for future use
      await supabase.storage
        .from('testimonials')
        .upload(fileName, buffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true
        })

      // Return image directly
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Missing required parameters. Provide either id or feedback with download=true' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Error serving testimonial image:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
