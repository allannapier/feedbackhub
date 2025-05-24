import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const feedback = searchParams.get('feedback') || 'Great service!'
    const rating = parseInt(searchParams.get('rating') || '5')
    const customerName = searchParams.get('name') || 'Anonymous'
    const businessName = searchParams.get('business') || 'Our Business'
    
    // Generate star display
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
    
    // Return HTML for preview (later we can implement proper image generation)
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
