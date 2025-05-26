import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
            background: 'linear-gradient(135deg, #4267B2 0%, #5b7bd5 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '40px',
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
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>
              FeedbackHub Demo
            </div>
            <div style={{ fontSize: '80px', color: '#4267B2', marginBottom: '32px', lineHeight: 1 }}>
              "
            </div>
            <div style={{ fontSize: '28px', color: '#374151', lineHeight: 1.4, marginBottom: '40px', fontStyle: 'italic' }}>
              Amazing service! Highly recommend!
            </div>
            <div style={{ fontSize: '40px', marginBottom: '32px', color: '#fbbf24' }}>
              ★★★★★
            </div>
            <div style={{ fontSize: '24px', color: '#6b7280', fontWeight: 600, marginBottom: '24px' }}>
              — Happy Customer
            </div>
            <div style={{ fontSize: '16px', color: '#9ca3af' }}>
              Powered by <span style={{ color: '#4267B2', fontWeight: 'bold' }}>FeedbackHub</span>
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
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
