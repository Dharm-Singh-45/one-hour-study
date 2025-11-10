# Twilio WhatsApp Setup Guide

This guide will help you set up Twilio WhatsApp API for sending payment reminders to students.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com/try-twilio)
2. $15.50 free credit (provided with new Twilio account)
3. A phone number for testing (your personal number)

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free account
3. Verify your email and phone number
4. You'll receive $15.50 in free credit

## Step 2: Get Your Twilio Credentials

1. Log in to your Twilio Console: https://console.twilio.com/
2. From the dashboard, copy your:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "View" to reveal it)

## Step 3: Set Up WhatsApp Sandbox

1. In Twilio Console, go to **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Follow the instructions to join the WhatsApp sandbox
3. Send the join code to the Twilio WhatsApp number: `+1 415 523 8886`
4. Once joined, you can send messages to any number that has joined the sandbox

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following:

```env
# Twilio WhatsApp API Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Replace:
- `your_account_sid_here` with your Account SID from Step 2
- `your_auth_token_here` with your Auth Token from Step 2
- The WhatsApp number is `whatsapp:+14155238886` for sandbox testing

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Log in as a teacher
3. Go to Teacher Dashboard
4. Find an allocated student
5. Click "Send Payment Reminder" button
6. The student should receive a WhatsApp message

## Production Setup

For production, you need to:

1. **Verify Your WhatsApp Business Number**
   - Go to Twilio Console > Messaging > WhatsApp
   - Request a WhatsApp Business number
   - Complete the verification process with Meta (Facebook)

2. **Update Environment Variables**
   - Replace sandbox number with your verified WhatsApp Business number
   - Format: `whatsapp:+919876543210` (with country code)

3. **Message Templates**
   - For production, you need to create and approve message templates
   - Go to Twilio Console > Messaging > WhatsApp > Message Templates
   - Create templates for payment reminders

## Cost Information

- **Free Tier**: $15.50 credit (approximately 1,700-3,100 messages)
- **After Free Tier**: ~$0.009 per message
- **Daily Limits**: 
  - Tier 1: 1,000 unique users/day (default)
  - Higher tiers available after verification

## Troubleshooting

### Error: "WhatsApp service is not configured"
- Make sure `.env.local` file exists with all three variables
- Restart your development server after adding environment variables

### Error: "Failed to send WhatsApp message"
- Check if the recipient has joined the WhatsApp sandbox
- Verify your Twilio credentials are correct
- Check Twilio Console for error logs

### Message Not Received
- Ensure the recipient has joined the WhatsApp sandbox
- Check if the phone number format is correct (with country code)
- Verify your Twilio account has sufficient credit

## Support

- Twilio Documentation: https://www.twilio.com/docs/whatsapp
- Twilio Support: https://support.twilio.com/

