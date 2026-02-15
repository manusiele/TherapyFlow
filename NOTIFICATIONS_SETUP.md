# Email & SMS Notifications Setup

## Overview
TherapyFlow includes a comprehensive notification system for automated session reminders, confirmations, and updates via Email and SMS.

## Features Implemented

### ✅ Email Notifications
- **Session Reminders**: 24-hour advance reminders
- **Session Confirmations**: Instant booking confirmations
- **Session Cancellations**: Cancellation notifications
- **New Messages**: Message alerts
- **Weekly Summary**: Therapist activity reports (therapists only)

### ✅ SMS Notifications
- **Session Reminders**: Text reminders before sessions
- **Session Starting Soon**: 15-minute advance alerts
- **Urgent Notifications**: Critical updates only mode
- **Two-way SMS**: Reply CONFIRM/CANCEL support (planned)

### ✅ Push Notifications (PWA)
- **Browser Notifications**: Real-time alerts
- **New Messages**: Instant message notifications
- **Session Reminders**: In-app reminders

### ✅ User Preferences
- **Granular Control**: Enable/disable each notification type
- **Timing Options**: Choose reminder timing (1-48 hours)
- **Channel Selection**: Email, SMS, or both
- **Quiet Hours**: Respect user preferences (planned)

## Current Setup (Demo Mode)

The system is currently in **demo mode** - notifications are logged to console but not actually sent. This allows testing without API keys.

### Demo Features
- ✅ Full notification templates
- ✅ User preference management
- ✅ Notification scheduling logic
- ✅ API route structure
- ⚠️ No actual emails/SMS sent

## Production Setup

### 1. Email Service (SendGrid)

#### Why SendGrid?
- ✅ 100 emails/day free tier
- ✅ Excellent deliverability
- ✅ Professional templates
- ✅ Analytics and tracking
- ✅ HIPAA-compliant with BAA

#### Setup Steps

**Step 1: Create SendGrid Account**
```bash
# Sign up at https://sendgrid.com
# Free tier: 100 emails/day forever
```

**Step 2: Get API Key**
1. Go to Settings → API Keys
2. Create API Key with "Full Access"
3. Copy the key (shown only once)

**Step 3: Verify Sender Identity**
1. Go to Settings → Sender Authentication
2. Verify your domain OR single sender email
3. Complete DNS verification (for domain)

**Step 4: Add Environment Variables**
```bash
# .env.local
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@therapyflow.app
SENDGRID_FROM_NAME=TherapyFlow
```

**Step 5: Update API Route**
Uncomment the SendGrid code in `src/app/api/notifications/email/route.ts`

**Step 6: Install SendGrid SDK (Optional)**
```bash
npm install @sendgrid/mail
```

Then use the SDK:
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

await sgMail.send({
  to: 'patient@example.com',
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Session Reminder',
  html: emailTemplate.html
})
```

### 2. SMS Service (Twilio)

#### Why Twilio?
- ✅ $15 free trial credit
- ✅ Reliable delivery
- ✅ Two-way SMS support
- ✅ Global coverage
- ✅ HIPAA-compliant with BAA

#### Setup Steps

**Step 1: Create Twilio Account**
```bash
# Sign up at https://www.twilio.com
# Get $15 free trial credit
```

**Step 2: Get Phone Number**
1. Go to Phone Numbers → Buy a Number
2. Choose a number with SMS capability
3. Cost: ~$1/month + $0.0075 per SMS

**Step 3: Get Credentials**
1. Go to Console Dashboard
2. Copy Account SID
3. Copy Auth Token

**Step 4: Add Environment Variables**
```bash
# .env.local
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Step 5: Update API Route**
Uncomment the Twilio code in `src/app/api/notifications/sms/route.ts`

**Step 6: Install Twilio SDK (Optional)**
```bash
npm install twilio
```

Then use the SDK:
```typescript
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

await client.messages.create({
  body: 'Your session reminder...',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: '+1234567890'
})
```

### 3. Automated Scheduling

#### Option A: Supabase Edge Functions + pg_cron

**Setup pg_cron Extension**
```sql
-- Enable pg_cron in Supabase
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule reminder job (runs every hour)
SELECT cron.schedule(
  'send-session-reminders',
  '0 * * * *', -- Every hour
  $$
  SELECT send_session_reminders();
  $$
);
```

**Create Edge Function**
```typescript
// supabase/functions/send-reminders/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Get sessions 24 hours from now
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Query sessions
  // Send notifications
  
  return new Response(JSON.stringify({ success: true }))
})
```

#### Option B: Vercel Cron Jobs

**Create API Route**
```typescript
// src/app/api/cron/reminders/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Send reminders
  await sendScheduledReminders()

  return Response.json({ success: true })
}
```

**Configure in vercel.json**
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "0 * * * *"
  }]
}
```

#### Option C: Node-cron (Self-Hosted)

```typescript
import cron from 'node-cron'

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running reminder job...')
  await sendScheduledReminders()
})
```

### 4. Database Schema for Notification Preferences

```sql
-- Add to existing tables
ALTER TABLE patients ADD COLUMN notification_preferences JSONB DEFAULT '{
  "email": true,
  "sms": false,
  "push": true,
  "reminderTiming": "24"
}'::jsonb;

