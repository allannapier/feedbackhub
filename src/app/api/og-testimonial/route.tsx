import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = parseInt(searchParams.get('rating') || '5')
    const customerName = searchParams.get('name') || 'A satisfied customer'
    const businessName = searchParams.get('business') || 'Our Business'
    
    const stars = '★'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(5 - Math.max(1, Math.min(5, rating)))
    
    // Truncate feedback for better display
    const truncatedFeedback = feedback.length > 120 ? feedback.substring(0, 120) + '...' : feedback

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #4338ca 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
            padding: '60px',
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
              borderRadius: '20px',
            }}
          />
          
          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '90%',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '50px',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            {/* Large decorative quote */}
            <div
              style={{
                fontSize: '80px',
                color: 'rgba(37,99,235,0.3)',
                marginBottom: '20px',
                fontWeight: 'bold',
                lineHeight: '1',
              }}
            >
              "
            </div>
            
            {/* Business name */}
            <div
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '30px',
              }}
            >
              {businessName}
            </div>
            
            {/* Feedback text */}
            <div
              style={{
                fontSize: '24px',
                color: '#374151',
                lineHeight: 1.4,
                marginBottom: '30px',
                fontStyle: 'italic',
                maxWidth: '100%',
              }}
            >
              {truncatedFeedback}
            </div>
            
            {/* Stars */}
            <div
              style={{
                fontSize: '40px',
                color: '#fbbf24',
                marginBottom: '20px',
                letterSpacing: '4px',
              }}
            >
              {stars}
            </div>
            
            {/* Customer name */}
            <div
              style={{
                fontSize: '20px',
                color: '#6b7280',
                fontWeight: '600',
                marginBottom: '30px',
              }}
            >
              — {customerName}
            </div>
            
            {/* Branding */}
            <div
              style={{
                fontSize: '16px',
                color: '#9ca3af',
                fontWeight: '500',
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
  } catch (error: any) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
