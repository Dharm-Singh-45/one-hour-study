# How to Create Custom WhatsApp Content Template in Twilio

This guide will walk you through creating a custom WhatsApp content template for payment reminders in Twilio.

## Prerequisites

1. Twilio account with WhatsApp enabled
2. WhatsApp Business Account (verified)
3. Access to Twilio Console

## Step-by-Step Guide

### Step 1: Access Content Template Builder

1. **Log in to Twilio Console**
   - Go to https://console.twilio.com/
   - Sign in with your credentials

2. **Navigate to Content Template Builder**
   - Click on **Messaging** in the left sidebar
   - Click on **Content Template Builder** (or **Try it out** > **Send a WhatsApp message** > **Content Templates**)

### Step 2: Create New Template

1. **Click "Create new" or "Create Template"**
   - You'll see a form to create a new template

2. **Fill in Template Details**
   - **Template Name**: `payment_reminder` (or any name you prefer)
   - **Language**: Select your language (e.g., `en` for English, `hi` for Hindi)
   - **Category**: Select `TRANSACTIONAL` (for payment reminders)
   - **Content Type**: Select `twilio/text` (for text messages)

### Step 3: Design Your Template

#### Template Structure for Payment Reminder

Here's a recommended template structure for payment reminders:

```
Hello {{1}},

This is a payment reminder from OneHourStudy.

📚 Subject: {{2}}
👨‍🏫 Teacher: {{3}}
💰 Amount Due: ₹{{4}}

Please complete your payment at your earliest convenience. If you have already made the payment, please ignore this message.

Thank you for choosing OneHourStudy!

Best regards,
OneHourStudy Team
```

#### Variables Explained

- `{{1}}` - Student Name
- `{{2}}` - Subject
- `{{3}}` - Teacher Name
- `{{4}}` - Amount Due

#### Alternative Simpler Template

If you want a simpler template with fewer variables:

```
Hello {{1}},

Payment reminder from OneHourStudy.

Amount Due: ₹{{2}} for {{3}}

Please complete your payment at your earliest convenience.

Thank you!
OneHourStudy Team
```

Variables:
- `{{1}}` - Student Name
- `{{2}}` - Amount Due
- `{{3}}` - Subject

### Step 4: Add Sample Data

Before submitting, you need to provide sample values for each variable:

**For 4-variable template:**
- `{{1}}`: `John Doe`
- `{{2}}`: `Mathematics`
- `{{3}}`: `Mr. Smith`
- `{{4}}`: `2000`

**For 3-variable template:**
- `{{1}}`: `John Doe`
- `{{2}}`: `2000`
- `{{3}}`: `Mathematics`

### Step 5: Submit for Approval

1. **Review your template**
   - Make sure all variables are properly formatted
   - Check spelling and grammar
   - Ensure compliance with WhatsApp policies

2. **Click "Save and submit for WhatsApp approval"**
   - Twilio will submit your template to WhatsApp for review

3. **Wait for Approval**
   - Approval typically takes **minutes to 24 hours**
   - You'll receive an email notification when approved
   - Check status in Twilio Console

### Step 6: Get Your Content SID

Once approved:

1. **Go to Content Templates** in Twilio Console
2. **Find your template** (`payment_reminder`)
3. **Copy the Content SID** (starts with `HX...`)
   - Example: `HXb5b62575e6e4ff6129ad7c8efe1f983e`

4. **Update your `.env.local` file:**
   ```env
   NEXT_PUBLIC_TWILIO_WHATSAPP_CONTENT_SID=HXb5b62575e6e4ff6129ad7c8efe1f983e
   ```

## Step 7: Update Your Code

After creating your template, update `pages/teacher-dashboard.tsx` to match your template variables:

### For 4-Variable Template:

```javascript
contentVariables: {
  "1": allocation.studentName,        // Student Name
  "2": allocation.subjects.join(', '), // Subject
  "3": user.name,                      // Teacher Name
  "4": allocation.fees.toString()      // Amount
}
```

### For 3-Variable Template:

```javascript
contentVariables: {
  "1": allocation.studentName,        // Student Name
  "2": allocation.fees.toString(),     // Amount
  "3": allocation.subjects.join(', ')  // Subject
}
```

## Template Best Practices

### ✅ DO:
- Keep messages clear and concise
- Use appropriate category (TRANSACTIONAL for payment reminders)
- Provide accurate sample data
- Follow WhatsApp's content policies
- Use variables for dynamic content

### ❌ DON'T:
- Use promotional language in TRANSACTIONAL templates
- Include URLs without proper buttons
- Use emojis excessively (some may not render)
- Create templates that violate WhatsApp policies
- Use misleading or false information

## WhatsApp Template Policies

Your template must comply with WhatsApp's policies:

1. **No Spam**: Don't send unsolicited messages
2. **Accurate Information**: All information must be accurate
3. **No Misleading Content**: Don't use deceptive practices
4. **Proper Category**: Use TRANSACTIONAL for payment reminders
5. **User Consent**: Only send to users who have opted in

## Troubleshooting

### Template Rejected?
- Check WhatsApp's rejection reason
- Ensure category is correct (TRANSACTIONAL)
- Remove any promotional language
- Simplify the message if too complex

### Variables Not Working?
- Ensure variable numbers match ({{1}}, {{2}}, etc.)
- Check that contentVariables object matches template
- Verify template is approved

### Template Not Found?
- Check if template is approved
- Verify Content SID is correct
- Ensure template is in the correct language

## Example: Complete Template Creation

Here's a complete example for a payment reminder template:

**Template Name**: `payment_reminder_en`

**Category**: `TRANSACTIONAL`

**Language**: `en` (English)

**Body**:
```
Hello {{1}},

This is a payment reminder from OneHourStudy.

Subject: {{2}}
Teacher: {{3}}
Amount Due: ₹{{4}}

Please complete your payment at your earliest convenience.

Thank you for choosing OneHourStudy!
```

**Sample Data**:
- {{1}}: `John Doe`
- {{2}}: `Mathematics`
- {{3}}: `Mr. Smith`
- {{4}}: `2000`

**Content SID** (after approval): `HXb5b62575e6e4ff6129ad7c8efe1f983e`

## Next Steps

1. **Create your template** in Twilio Console
2. **Wait for approval** (check email for notification)
3. **Copy Content SID** from approved template
4. **Update `.env.local`** with Content SID
5. **Update code** in `teacher-dashboard.tsx` to match variables
6. **Test** by sending a payment reminder

## Resources

- **Twilio Content Template Builder**: https://console.twilio.com/us1/develop/sms/content-template-builder
- **Twilio Documentation**: https://www.twilio.com/docs/content/create-templates-with-the-content-template-builder
- **WhatsApp Business Policy**: https://www.whatsapp.com/legal/business-policy

## Support

If you need help:
- Check Twilio Console for template status
- Review Twilio documentation
- Contact Twilio support if template is rejected