ALTER TABLE therapists ADD COLUMN notification_preferences JSONB DEFAULT '{
  "email": true,
  "sms": false,
  "push": true,
  "weeklySummary": true
}'::jsonb;

-- Notification log table
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_type VARCHAR(20) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL, -- email, sms, push
  status VARCHAR(20) NOT NULL, -- sent, failed, pending
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Cost Estimates

### Free Tier (Testing)
- **SendGrid**: 100 emails/day = FREE
- **Twilio**: $15 trial credit = ~2000 SMS
- **Total**: $0/month

### Small Practice (100 patients, 200 sessions/month)
- **SendGrid**: 6000 emails/month = FREE (under 100/day)
- **Twilio**: 400 SMS/month = $3/month
- **Phone Number**: $1/month
- **Total**: ~$4/month

### Medium Practice (500 patients, 1000 sessions/month)
- **SendGrid**: 30,000 emails/month = $19.95/month (Essentials plan)
- **Twilio**: 2000 SMS/month = $15/month
- **Phone Number**: $1/month
- **Total**: ~$36/month

### Large Practice (2000 patients, 5000 sessions/month)
- **SendGrid**: 150,000 emails/month = $89.95/month (Pro plan)
- **Twilio**: 10,000 SMS/month = $75/month
- **Phone Number**: $1/month
- **Total**: ~$166/month

## HIPAA Compliance

### Requirements
- [ ] Business Associate Agreement (BAA) with SendGrid
- [ ] Business Associate Agreement (BAA) with Twilio
- [ ] Encrypted data transmission (HTTPS)
- [ ] Audit logging of all notifications
- [ ] Patient consent for communications
- [ ] Opt-out mechanism
- [ ] Secure storage of phone numbers/emails

### SendGrid HIPAA Setup
1. Upgrade to Pro plan ($89.95/month minimum)
2. Request BAA from SendGrid
3. Enable additional security features
4. Use dedicated IP address

### Twilio HIPAA Setup
1. Contact Twilio for HIPAA account
2. Sign BAA
3. Use HIPAA-eligible services only
4. Enable audit logging

## Testing

### Test Email Notifications
```typescript
import { sendEmail, emailTemplates } from '@/lib/notifications'

const testData = {
  patientName: 'John Doe',
  patientEmail: 'test@example.com',
  therapistName: 'Dr. Smith',
  sessionDate: 'Tomorrow',
  sessionTime: '2:00 PM',
  sessionType: 'Individual Therapy',
  sessionDuration: '50 minutes'
}

const template = emailTemplates.sessionReminder(testData)
await sendEmail({
  to: 'test@example.com',
  subject: template.subject,
  html: template.html
})
```

### Test SMS Notifications
```typescript
import { sendSMS, smsTemplates } from '@/lib/notifications'

await sendSMS({
  to: '+1234567890',
  message: smsTemplates.sessionReminder(testData)
})
```

## Troubleshooting

### Emails Not Sending
- Check SendGrid API key is correct
- Verify sender email is authenticated
- Check spam folder
- Review SendGrid activity logs
- Ensure daily limit not exceeded

### SMS Not Sending
- Verify phone number format (+1234567890)
- Check Twilio account balance
- Verify phone number is SMS-capable
- Check Twilio logs for errors
- Ensure number is not on DNC list

### Notifications Not Scheduled
- Verify cron job is running
- Check server timezone settings
- Review application logs
- Test manual trigger first

## Best Practices

1. **Rate Limiting**: Don't send too many notifications at once
2. **Unsubscribe Links**: Always include opt-out option
3. **Personalization**: Use patient names and details
4. **Timing**: Respect quiet hours (9 PM - 8 AM)
5. **Testing**: Test with real phone/email before production
6. **Monitoring**: Track delivery rates and failures
7. **Fallback**: If SMS fails, send email
8. **Consent**: Get explicit consent for SMS
9. **Logging**: Log all notification attempts
10. **Retry Logic**: Retry failed notifications

## Future Enhancements

- [ ] WhatsApp notifications (via Twilio)
- [ ] Voice call reminders
- [ ] Multi-language support
- [ ] Rich email templates with branding
- [ ] SMS two-way conversations
- [ ] Notification analytics dashboard
- [ ] A/B testing for templates
- [ ] Smart send time optimization
- [ ] Batch notification processing
- [ ] Emergency broadcast system

## Support Resources

- **SendGrid Docs**: https://docs.sendgrid.com
- **Twilio Docs**: https://www.twilio.com/docs
- **SendGrid Support**: support@sendgrid.com
- **Twilio Support**: help.twilio.com

## License & Compliance

- SendGrid: Commercial license, HIPAA-compliant with BAA
- Twilio: Commercial license, HIPAA-compliant with BAA
- Ensure compliance with CAN-SPAM Act (email)
- Ensure compliance with TCPA (SMS)
