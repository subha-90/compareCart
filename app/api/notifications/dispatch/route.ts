import { NextRequest, NextResponse } from 'next/server';

interface DispatchRequestBody {
  type: 'OTP_VERIFICATION' | 'PASSWORD_RESET' | 'ORDER_BROADCAST' | 'REFUND_ALERT';
  recipientPhone?: string;
  recipientEmail?: string;
  recipientName?: string;
  otpCode?: string;
  orderId?: string;
  amount?: number;
}

/**
 * Universal Push Notification Dispatch API Gateway
 * Multi-Channel:
 * 1. SMS / WhatsApp (Twilio / Fast2SMS)
 * 2. Transactional Email (Resend / SendGrid / SMTP)
 * 3. In-App Web Push Notification Event Bus
 */
export async function POST(req: NextRequest) {
  try {
    const body: DispatchRequestBody = await req.json();
    const { type, recipientPhone, recipientEmail, recipientName, otpCode, orderId, amount } = body;

    const dispatchedChannels: string[] = ['IN_APP_PUSH'];
    const deliveryLogs: string[] = [];

    // -----------------------------------------------------------------
    // 1. REAL EMAIL DELIVERY (Resend REST API)
    // -----------------------------------------------------------------
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && recipientEmail) {
      try {
        const emailSubject = type === 'OTP_VERIFICATION'
          ? `CompareCart Verification Code: ${otpCode}`
          : type === 'PASSWORD_RESET'
          ? `CompareCart Password Reset OTP: ${otpCode}`
          : type === 'ORDER_BROADCAST'
          ? `New Swipe Request Available (₹${amount})`
          : `100% Refund Executed for Order #${orderId}`;

        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #0c0c0e; color: #ffffff; border-radius: 16px; padding: 28px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #d4a017; margin: 0; font-size: 20px; font-weight: 700;">CompareCart Security</h2>
              <p style="color: #86868b; font-size: 12px; margin-top: 4px;">Universal Price Discovery & P2P Card Escrow</p>
            </div>
            <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
              ${otpCode ? `
                <p style="font-size: 13px; color: #a1a1aa; margin: 0 0 12px;">Your 6-digit verification code is:</p>
                <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #ffffff; font-family: monospace;">${otpCode}</div>
                <p style="font-size: 11px; color: #71717a; margin-top: 12px;">This code is valid for 5 minutes. Never share this code with anyone.</p>
              ` : `
                <p style="font-size: 14px; color: #e4e4e7; margin: 0;">${emailSubject}</p>
              `}
            </div>
            <p style="font-size: 11px; color: #52525b; text-align: center; margin-top: 24px;">© 2026 CompareCart Technologies. RBI Nodal Dual-Custody Compliant.</p>
          </div>
        `;

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'CompareCart <onboarding@resend.dev>',
            to: [recipientEmail],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (res.ok) {
          dispatchedChannels.push('EMAIL_RESEND_LIVE');
          deliveryLogs.push(`Live Email dispatched to ${recipientEmail}`);
        }
      } catch (err) {
        console.warn('[DispatchAPI] Resend delivery error:', err);
      }
    } else if (recipientEmail) {
      deliveryLogs.push(`Email simulated to ${recipientEmail} (Set RESEND_API_KEY in .env.local for live SMTP)`);
    }

    // -----------------------------------------------------------------
    // 2. REAL SMS DELIVERY (Twilio / Fast2SMS API)
    // -----------------------------------------------------------------
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const fast2smsKey = process.env.FAST2SMS_API_KEY;

    if (twilioSid && twilioAuth && twilioPhone && recipientPhone) {
      try {
        const smsMessage = `Your CompareCart verification code is ${otpCode}. Valid for 5 minutes. Do not share.`;
        const params = new URLSearchParams({
          To: recipientPhone,
          From: twilioPhone,
          Body: smsMessage,
        });

        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        if (res.ok) {
          dispatchedChannels.push('SMS_TWILIO_LIVE');
          deliveryLogs.push(`Live Twilio SMS dispatched to ${recipientPhone}`);
        }
      } catch (err) {
        console.warn('[DispatchAPI] Twilio delivery error:', err);
      }
    } else if (fast2smsKey && recipientPhone) {
      try {
        const cleanNumber = recipientPhone.replace(/[^0-9]/g, '').slice(-10);
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otpCode,
            numbers: cleanNumber,
          }),
        });

        if (res.ok) {
          dispatchedChannels.push('SMS_FAST2SMS_LIVE');
          deliveryLogs.push(`Live Fast2SMS dispatched to ${cleanNumber}`);
        }
      } catch (err) {
        console.warn('[DispatchAPI] Fast2SMS delivery error:', err);
      }
    } else if (recipientPhone) {
      deliveryLogs.push(`SMS simulated to ${recipientPhone} (Set TWILIO_ACCOUNT_SID or FAST2SMS_API_KEY for live cellular delivery)`);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      channels: dispatchedChannels,
      logs: deliveryLogs,
      message: `Notification processed for ${recipientPhone || recipientEmail || 'User'}.`,
    });
  } catch (error: any) {
    console.error('[DispatchAPI] Error in notification gateway:', error);
    return NextResponse.json(
      { error: error.message || 'Internal notification gateway error' },
      { status: 500 }
    );
  }
}
