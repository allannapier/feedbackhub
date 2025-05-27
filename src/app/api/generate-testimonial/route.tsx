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
      format = 'facebook'
    } = body

    const testimonialId = crypto
      .createHash('md5')
      .update(`${feedback}-${rating}-${customerName}-${businessName}-${format}`)
      .digest('hex')

    const fileName = `testimonial-${testimonialId}-${format}.png`
    
    const { data: existingFile } = await supabase.storage
      .from('testimonials')
      .list('', { search: fileName })

    if (existingFile && existingFile.length > 0) {
      const { data: { publicUrl } } = supabase.storage
        .from('testimonials')
        .getPublicUrl(fileName)
      
      return NextResponse.json({ 
        success: true, 
        imageUrl: publicUrl,
        cached: true,
        testimonialId
      })
    }

    const clampedRating = Math.max(1, Math.min(5, parseInt(rating)))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    const truncatedFeedback = feedback.length > 100 ? feedback.substring(0, 100) + '...' : feedback

    const config = format === 'instagram' 
      ? { width: 1080, height: 1080 }
      : format === 'linkedin' 
      ? { width: 1200, height: 627 }
      : format === 'twitter'
      ? { width: 1200, height: 675 }
      : { width: 1200, height: 630 }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '60px',
              borderRadius: '20px',
              width: '600px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '60px', color: '#2563eb', marginBottom: '20px' }}>
              "
            </div>
            
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '30px' }}>
              {businessName}
            </div>
            
            <div style={{ fontSize: '20px', color: '#374151', fontStyle: 'italic', marginBottom: '30px' }}>
              {truncatedFeedback}
            </div>
            
            <div style={{ fontSize: '36px', color: '#fbbf24', marginBottom: '20px' }}>
              {stars}
            </div>
            
            <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '20px' }}>
              {clampedRating} out of 5 stars
            </div>
            
            <div style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600', marginBottom: '20px' }}>
              — {customerName}
            </div>
            
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>
              VERIFIED CUSTOMER REVIEW
            </div>
            
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
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

    const imageBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)

    await supabase.storage
      .from('testimonials')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      })

    const { data: { publicUrl } } = supabase.storage
      .from('testimonials')
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      cached: false,
      testimonialId
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
    
    const feedback = searchParams.get('feedback')
    const rating = searchParams.get('rating') || '5'
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    const format = searchParams.get('format') || 'facebook'
    const download = searchParams.get('download') === 'true'
    
    if (!feedback || !download) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const testimonialId = crypto
      .createHash('md5')
      .update(`${feedback}-${rating}-${customerName}-${businessName}-${format}`)
      .digest('hex')

    const fileName = `testimonial-${testimonialId}-${format}.png`
    
    const { data: existingFile } = await supabase.storage
      .from('testimonials')
      .list('', { search: fileName })

    if (existingFile && existingFile.length > 0) {
      const { data, error } = await supabase.storage
        .from('testimonials')
        .download(fileName)
      
      if (data && !error) {
        const buffer = await data.arrayBuffer()
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${fileName}"`,
          },
        })
      }
    }
    
    // Generate new image
    const clampedRating = Math.max(1, Math.min(5, parseInt(rating)))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    const truncatedFeedback = feedback.length > 100 ? feedback.substring(0, 100) + '...' : feedback

    const config = format === 'instagram' 
      ? { width: 1080, height: 1080 }
      : format === 'linkedin' 
      ? { width: 1200, height: 627 }
      : format === 'twitter'
      ? { width: 1200, height: 675 }
      : { width: 1200, height: 630 }

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '60px',
              borderRadius: '20px',
              width: '600px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '60px', color: '#2563eb', marginBottom: '20px' }}>
              "
            </div>
            
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb', marginBottom: '30px' }}>
              {businessName}
            </div>
            
            <div style={{ fontSize: '20px', color: '#374151', fontStyle: 'italic', marginBottom: '30px' }}>
              {truncatedFeedback}
            </div>
            
            <div style={{ fontSize: '36px', color: '#fbbf24', marginBottom: '20px' }}>
              {stars}
            </div>
            
            <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '20px' }}>
              {clampedRating} out of 5 stars
            </div>
            
            <div style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600', marginBottom: '20px' }}>
              — {customerName}
            </div>
            
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>
              VERIFIED CUSTOMER REVIEW
            </div>
            
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
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

    const imageBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)

    await supabase.storage
      .from('testimonials')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
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
