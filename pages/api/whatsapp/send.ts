import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

// Initialize Twilio client
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface SendWhatsAppRequest {
  to: string; // Phone number in format: whatsapp:+919876543210
  message?: string; // Plain text message (for sandbox/testing)
  contentSid?: string; // Content template SID (for production)
  contentVariables?: string; // JSON string of template variables
  studentName?: string;
  teacherName?: string;
  amount?: number;
  subject?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Check if Twilio is configured
  if (!client || !twilioWhatsAppNumber) {
    return res.status(500).json({
      success: false,
      message: 'WhatsApp service is not configured. Please set Twilio credentials in environment variables.',
    });
  }

  try {
    const { to, message, contentSid, contentVariables, studentName, teacherName, amount, subject }: SendWhatsAppRequest = req.body;

    // Validate required fields
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: to (phone number) is required',
      });
    }

    // Must have either message (plain text) or contentSid (template)
    if (!message && !contentSid) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: either message (plain text) or contentSid (template) is required',
      });
    }

    // Format phone number (ensure it starts with whatsapp:)
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    // Build message payload
    const messagePayload: any = {
      from: twilioWhatsAppNumber,
      to: formattedTo,
    };

    // Use content template if provided, otherwise use plain text
    if (contentSid) {
      messagePayload.contentSid = contentSid;
      if (contentVariables) {
        messagePayload.contentVariables = contentVariables;
      }
    } else if (message) {
      messagePayload.body = message;
    }

    // Send WhatsApp message via Twilio
    const twilioMessage = await client.messages.create(messagePayload);

    return res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully',
      messageSid: twilioMessage.sid,
      status: twilioMessage.status,
    });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    
    // Handle Twilio-specific errors
    if (error.code) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to send WhatsApp message',
        errorCode: error.code,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

