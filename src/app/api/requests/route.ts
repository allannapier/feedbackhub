import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { formId, recipients, customMessage } = body

    // Validate required fields
    if (!formId || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { error: 'Form ID and recipients array are required' },
        { status: 400 }
      )
    }

    // Get form details
    const { data: form, error: formError } = await supabase
      .from('Form')
      .select('*')
      .eq('id', formId)
      .eq('userId', user.id)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const results = []
    const errors = []

    // Process each recipient
    for (const recipient of recipients) {
      try {
        // Create request record first
        const { data: requestRecord, error: requestError } = await supabase
          .from('Request')
          .insert({
            formId: form.id,
            recipientEmail: recipient.email,
            recipientName: recipient.name || null,
            status: 'pending'
          })
          .select()
          .single()

        if (requestError) {
          errors.push({ email: recipient.email, error: requestError.message })
          continue
        }

        // Generate feedback link
        const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.slug}`
        
        // Send real email via Resend
        const emailResult = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>', // Using Resend's default onboarding domain
          to: [recipient.email],
          subject: `Quick feedback request: ${form.title}`,
          html: generateEmailHTML({
            recipientName: recipient.name,
            formTitle: form.title,
            formQuestion: form.question,
            feedbackUrl,
            customMessage,
            businessName: user.name || user.email
          })
        })

        console.log('Resend email result:', emailResult)

        if (emailResult.error) {
          console.error('Resend error:', emailResult.error)
          errors.push({ email: recipient.email, error: emailResult.error.message || 'Email sending failed' })
          await supabase
            .from('Request')
            .update({ status: 'failed' })
            .eq('id', requestRecord.id)
        } else {
          console.log('Email sent successfully:', emailResult.data)
          await supabase
            .from('Request')
            .update({ 
              status: 'sent',
              sentAt: new Date().toISOString()
            })
            .eq('id', requestRecord.id)
          
          results.push({ 
            email: recipient.email, 
            success: true,
            requestId: requestRecord.id,
            emailId: emailResult.data?.id
          })
        }
      } catch (error: any) {
        errors.push({ email: recipient.email, error: error.message })
      }
    }

    return NextResponse.json({ 
      sent: results.length,
      failed: errors.length,
      results,
      errors 
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateEmailHTML({
  recipientName,
  formTitle,
  formQuestion,
  feedbackUrl,
  customMessage,
  businessName
}: {
  recipientName?: string
  formTitle: string
  formQuestion: string
  feedbackUrl: string
  customMessage?: string
  businessName: string
}) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Feedback Request</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .question-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Quick Feedback Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">From ${businessName}</p>
        </div>
        
        <div class="content">
          <p>Hi${recipientName ? ` ${recipientName}` : ''},</p>
          
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          
          <p>We'd love to hear about your recent experience with us. Your feedback helps us improve our service and better serve customers like you.</p>
          
          <div class="question-box">
            <h3 style="margin: 0 0 10px 0; color: #0369a1;">${formTitle}</h3>
            <p style="margin: 0; font-style: italic;">"${formQuestion}"</p>
          </div>
          
          <p>It only takes 30 seconds to share your thoughts:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${feedbackUrl}" class="button" style="color: white;">Give Feedback</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            <strong>Why your feedback matters:</strong><br>
            • Helps us understand what we're doing well<br>
            • Identifies areas where we can improve<br>
            • Makes our service better for everyone
          </p>
        </div>
        
        <div class="footer">
          <p>This feedback request was sent via <strong>FeedbackHub</strong></p>
          <p style="margin: 5px 0;">
            <a href="${feedbackUrl}" style="color: #4F46E5;">Share your feedback</a> |
            <a href="#" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
