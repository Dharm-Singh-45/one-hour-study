# WhatsApp Content Template Guide

This guide explains how to use WhatsApp content templates for sending payment reminders.

## What are Content Templates?

Content templates are pre-approved message templates from WhatsApp that allow you to send business-initiated messages. They're required for production use and provide better deliverability.

## Your Current Template

Based on your configuration:
- **Content SID**: `HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (replace with your actual Content SID)
- **Template Variables**: `{"1":"12/1","2":"3pm"}`

## How It Works

The system automatically detects if you have a content template SID configured:

1. **If `NEXT_PUBLIC_TWILIO_WHATSAPP_CONTENT_SID` is set**: Uses content template
2. **If not set**: Falls back to plain text messages (for sandbox/testing)

## Current Implementation

The teacher dashboard currently uses these content variables:
```javascript
{
  "1": studentName,
  "2": `₹${amount}`,
  "3": subject
}
```

## Customizing Content Variables

You need to adjust the content variables in `pages/teacher-dashboard.tsx` to match your template structure.

### Example 1: Your Current Template (2 variables)
If your template uses 2 variables like `{"1":"12/1","2":"3pm"}`, update the code:

```javascript
contentVariables: {
  "1": allocation.studentName,  // or date
  "2": `₹${allocation.fees}`,   // or time
}
```

### Example 2: Payment Reminder Template (3 variables)
If your template has 3 variables for payment reminders:

```javascript
contentVariables: {
  "1": allocation.studentName,
  "2": `₹${allocation.fees}`,
  "3": allocation.subjects.join(', ')
}
```

## Steps to Update

1. **Check your template structure** in Twilio Console:
   - Go to Messaging > WhatsApp > Content Templates
   - Find your template SID (starts with `HX`)
   - See what variables it expects

2. **Update the contentVariables** in `pages/teacher-dashboard.tsx`:
   - Find the `handleSendPaymentReminder` function
   - Adjust the contentVariables object to match your template

3. **Test the integration**:
   - Restart your dev server
   - Send a test payment reminder
   - Verify the message is sent correctly

## Environment Variables

Your `.env.local` should have:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_TWILIO_WHATSAPP_CONTENT_SID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** Replace the placeholder values with your actual Twilio credentials from the Twilio Console.

## Testing

1. **With Content Template** (Production):
   - Set `NEXT_PUBLIC_TWILIO_WHATSAPP_CONTENT_SID` in `.env.local`
   - Restart dev server
   - Send payment reminder from teacher dashboard
   - Message will use your content template

2. **Without Content Template** (Sandbox):
   - Remove or comment out `NEXT_PUBLIC_TWILIO_WHATSAPP_CONTENT_SID`
   - Restart dev server
   - Send payment reminder
   - Message will use plain text (for sandbox testing)

## Important Notes

- **Template Variables**: Must match exactly what your template expects
- **Variable Names**: Use "1", "2", "3", etc. (as strings) for template variables
- **Template Approval**: Content templates must be approved by WhatsApp before use
- **Sandbox vs Production**: 
  - Sandbox: Can use plain text messages
  - Production: Must use approved content templates

## Troubleshooting

### Error: "Template variable mismatch"
- Check your template structure in Twilio Console
- Ensure contentVariables match your template exactly

### Error: "Template not found"
- Verify your Content SID is correct
- Check if template is approved in Twilio Console

### Message not sending
- Check Twilio Console for error logs
- Verify your account has sufficient credit
- Ensure recipient has joined WhatsApp sandbox (for testing)

