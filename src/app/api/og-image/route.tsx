import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = searchParams.get('rating') || '5'
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    
    // Simple, reliable image generation
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', color: '#1f2937' }}>
              {businessName}
            </h1>
            <p style={{ fontSize: '32px', margin: '0 0 20px 0', color: '#374151' }}>
              "{feedback}"
            </p>
            <div style={{ fontSize: '48px', margin: '0 0 20px 0' }}>
              {'★'.repeat(parseInt(rating))}
            </div>
            <p style={{ fontSize: '24px', margin: '0', color: '#6b7280' }}>
              — {customerName}
            </p>
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
    
    // Return a simple text response if ImageResponse fails
    return new Response(
      `Error: ${e.message}. Feedback: ${request.url}`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      }
    )
  }
}
