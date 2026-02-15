/**
 * Notification Service for Email and SMS
 * Integrates with SendGrid (Email) and Twilio (SMS)
 */

interface EmailNotification {
  to: string
  subject: string
  html: string
  text?: string
}

interface SMSNotification {
  to: string
  message: string
}

interface SessionReminder {
  patientName: string
  patientEmail: string
  patientPhone?: string
  therapistName: string
  sessionDate: string
  sessionTime: string
  sessionType: string
  sessionDuration: string
}

/**
 * Email Templates
 */
export const emailTemplates = {
  sessionReminder: (data: SessionReminder) => ({
    subject: `Reminder: Therapy Session Tomorrow with ${data.therapistName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .session-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
            .detail-label { font-weight: bold; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Session Reminder</h1>
              <p>Your therapy session is coming up soon</p>
            </div>
            <div class="content">
              <p>Hi ${data.patientName},</p>
              <p>This is a friendly reminder about your upcoming therapy session.</p>
              
              <div class="session-details">
                <h3>Session Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Therapist:</span>
                  <span>${data.therapistName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span>${data.sessionDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span>${data.sessionTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span>${data.sessionType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span>${data.sessionDuration}</span>
                </div>
              </div>

              <p>Please arrive a few minutes early to ensure a smooth start to your session.</p>
              
              <center>
                <a href="https://therapyflow.app/patient" class="button">View Session Details</a>
              </center>

              <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                If you need to reschedule or cancel, please contact us at least 24 hours in advance.
              </p>
            </div>
            <div class="footer">
              <p>TherapyFlow - Secure Mental Health Management</p>
              <p>This is an automated reminder. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${data.patientName},\n\nThis is a reminder about your upcoming therapy session:\n\nTherapist: ${data.therapistName}\nDate: ${data.sessionDate}\nTime: ${data.sessionTime}\nType: ${data.sessionType}\nDuration: ${data.sessionDuration}\n\nPlease arrive a few minutes early.\n\nTherapyFlow`
  }),

  sessionConfirmation: (data: SessionReminder) => ({
    subject: `Session Confirmed with ${data.therapistName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
            .session-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>Session Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.patientName},</p>
              <p>Your therapy session has been successfully scheduled.</p>
              
              <div class="session-details">
                <h3>Session Details</h3>
                <p><strong>Therapist:</strong> ${data.therapistName}</p>
                <p><strong>Date:</strong> ${data.sessionDate}</p>
                <p><strong>Time:</strong> ${data.sessionTime}</p>
                <p><strong>Type:</strong> ${data.sessionType}</p>
                <p><strong>Duration:</strong> ${data.sessionDuration}</p>
              </div>

              <center>
                <a href="https://therapyflow.app/patient" class="button">View in Portal</a>
              </center>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${data.patientName},\n\nYour therapy session has been confirmed!\n\nTherapist: ${data.therapistName}\nDate: ${data.sessionDate}\nTime: ${data.sessionTime}\n\nTherapyFlow`
  }),

  sessionCancellation: (data: SessionReminder) => ({
    subject: `Session Cancelled - ${data.sessionDate}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Session Cancelled</h1>
            </div>
            <div class="content">
              <p>Hi ${data.patientName},</p>
              <p>Your therapy session scheduled for ${data.sessionDate} at ${data.sessionTime} has been cancelled.</p>
              
              <p>If you'd like to reschedule, please contact us or book a new session through your patient portal.</p>

              <center>
                <a href="https://therapyflow.app/patient" class="button">Book New Session</a>
              </center>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${data.patientName},\n\nYour therapy session on ${data.sessionDate} at ${data.sessionTime} has been cancelled.\n\nPlease contact us to reschedule.\n\nTherapyFlow`
  })
}

/**
 * SMS Templates
 */
