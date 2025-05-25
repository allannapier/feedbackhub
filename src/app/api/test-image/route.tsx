import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export async function GET(request: NextRequest) {
  try {
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
              padding: '60px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
              }}
            >
              FeedbackHub Test
            </div>
            
            <div
              style={{
                fontSize: '80px',
                color: '#4f46e5',
                marginBottom: '24px',
                lineHeight: 1,
              }}
            >
              "
            </div>
            
            <div
              style={{
                fontSize: '32px',
                color: '#374151',
                lineHeight: 1.4,
                marginBottom: '32px',
                fontStyle: 'italic',
                maxWidth: '80%',
              }}
            >
              Social sharing is working perfectly!
            </div>
            
            <div
              style={{
                fontSize: '40px',
                marginBottom: '24px',
                color: '#fbbf24',
              }}
            >
              ★★★★★
            </div>
            
            <div
              style={{
                fontSize: '28px',
                color: '#6b7280',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              — Test User
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
        width: 1080,
        height: 1080,
      }
    )
  } catch (e: any) {
    console.error('Error generating test image:', e.message)
    return new Response(`Failed to generate test image: ${e.message}`, {
      status: 500,
    })
  }
}
