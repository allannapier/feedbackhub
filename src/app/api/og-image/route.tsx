import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = parseInt(searchParams.get('rating') || '5')
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    
    // Generate star display (clamp to 1-5 range)
    const clampedRating = Math.max(1, Math.min(5, rating))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    
    return new ImageResponse(
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
              }}
            >
              {businessName}
            </div>
            
            <div
              style={{
                fontSize: '72px',
                color: '#4f46e5',
                marginBottom: '24px',
                lineHeight: 1,
              }}
            >
              "
            </div>
            
            <div
              style={{
                fontSize: '28px',
                color: '#374151',
                lineHeight: 1.4,
                marginBottom: '32px',
                fontStyle: 'italic',
                maxWidth: '80%',
              }}
            >
              {feedback}
            </div>
            
            <div
              style={{
                fontSize: '36px',
                marginBottom: '24px',
                color: '#fbbf24',
              }}
            >
              {stars}
            </div>
            
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              — {customerName}
            </div>
            
            <div
              style={{
                fontSize: '16px',
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
    console.error('Error generating OG image:', e.message)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
