import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = request.nextUrl
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const customerName = searchParams.get('name') || 'Anonymous'
    const customerCompany = searchParams.get('company') || ''
    const businessName = searchParams.get('business') || 'Our Business'
    const formType = searchParams.get('formType') || 'rating'
    const rating = parseInt(searchParams.get('rating') || (formType === 'nps' ? '10' : '5'), 10)

    // Rating display logic
    let ratingDisplay
    if (formType === 'nps') {
      ratingDisplay = `${rating}/10`
    } else {
      const stars = '★'.repeat(Math.max(0, Math.min(5, rating))) + '☆'.repeat(Math.max(0, 5 - Math.min(5, rating)))
      ratingDisplay = stars
    }

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
            fontFamily: 'sans-serif',
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
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '90%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
              }}
            >
              {businessName}
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
              "{feedback}"
            </div>
            
            <div
              style={{
                fontSize: '40px',
                marginBottom: '24px',
                color: formType === 'nps' ? '#1f2937' : '#fbbf24',
              }}
            >
              {ratingDisplay}
            </div>
            
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              — {customerName}
            </div>
            
            {customerCompany && (
              <div
                style={{
                  fontSize: '18px',
                  color: '#9ca3af',
                  marginBottom: '16px',
                }}
              >
                {customerCompany}
              </div>
            )}
            
            <div
              style={{
                fontSize: '16px',
                color: '#9ca3af',
                marginTop: '16px',
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
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}