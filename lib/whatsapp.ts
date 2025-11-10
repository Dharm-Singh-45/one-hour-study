// WhatsApp utility functions for sending payment reminders

export interface PaymentReminderData {
  studentName: string;
  studentPhone: string; // Format: +919876543210 (with country code)
  teacherName: string;
  amount: number;
  subject: string;
  allocationId?: string;
}

/**
 * Format phone number for WhatsApp (adds whatsapp: prefix if needed)
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove any spaces, dashes, or parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If it doesn't start with +, add it (assuming Indian numbers)
  if (!cleaned.startsWith('+')) {
    // If it starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    // Add +91 for India (you can modify this for other countries)
    cleaned = `+91${cleaned}`;
  }
  
  // Add whatsapp: prefix
  return `whatsapp:${cleaned}`;
}

/**
 * Build payment reminder message
 */
export function buildPaymentReminderMessage(data: PaymentReminderData): string {
  const { studentName, teacherName, amount, subject } = data;
  
  return `Hello ${studentName},

This is a payment reminder from OneHourStudy.

📚 Subject: ${subject}
👨‍🏫 Teacher: ${teacherName}
💰 Amount Due: ₹${amount}

Please complete your payment at your earliest convenience. If you have already made the payment, please ignore this message.

Thank you for choosing OneHourStudy!

Best regards,
OneHourStudy Team`;
}

/**
 * Send WhatsApp payment reminder using plain text (for sandbox/testing)
 */
export async function sendPaymentReminder(data: PaymentReminderData): Promise<{
  success: boolean;
  message: string;
  messageSid?: string;
}> {
  try {
    const formattedPhone = formatWhatsAppNumber(data.studentPhone);
    const message = buildPaymentReminderMessage(data);

    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        message,
        studentName: data.studentName,
        teacherName: data.teacherName,
        amount: data.amount,
        subject: data.subject,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to send WhatsApp message',
      };
    }

    return {
      success: true,
      message: 'Payment reminder sent successfully!',
      messageSid: result.messageSid,
    };
  } catch (error: any) {
    console.error('Error sending payment reminder:', error);
    return {
      success: false,
      message: error.message || 'Failed to send payment reminder',
    };
  }
}

/**
 * Send WhatsApp payment reminder using content template (for production)
 */
export async function sendPaymentReminderWithTemplate(
  data: PaymentReminderData,
  contentSid: string,
  contentVariables: Record<string, string>
): Promise<{
  success: boolean;
  message: string;
  messageSid?: string;
}> {
  try {
    const formattedPhone = formatWhatsAppNumber(data.studentPhone);

    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        contentSid,
        contentVariables: JSON.stringify(contentVariables),
        studentName: data.studentName,
        teacherName: data.teacherName,
        amount: data.amount,
        subject: data.subject,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to send WhatsApp message',
      };
    }

    return {
      success: true,
      message: 'Payment reminder sent successfully!',
      messageSid: result.messageSid,
    };
  } catch (error: any) {
    console.error('Error sending payment reminder:', error);
    return {
      success: false,
      message: error.message || 'Failed to send payment reminder',
    };
  }
}

/**
 * Build custom WhatsApp message
 */
export function buildCustomMessage(template: string, variables: Record<string, string>): string {
  let message = template;
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, variables[key]);
  });
  return message;
}

