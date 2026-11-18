'use client';

import React, { useState } from 'react';
import { OptimizedDeal, Product, PartnerCardholder, EscrowOrder } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  MapPin,
  Clock,
  UserCheck,
  Building,
  Check,
  PackageCheck
} from 'lucide-react';
import { MERCHANT_METADATA } from '../lib/deal-engine';
import { useCompareCart } from '../lib/store';

interface PartnerEscrowModalProps {
  product: Product;
  deal: OptimizedDeal;
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: EscrowOrder) => void;
}

export const PartnerEscrowModal: React.FC<PartnerEscrowModalProps> = ({
  product,
  deal,
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const { partners, createEscrowOrder } = useCompareCart();

  const [step, setStep] = useState<'review' | 'address' | 'escrow_payment' | 'confirmed'>('review');
  const [buyerName, setBuyerName] = useState('Rahul Deshmukh');
  const [buyerPhone, setBuyerPhone] = useState('+91 98201 44521');
  const [addressLine, setAddressLine] = useState('B-702, Skyline Towers, Outer Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560103');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<EscrowOrder | null>(null);

  // Load Razorpay Checkout Script on Modal Mount
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Reset modal state whenever opened for a product/deal
  React.useEffect(() => {
    if (isOpen) {
      setStep('review');
      setCreatedOrder(null);
      setPaymentError(null);
      setIsProcessing(false);
    }
  }, [isOpen, product?.id, deal?.merchantId]);

  const handleClose = () => {
    setStep('review');
    setCreatedOrder(null);
    setPaymentError(null);
    setIsProcessing(false);
    onClose();
  };

  // Auto-redirect to My Orders section after order confirmation
  React.useEffect(() => {
    if (step === 'confirmed') {
      const timer = setTimeout(() => {
        handleClose();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const meta = MERCHANT_METADATA[deal.merchantId];
  const matchedPartner: PartnerCardholder = partners[0];
  const matchedCard = matchedPartner?.cardsHeld[0];

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Create Razorpay Order from server API
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: deal.partnerFinalEffectivePrice,
          orderNumber: `CC-${Date.now().toString().slice(-6)}`,
          productName: product.title,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay order');
      }

      // Check if window.Razorpay is loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'CompareCart Escrow Vault',
          description: `Hold for ${product.title.slice(0, 32)}`,
          image: '/logo-icon.png',
          order_id: orderData.orderId,
          handler: async function (response: any) {
            try {
              // 2. Cryptographically verify signature on server
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderNumber: orderData.orderId,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyData.verified) {
                const order = createEscrowOrder({
                  product,
                  deal,
                  buyerName,
                  buyerPhone,
                  address: {
                    line1: addressLine,
                    city,
                    state,
                    pincode,
                  },
                  paymentMode: 'PARTNER_ESCROW_UPI',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                });
                setCreatedOrder(order);
                setStep('confirmed');
                onOrderCreated(order);
              } else {
                setPaymentError('Cryptographic payment verification failed. Please contact support.');
              }
            } catch (err: any) {
              setPaymentError(err.message || 'Error verifying payment signature');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: buyerName,
            contact: buyerPhone,
            email: 'shopper@comparecart.in',
          },
          notes: {
            platform: 'CompareCart',
            merchant: deal.merchantName,
            partnerCommission: deal.cardholderCommission,
          },
          theme: {
            color: '#2864FF',
            backdrop_color: 'rgba(0, 0, 0, 0.85)',
          },
          config: {
            display: {
              blocks: {
                upi: {
                  name: 'Pay with UPI (GPay, PhonePe, Paytm, QR)',
                  instruments: [{ method: 'upi' }],
                },
                banks: {
                  name: 'Cards & Netbanking',
                  instruments: [{ method: 'card' }, { method: 'netbanking' }],
                },
              },
              sequence: ['block.upi', 'block.banks'],
              preferences: {
                show_default_blocks: true,
              },
            },
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (failResp: any) {
          setPaymentError(failResp?.error?.description || 'Payment was declined');
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback simulation if script blocked by adblocker
        handleSimulateSandboxPayment();
      }
    } catch (err: any) {
      console.error('[Razorpay Init Error]:', err);
      setPaymentError(err.message || 'Payment initiation failed. Using sandbox fallback.');
      setIsProcessing(false);
    }
  };

  const handleSimulateSandboxPayment = () => {
    setIsProcessing(true);
    setPaymentError(null);
    setTimeout(() => {
      const mockPayId = `pay_sim_${Date.now().toString().slice(-8)}`;
      const order = createEscrowOrder({
        product,
        deal,
        buyerName,
        buyerPhone,
        address: {
          line1: addressLine,
          city,
          state,
          pincode,
        },
        paymentMode: 'PARTNER_ESCROW_UPI',
        razorpayPaymentId: mockPayId,
      });
      setCreatedOrder(order);
      setIsProcessing(false);
      setStep('confirmed');
      onOrderCreated(order);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
      <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl text-[#f5f5f7] rounded-[28px] max-w-lg w-full max-h-[92vh] overflow-y-auto border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative">
        {/* Apple-Style Header */}
        <div className="sticky top-0 bg-[#1c1c1e]/95 backdrop-blur-2xl p-5 border-b border-white/[0.08] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-[#30d158]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm tracking-tight">Partner Card Escrow</h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#30d158]/10 text-[#30d158] border border-[#30d158]/20">
                  RBI Protected
                </span>
              </div>
              <p className="text-[11px] text-[#86868b]">Peer-to-Peer Discount Fulfillment</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#86868b] hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Stepper Progression */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/[0.06]">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#86868b]">
            <span className={step === 'review' ? 'text-white font-semibold' : ''}>1. Split</span>
            <span>•</span>
            <span className={step === 'address' ? 'text-white font-semibold' : ''}>2. Address</span>
            <span>•</span>
            <span className={step === 'escrow_payment' ? 'text-white font-semibold' : ''}>3. UPI Deposit</span>
            <span>•</span>
            <span className={step === 'confirmed' ? 'text-white font-semibold' : ''}>4. Status</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: REVIEW & PARTNER MATCH */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Product Brief */}
              <div className="flex items-center gap-3 p-3 bg-black/40 rounded-2xl border border-white/[0.06]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-contain bg-zinc-900 rounded-xl p-1"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{product.title}</h4>
                  <p className="text-[11px] text-[#86868b] mt-0.5">
                    Order fulfilled on <strong className="text-white">{meta.name}</strong> to your delivery address
                  </p>
                </div>
              </div>

              {/* Matched Verified Cardholder */}
              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#86868b] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#2997ff]" /> Matched Cardholder
                  </span>
                  <span className="text-[10px] font-medium text-[#30d158] bg-[#30d158]/10 px-2.5 py-0.5 rounded-full border border-[#30d158]/20">
                    Trust Rating: {matchedPartner.trustScore}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={matchedPartner.avatar}
                    alt={matchedPartner.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-white text-xs">{matchedPartner.name}</p>
                      <span className="text-[10px] text-[#86868b]">({matchedPartner.city})</span>
                    </div>
                    <p className="text-xs text-[#2997ff] font-medium mt-0.5 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#2997ff]" />
                      {matchedCard?.cardName} (..{matchedCard?.last4})
                    </p>
                    <span className="text-[10px] text-[#86868b] block mt-0.5">
                      {matchedPartner.totalOrdersFulfilled}+ fulfillments • KYC Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Financial Split */}
              <div className="bg-black/50 border border-white/[0.06] rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#86868b]">
                  <span>Merchant Listed Price</span>
                  <span className="font-medium text-white">₹{deal.listedPrice.toLocaleString('en-IN')}</span>
                </div>
                {deal.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#30d158] font-medium">
                    <span>Applied Merchant Coupon</span>
                    <span>−₹{deal.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#2997ff] font-medium">
                  <span>Partner Card Bank Offer ({deal.bestBankOffer?.bank})</span>
                  <span>−₹{deal.grossBankDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-dashed border-white/10 space-y-1 text-[11px]">
                  <div className="flex justify-between text-[#30d158] font-medium">
                    <span>↳ Your Net Cash Savings (70%)</span>
                    <span>+₹{deal.buyerSavings.toLocaleString('en-IN')} Saved</span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>↳ Cardholder Incentive (18%)</span>
                    <span>₹{deal.cardholderCommission.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>↳ CompareCart Escrow Fee (12%)</span>
                    <span>₹{deal.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#86868b]">Amount Payable in Escrow:</span>
                    <p className="text-[10px] text-[#86868b]">Safeguarded until delivery verification</p>
                  </div>
                  <span className="text-xl font-semibold text-white">
                    ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('address')}
                className="apple-pill-btn w-full py-3.5 flex items-center justify-center gap-2 text-xs"
              >
                <span>Continue to Delivery Address</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-3 text-xs text-zinc-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#86868b] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Direct Delivery to Your Address:</strong>
                  The order is booked directly in your name on {meta.name} with original GST tax invoice.
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#0071e3]/60 focus:ring-1 focus:ring-[#0071e3]/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Mobile Number (For Delivery OTP)</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#0071e3]/60 focus:ring-1 focus:ring-[#0071e3]/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Address</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#0071e3]/60 focus:ring-1 focus:ring-[#0071e3]/30"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-[#86868b] mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#0071e3]/60 focus:ring-1 focus:ring-[#0071e3]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#86868b] mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#0071e3]/60 focus:ring-1 focus:ring-[#0071e3]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#86868b] mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#0071e3]/60 focus:ring-1 focus:ring-[#0071e3]/30 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="apple-pill-btn-secondary w-1/3 text-xs py-3"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('escrow_payment')}
                  className="apple-pill-btn w-2/3 text-xs py-3 flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Escrow Deposit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ESCROW PAYMENT */}
          {step === 'escrow_payment' && (
            <div className="space-y-4 text-center">
              <div className="bg-black/60 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#30d158] font-mono uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" /> RBI-Compliant Escrow Account
                </div>
                <div className="text-2xl font-semibold text-white">
                  ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-[#86868b] max-w-xs mx-auto">
                  Payment is locked in CompareCart's neutral escrow vault and released to the cardholder only after order delivery.
                </p>

                {/* Razorpay Trust Badge & Accepted Rails */}
                <div className="bg-white/[0.04] border border-white/[0.08] p-3 rounded-2xl max-w-sm mx-auto space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-semibold text-white tracking-tight">Razorpay Secure Checkout</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/30 font-mono">
                      TEST SANDBOX
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-[#86868b] font-mono">
                    <span>UPI (GPay / PhonePe / Paytm)</span> • <span>Cards</span> • <span>NetBanking</span>
                  </div>
                </div>

                {paymentError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-left">
                    {paymentError}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  disabled={isProcessing}
                  onClick={handleRazorpayPayment}
                  className="apple-pill-btn w-full py-3.5 flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50 shadow-[0_4px_20px_rgba(0,113,227,0.35)]"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>Pay ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')} via Razorpay / UPI</span>
                    </>
                  )}
                </button>

                <button
                  disabled={isProcessing}
                  onClick={handleSimulateSandboxPayment}
                  className="apple-pill-btn-secondary w-full py-2.5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 hover:text-white"
                >
                  <span>⚡ Instant Sandbox Simulation (Bypass Popup)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#30d158]/10 text-[#30d158] flex items-center justify-center mx-auto border border-[#30d158]/20">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-white">Order Locked in Escrow</h3>
                <p className="text-xs text-[#86868b] mt-0.5 font-mono">
                  Order Ref: <strong className="text-white">{createdOrder.orderNumber}</strong>
                </p>
              </div>

              <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
                {createdOrder.razorpayPaymentId && (
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-[#86868b]">Razorpay Payment ID:</span>
                    <span className="font-medium text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded text-[11px]">
                      {createdOrder.razorpayPaymentId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Merchant Reference:</span>
                  <span className="font-medium text-white">{createdOrder.merchantOrderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Courier Tracking:</span>
                  <span className="font-medium text-[#2997ff]">{createdOrder.awbTrackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Estimated Delivery:</span>
                  <span className="font-medium text-white">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Partner Cardholder:</span>
                  <span className="font-medium text-white">{createdOrder.partnerName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-medium font-sans">
                  <span>Amount in Escrow:</span>
                  <span className="text-[#30d158]">₹{createdOrder.effectivePricePaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleClose}
                  className="apple-pill-btn w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,113,227,0.35)]"
                >
                  <PackageCheck className="w-4 h-4 text-white" />
                  <span>Go to My Purchases & Escrow Tracking</span>
                </button>
                <p className="text-[11px] text-[#86868b] text-center">
                  Redirecting to Orders in 2 seconds...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};