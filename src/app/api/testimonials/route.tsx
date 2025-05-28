import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = parseInt(searchParams.get('rating') || '5')
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    const format = searchParams.get('format') || 'web' // web, instagram, facebook
    const formType = searchParams.get('formType') || 'rating'; // Default to 'rating'
    
    // Conditional Rating Display Logic
    let ratingDisplayElement;
    if (formType === 'nps') {
      ratingDisplayElement = (
        <div style={{ fontSize: format === 'instagram' ? '40px' : '36px', marginBottom: '24px', color: '#1f2937' }}>
          {rating}/10
        </div>
      );
    } else { // Default to 5-star rating
      const clampedRating = Math.max(0, Math.min(5, rating)); // Allow 0 stars
      const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating);
      ratingDisplayElement = (
        <div style={{ fontSize: format === 'instagram' ? '40px' : '36px', marginBottom: '24px', color: '#fbbf24', fontFamily: 'Arial, sans-serif' }}>
          {stars}
        </div>
      );
    }
    
    // Set dimensions based on format
    let width = 800
    let height = 600
    
    if (format === 'instagram') {
      width = 1080
      height = 1080
    } else if (format === 'facebook') {
      width = 1200
      height = 630
    }
    
    // If this is a request for an actual image (for downloads), return ImageResponse
    if (searchParams.get('download') === 'true') {
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
                padding: format === 'instagram' ? '60px' : '48px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '90%',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: format === 'instagram' ? '36px' : '32px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '24px',
                }}
              >
                {businessName}
              </div>
              
              {/* The following div for the large opening quote has been removed */}
              
              <div
                style={{
                  fontSize: format === 'instagram' ? '32px' : '28px',
                  color: '#374151',
                  lineHeight: 1.4,
                  marginBottom: '32px',
                  fontStyle: 'italic',
                  maxWidth: '80%',
                }}
              >
                {feedback}
              </div>
              
              {ratingDisplayElement}
              
              <div
                style={{
                  fontSize: format === 'instagram' ? '28px' : '24px',
                  color: '#6b7280',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                — {customerName}
              </div>
              
              <div
                style={{
                  fontSize: format === 'instagram' ? '18px' : '16px',
                  color: '#9ca3af',
                }}
              >
                Powered by FeedbackHub
              </div>
            </div>
          </div>
        ),
        {
          width,
          height,
        }
      )
    }
    
    // Return HTML for preview (existing functionality)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Testimonial Card</title>
          <style>
            body {
              margin: 0;
              padding: 40px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card {
              background: white;
              border-radius: 24px;
              padding: 48px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              max-width: 600px;
              text-align: center;
            }
            .business-name {
              font-size: 32px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 24px;
            }
            .quote {
              font-size: 72px;
              color: #4f46e5;
              margin-bottom: 24px;
              line-height: 1;
            }
            .feedback-text {
              font-size: 28px;
              color: #374151;
              line-height: 1.4;
              margin-bottom: 32px;
              font-style: italic;
            }
            .stars {
              font-size: 36px;
              margin-bottom: 24px;
              color: #fbbf24;
            }
            .customer-name {
              font-size: 24px;
              color: #6b7280;
              font-weight: 600;
              margin-bottom: 16px;
            }
            .powered-by {
              font-size: 16px;
              color: #9ca3af;
            }
            .download-actions {
              margin-top: 32px;
              display: flex;
              gap: 16px;
              justify-content: center;
              flex-wrap: wrap;
            }
            .download-btn {
              background: #4f46e5;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              transition: background 0.2s;
            }
            .download-btn:hover {
              background: #4338ca;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="business-name">${businessName}</div>
            <div class="quote">"</div>
            <div class="feedback-text">${feedback}</div>
            <div class="stars">${stars}</div>
            <div class="customer-name">— ${customerName}</div>
            <div class="powered-by">Powered by FeedbackHub</div>
            
            <div class="download-actions">
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=instagram" 
                 class="download-btn" 
                 download="testimonial-instagram.png">
                📱 Download for Instagram
              </a>
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=facebook" 
                 class="download-btn" 
                 download="testimonial-facebook.png">
                📘 Download for Facebook
              </a>
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=web" 
                 class="download-btn" 
                 download="testimonial-web.png">
                🌐 Download Web Version
              </a>
            </div>
          </div>
        </body>
      </html>
    `
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (e: any) {
    console.error('Error generating testimonial:', e.message)
    return new Response(`Failed to generate testimonial: ${e.message}`, {
      status: 500,
    })
  }
}
