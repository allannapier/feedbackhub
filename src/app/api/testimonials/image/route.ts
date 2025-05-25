import { NextRequest } from 'next/server'
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = parseInt(searchParams.get('rating') || '5')
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    
    // Generate star display (only for star ratings, clamp to 1-5 range)
    const clampedRating = Math.max(1, Math.min(5, rating))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '60px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '1000px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '30px',
              }}
            >
              {businessName}
            </div>            
            <div
              style={{
                fontSize: '100px',
                color: '#4f46e5',
                marginBottom: '30px',
                lineHeight: 1,
              }}
            >
              "
            </div>
            
            <div
              style={{
                fontSize: '36px',
                color: '#374151',
                lineHeight: 1.4,
                marginBottom: '40px',
                fontStyle: 'italic',
                maxWidth: '800px',
                textAlign: 'center',
              }}
            >
              {feedback}
            </div>
            
            <div
              style={{
                fontSize: '48px',
                marginBottom: '30px',
                color: '#fbbf24',
              }}
            >
              {stars}
            </div>
            
            <div
              style={{
                fontSize: '28px',
                color: '#6b7280',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              — {customerName}
            </div>
            
            <div
              style={{
                fontSize: '18px',
                color: '#9ca3af',
              }}
            >
              Powered by FeedbackHub
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('Error generating testimonial image:', e.message)
    return new Response(`Failed to generate testimonial: ${e.message}`, {
      status: 500,
    })
  }
}