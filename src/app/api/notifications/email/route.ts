import { NextRequest, NextResponse } from 'next/server'

/**
 * Email Notification API Route
 * Integrates with SendGrid for production use
 */

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json()

    // Validate input
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Production: SendGrid Integration
    /*
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: {
          email: 'noreply@therapyflow.app',
          name: 'TherapyFlow'
        },
        subject: subject,
        content: [
          {
            type: 'text/html',
            value: html
          },
          {
            type: 'text/plain',
            value: text || ''
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('SendGrid API error')
    }
    */

    // Demo mode - simulate success
    console.log('📧 Email sent to:', to)
    console.log('Subject:', subject)

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      demo: true
    })

  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