export const smsTemplates = {
  sessionReminder: (data: SessionReminder) => 
    `TherapyFlow Reminder: Your session with ${data.therapistName} is tomorrow at ${data.sessionTime}. Reply CONFIRM to confirm or CANCEL to cancel.`,
  
  sessionConfirmation: (data: SessionReminder) =>
    `TherapyFlow: Your session with ${data.therapistName} on ${data.sessionDate} at ${data.sessionTime} is confirmed. See you then!`,
  
  sessionCancellation: (data: SessionReminder) =>
    `TherapyFlow: Your session on ${data.sessionDate} at ${data.sessionTime} has been cancelled. Reply BOOK to schedule a new session.`,
  
  sessionStartingSoon: (data: SessionReminder) =>
    `TherapyFlow: Your session starts in 15 minutes. Join here: https://therapyflow.app/patient`
}

/**
 * Send Email Notification
 * In production, integrate with SendGrid API
 */
export async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    // Demo mode - just log
    console.log('📧 Email would be sent:', {
      to: notification.to,
      subject: notification.subject
    })

    // Production implementation:
    /*
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    })
    return response.ok
    */

    return true
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

/**
 * Send SMS Notification
 * In production, integrate with Twilio API
 */
export async function sendSMS(notification: SMSNotification): Promise<boolean> {
  try {
    // Demo mode - just log
    console.log('📱 SMS would be sent:', {
      to: notification.to,
      message: notification.message.substring(0, 50) + '...'
    })

    // Production implementation:
    /*
    const response = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    })
    return response.ok
    */

    return true
  } catch (error) {
    console.error('SMS send error:', error)
    return false
  }
}

/**
 * Send Session Reminder (Email + SMS)
 */
export async function sendSessionReminder(data: SessionReminder): Promise<void> {
  const emailTemplate = emailTemplates.sessionReminder(data)
  const smsTemplate = smsTemplates.sessionReminder(data)

  // Send email
  await sendEmail({
    to: data.patientEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  })

  // Send SMS if phone number provided
  if (data.patientPhone) {
    await sendSMS({
      to: data.patientPhone,
      message: smsTemplate
    })
  }
}

/**
 * Send Session Confirmation
 */
export async function sendSessionConfirmation(data: SessionReminder): Promise<void> {
  const emailTemplate = emailTemplates.sessionConfirmation(data)
  const smsTemplate = smsTemplates.sessionConfirmation(data)

  await sendEmail({
    to: data.patientEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  })

  if (data.patientPhone) {
    await sendSMS({
      to: data.patientPhone,
      message: smsTemplate
    })
  }
}

/**
 * Send Session Cancellation
 */
export async function sendSessionCancellation(data: SessionReminder): Promise<void> {
  const emailTemplate = emailTemplates.sessionCancellation(data)
  const smsTemplate = smsTemplates.sessionCancellation(data)

  await sendEmail({
    to: data.patientEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  })

  if (data.patientPhone) {
    await sendSMS({
      to: data.patientPhone,
      message: smsTemplate
    })
  }
}

/**
 * Schedule automatic reminders
 * Call this function to set up reminder jobs
 */
export function scheduleSessionReminders() {
  // In production, use a job scheduler like:
  // - Supabase Edge Functions with pg_cron
  // - Vercel Cron Jobs
  // - AWS EventBridge
  // - Node-cron for self-hosted
  
  console.log('📅 Reminder scheduler initialized')
  
  // Example: Check for sessions 24 hours from now
  // Run this every hour
  /*
  setInterval(async () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const sessions = await getSessionsForDate(tomorrow)
    
    for (const session of sessions) {
      await sendSessionReminder({
        patientName: session.patient.name,
        patientEmail: session.patient.email,
        patientPhone: session.patient.phone,
        therapistName: session.therapist.name,
        sessionDate: formatDate(session.scheduled_at),
        sessionTime: formatTime(session.scheduled_at),
        sessionType: session.session_type,
        sessionDuration: `${session.duration_minutes} minutes`
      })
    }
  }, 60 * 60 * 1000) // Every hour
  */
}
