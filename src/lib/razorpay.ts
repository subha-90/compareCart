import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

export const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export const RAZORPAY_KEY_ID = keyId;
