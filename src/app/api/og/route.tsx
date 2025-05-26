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
    const platform = searchParams.get('platform') || 'facebook' // facebook, linkedin, twitter
    
    // Generate star display
    const clampedRating = Math.max(1, Math.min(5, rating))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    
    // Truncate feedback for better display
    const maxFeedbackLength = platform === 'twitter' ? 80 : 120
    const truncatedFeedback = feedback.length > maxFeedbackLength 
      ? feedback.substring(0, maxFeedbackLength) + '...' 
      : feedback
    
    // Platform-specific styling
    const getPlatformStyles = () => {
      switch (platform) {
        case 'linkedin':
          return {
            gradient: 'linear-gradient(135deg, #0077B5 0%, #00a0dc 100%)',
            accentColor: '#0077B5',
            width: 1200,
            height: 627
          }
        case 'twitter':
          return {
            gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%)',
            accentColor: '#1DA1F2',
            width: 1200,
            height: 675
          }
        default: // facebook
          return {
            gradient: 'linear-gradient(135deg, #4267B2 0%, #5b7bd5 100%)',
            accentColor: '#4267B2',
            width: 1200,
            height: 630
          }
      }
    }
    
    const styles = getPlatformStyles()
    
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
            background: styles.gradient,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '32px',
              padding: '80px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '90%',
              textAlign: 'center',
              border: platform === 'linkedin' ? `6px solid ${styles.accentColor}` : 'none',
            }}
          >
            {/* Business Name */}
            <div
              style={{
                fontSize: '48px',
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
                fontSize: '100px',
                color: styles.accentColor,
                marginBottom: '32px',
                lineHeight: 1,
              }}
            >
              "
            </div>
            
            {/* Feedback Text */}
            <div
              style={{
                fontSize: '36px',
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
                fontSize: '48px',
                marginBottom: '32px',
                color: '#fbbf24',
              }}
            >
              {stars}
            </div>
            
            {/* Customer Name */}
            <div
              style={{
                fontSize: '32px',
                color: '#6b7280',
                fontWeight: 600,
                marginBottom: '24px',
              }}
            >
              — {customerName}
            </div>
            
            {/* Platform-specific branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '20px',
                color: '#9ca3af',
              }}
            >
              <span>Shared via</span>
              <span style={{ 
                color: styles.accentColor,
                fontWeight: 'bold',
                fontSize: '24px',
              }}>
                FeedbackHub
              </span>
              {platform === 'linkedin' && (
                <span style={{ fontSize: '16px' }}>💼</span>
              )}
              {platform === 'facebook' && (
                <span style={{ fontSize: '16px' }}>📘</span>
              )}
              {platform === 'twitter' && (
                <span style={{ fontSize: '16px' }}>🐦</span>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: styles.width,
        height: styles.height,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
          'Content-Type': 'image/png',
        }
      }
    )
  } catch (e: any) {
    console.error('Error generating OG image:', e.message)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
