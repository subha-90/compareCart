import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance, RAZORPAY_KEY_ID } from '../../../../src/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderNumber, productName } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount in INR is required' }, { status: 400 });
    }

    // Convert amount to paise (e.g. ₹45,000 -> 4500000 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const receiptId = (orderNumber || `cc_${Date.now()}`).slice(0, 40);

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        platform: 'CompareCart',
        product: (productName || 'Order Fulfillment').slice(0, 100),
        receipt: receiptId,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to create Razorpay order',
        details: error?.error?.description || error?.toString(),
      },
      { status: 500 }
    );
  }
}
