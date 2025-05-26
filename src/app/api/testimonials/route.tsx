import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = parseInt(searchParams.get('rating') || '5')
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    const format = searchParams.get('format') || 'web' // web, instagram, facebook, linkedin
    const download = searchParams.get('download') === 'true'
    
    // Generate star display (only for star ratings, clamp to 1-5 range)
    const clampedRating = Math.max(1, Math.min(5, rating))
    const stars = '★'.repeat(clampedRating) + '☆'.repeat(5 - clampedRating)
    
    // Set dimensions based on format
    let width = 800
    let height = 600
    
    if (format === 'instagram') {
      width = 1080
      height = 1080
    } else if (format === 'facebook') {
      width = 1200
      height = 630
    } else if (format === 'linkedin') {
      width = 1200
      height = 627 // LinkedIn's preferred aspect ratio
    }
    
    // Truncate feedback for better display
    const maxFeedbackLength = format === 'instagram' ? 120 : 100
    const truncatedFeedback = feedback.length > maxFeedbackLength 
      ? feedback.substring(0, maxFeedbackLength) + '...' 
      : feedback
    
    // Design colors and styling based on format
    const getGradient = () => {
      switch (format) {
        case 'instagram':
          return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        case 'facebook':
          return 'linear-gradient(135deg, #4267B2 0%, #5b7bd5 100%)'
        case 'linkedin':
          return 'linear-gradient(135deg, #0077B5 0%, #00a0dc 100%)'
        default:
          return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }
    
    const getAccentColor = () => {
      switch (format) {
        case 'facebook':
          return '#4267B2'
        case 'linkedin':
          return '#0077B5'
        case 'instagram':
          return '#4f46e5'
        default:
          return '#4f46e5'
      }
    }
    
    // If this is a request for an actual image (for downloads), return ImageResponse
    if (download) {
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
              background: getGradient(),
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              padding: format === 'instagram' ? '60px' : '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: format === 'instagram' ? '32px' : '24px',
                padding: format === 'instagram' ? '80px' : '60px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxWidth: '90%',
                textAlign: 'center',
                border: format === 'linkedin' ? `4px solid ${getAccentColor()}` : 'none',
              }}
            >
              {/* Business Name */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '48px' : format === 'facebook' ? '36px' : '40px',
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
                  fontSize: format === 'instagram' ? '100px' : '80px',
                  color: getAccentColor(),
                  marginBottom: '32px',
                  lineHeight: 1,
                }}
              >
                "
              </div>
              
              {/* Feedback Text */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '36px' : format === 'facebook' ? '28px' : '32px',
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
                  fontSize: format === 'instagram' ? '48px' : '40px',
                  marginBottom: '32px',
                  color: '#fbbf24',
                }}
              >
                {stars}
              </div>
              
              {/* Customer Name */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '32px' : format === 'facebook' ? '24px' : '28px',
                  color: '#6b7280',
                  fontWeight: 600,
                  marginBottom: '24px',
                }}
              >
                — {customerName}
              </div>
              
              {/* Powered by */}
              <div
                style={{
                  fontSize: format === 'instagram' ? '20px' : '16px',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Powered by</span>
                <span style={{ 
                  color: getAccentColor(),
                  fontWeight: 'bold'
                }}>
                  FeedbackHub
                </span>
              </div>
            </div>
          </div>
        ),
        {
          width,
          height,
          headers: {
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            'Content-Type': 'image/png',
          }
        }
      )
    }
    
    // Return HTML for preview (existing functionality)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Testimonial Card - ${businessName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta property="og:title" content="${businessName} - ${rating}/5 Stars">
          <meta property="og:description" content="${truncatedFeedback} - ${customerName}">
          <meta property="og:image" content="${request.url}&download=true&format=facebook">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:type" content="article">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:image" content="${request.url}&download=true&format=facebook">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
              background: ${getGradient()};
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 40px 20px;
            }
            .card {
              background: white;
              border-radius: 24px;
              padding: 60px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              max-width: 700px;
              width: 100%;
              text-align: center;
              animation: fadeIn 0.5s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .business-name {
              font-size: 40px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 32px;
            }
            .quote {
              font-size: 80px;
              color: ${getAccentColor()};
              margin-bottom: 32px;
              line-height: 1;
            }
            .feedback-text {
              font-size: 32px;
              color: #374151;
              line-height: 1.4;
              margin-bottom: 40px;
              font-style: italic;
            }
            .stars {
              font-size: 40px;
              margin-bottom: 32px;
              color: #fbbf24;
            }
            .customer-name {
              font-size: 28px;
              color: #6b7280;
              font-weight: 600;
              margin-bottom: 24px;
            }
            .powered-by {
              font-size: 16px;
              color: #9ca3af;
            }
            .powered-by .brand {
              color: ${getAccentColor()};
              font-weight: bold;
            }
            .download-actions {
              margin-top: 40px;
              display: flex;
              gap: 16px;
              justify-content: center;
              flex-wrap: wrap;
            }
            .download-btn {
              background: ${getAccentColor()};
              color: white;
              padding: 16px 24px;
              border-radius: 12px;
              text-decoration: none;
              font-weight: 600;
              transition: all 0.2s;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
            }
            .download-btn:hover {
              opacity: 0.9;
              transform: translateY(-2px);
            }
            .download-btn.facebook { background: #4267B2; }
            .download-btn.linkedin { background: #0077B5; }
            .download-btn.instagram { 
              background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
            }
            @media (max-width: 768px) {
              .card { padding: 40px 30px; }
              .business-name { font-size: 32px; }
              .quote { font-size: 60px; }
              .feedback-text { font-size: 24px; }
              .customer-name { font-size: 20px; }
              .download-actions { flex-direction: column; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="business-name">${businessName}</div>
            <div class="quote">"</div>
            <div class="feedback-text">${truncatedFeedback}</div>
            <div class="stars">${stars}</div>
            <div class="customer-name">— ${customerName}</div>
            <div class="powered-by">Powered by <span class="brand">FeedbackHub</span></div>
            
            <div class="download-actions">
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=facebook" 
                 class="download-btn facebook" 
                 download="testimonial-facebook.png">
                📘 Facebook (1200×630)
              </a>
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=linkedin" 
                 class="download-btn linkedin" 
                 download="testimonial-linkedin.png">
                💼 LinkedIn (1200×627)
              </a>
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=instagram" 
                 class="download-btn instagram" 
                 download="testimonial-instagram.png">
                📱 Instagram (1080×1080)
              </a>
              <a href="/api/testimonials?${searchParams.toString()}&download=true&format=web" 
                 class="download-btn" 
                 download="testimonial-web.png">
                🌐 Web (800×600)
              </a>
            </div>
          </div>
        </body>
      </html>
    `
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (e: any) {
    console.error('Error generating testimonial:', e.message)
    return new Response(`Failed to generate testimonial: ${e.message}`, {
      status: 500,
    })
  }
}
