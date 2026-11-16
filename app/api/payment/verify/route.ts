import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required Razorpay payment verification fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error: Key Secret not configured' }, { status: 500 });
    }

    // Verify cryptographic signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Cryptographic signature mismatch. Potential tampering detected.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      orderNumber,
      message: 'Escrow payment verified successfully via Razorpay signature verification.',
    });
  } catch (error: any) {
    console.error('[Razorpay Verify Error]:', error);
    return NextResponse.json({ error: error?.message || 'Verification failed' }, { status: 500 });
  }
}
