'use client';

import React, { useState, useEffect } from 'react';
import { OptimizedDeal, Product, PartnerCardholder, EscrowOrder } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Clock,
  UserCheck,
  Building,
  Check,
  PackageCheck,
  Radio,
  Zap,
  Sparkles
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
  const { partners, createEscrowOrder, claimSwipeOrder, addNotification } = useCompareCart();

  const [step, setStep] = useState<'review' | 'address' | 'escrow_payment' | 'searching_cardholders' | 'confirmed'>('review');
  const [buyerName, setBuyerName] = useState('Rahul Deshmukh');
  const [buyerPhone, setBuyerPhone] = useState('+91 98201 44521');
  const [addressLine, setAddressLine] = useState('B-702, Skyline Towers, Outer Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560103');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<EscrowOrder | null>(null);

  // Matchmaking buffer state
  const [matchStatus, setMatchStatus] = useState<'searching' | 'accepted'>('searching');
  const [matchProgress, setMatchProgress] = useState(20);

  // Load Razorpay Checkout Script on Modal Mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Reset modal state whenever opened for a product/deal
  useEffect(() => {
    if (isOpen) {
      setStep('review');
      setCreatedOrder(null);
      setPaymentError(null);
      setIsProcessing(false);
      setMatchStatus('searching');
      setMatchProgress(20);
    }
  }, [isOpen, product?.id, deal?.merchantId]);

  const handleClose = () => {
    setStep('review');
    setCreatedOrder(null);
    setPaymentError(null);
    setIsProcessing(false);
    setMatchStatus('searching');
    setMatchProgress(20);
    onClose();
  };

  // Auto-redirect to My Orders section after order confirmation
  useEffect(() => {
    if (step === 'confirmed') {
      const timer = setTimeout(() => {
        handleClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const meta = MERCHANT_METADATA[deal.merchantId];
  const matchedPartner: PartnerCardholder = partners[0];
  const matchedCard = matchedPartner?.cardsHeld[0];

  // Initiate buffer search & dispatch cardholder notifications
  const startCardholderMatchmaking = (order: EscrowOrder) => {
    setStep('searching_cardholders');
    setMatchStatus('searching');
    setMatchProgress(35);

    // 1. Dispatch In-App Notification to Cardholder Pool immediately
    addNotification({
      title: `⚡ New Swipe Request: ${deal.partnerCard?.bank || 'HDFC Bank'}`,
      message: `Shopper deposited ₹${deal.partnerFinalEffectivePrice.toLocaleString('en-IN')} in Escrow for ${product.title.slice(0, 32)}. Payout reward: ₹${deal.cardholderCommission.toLocaleString('en-IN')}.`,
      type: 'order',
      orderId: order.id,
    });

    // 2. Animate matchmaking buffer
    const pTimer = setTimeout(() => {
      setMatchProgress(75);
    }, 1200);

    // 3. Cardholder accepts the swipe request after 2.6 seconds
    const acceptTimer = setTimeout(() => {
      executeCardholderAcceptance(order);
    }, 2600);

    return () => {
      clearTimeout(pTimer);
      clearTimeout(acceptTimer);
    };
  };

  const executeCardholderAcceptance = (order: EscrowOrder) => {
    if (matchStatus === 'accepted') return;
    setMatchStatus('accepted');
    setMatchProgress(100);

    // Claim order in global state
    claimSwipeOrder(order.id, matchedPartner.id, matchedCard?.id);

    // Notify cardholder acceptance
    addNotification({
      title: '🎉 Cardholder Matched & Claimed!',
      message: `${matchedPartner.name} locked ${matchedCard?.bank} ${matchedCard?.cardName} (..${matchedCard?.last4}) for ${product.title.slice(0, 32)}. Order moving to fulfillment!`,
      type: 'success',
      orderId: order.id,
    });

    // Transition to confirmed success screen after brief acknowledgment
    setTimeout(() => {
      setStep('confirmed');
      onOrderCreated(order);
    }, 1200);
  };

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
                setIsProcessing(false);
                startCardholderMatchmaking(order);
              } else {
                setPaymentError('Cryptographic payment verification failed. Please contact support.');
                setIsProcessing(false);
              }
            } catch (err: any) {
              setPaymentError(err.message || 'Error verifying payment signature');
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
      startCardholderMatchmaking(order);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
      <div className="bg-white dark:bg-[#1c1c1e] backdrop-blur-3xl text-slate-900 dark:text-[#f5f5f7] rounded-[28px] max-w-lg w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-white/10 shadow-2xl relative transition-colors duration-200">
        
        {/* Apple-Style Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.08] flex items-center justify-center text-slate-800 dark:text-white border border-slate-200 dark:border-transparent">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-[#30d158]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Partner Card Escrow</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#30d158] border border-emerald-500/20">
                  RBI Protected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#86868b] font-medium">Peer-to-Peer Discount Fulfillment</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-[#86868b] dark:hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Stepper Progression */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-black/40 border-b border-slate-200 dark:border-white/[0.06]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-[#86868b]">
            <span className={step === 'review' ? 'text-slate-950 font-bold dark:text-white' : ''}>1. Split</span>
            <span>•</span>
            <span className={step === 'address' ? 'text-slate-950 font-bold dark:text-white' : ''}>2. Address</span>
            <span>•</span>
            <span className={step === 'escrow_payment' ? 'text-slate-950 font-bold dark:text-white' : ''}>3. UPI Deposit</span>
            <span>•</span>
            <span className={step === 'searching_cardholders' ? 'text-blue-600 font-bold dark:text-blue-400' : ''}>4. Match</span>
            <span>•</span>
            <span className={step === 'confirmed' ? 'text-emerald-600 font-bold dark:text-[#30d158]' : ''}>5. Status</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* STEP 1: REVIEW & PARTNER MATCH */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Product Brief */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/[0.06]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-contain bg-white dark:bg-zinc-900 rounded-xl p-1 border border-slate-200 dark:border-transparent"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{product.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-[#86868b] mt-0.5">
                    Order fulfilled on <strong className="text-slate-900 dark:text-white font-semibold">{meta.name}</strong> to your delivery address
                  </p>
                </div>
              </div>

              {/* Matched Verified Cardholder */}
              <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#86868b] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#2864FF] dark:text-[#2997ff]" /> Matched Cardholder
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 dark:text-[#30d158]">
                    Trust Rating: {matchedPartner.trustScore}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={matchedPartner.avatar}
                    alt={matchedPartner.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{matchedPartner.name}</p>
                      <span className="text-[10px] text-slate-500 dark:text-[#86868b]">({matchedPartner.city})</span>
                    </div>
                    <p className="text-xs text-[#2864FF] dark:text-[#2997ff] font-semibold mt-0.5 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#2864FF] dark:text-[#2997ff]" />
                      {matchedCard?.cardName} (..{matchedCard?.last4})
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-[#86868b] block mt-0.5">
                      {matchedPartner.totalOrdersFulfilled}+ fulfillments • KYC Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Financial Split */}
              <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-[#86868b]">
                  <span>Merchant Listed Price</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{deal.listedPrice.toLocaleString('en-IN')}</span>
                </div>
                {deal.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-[#30d158] font-semibold">
                    <span>Applied Merchant Coupon</span>
                    <span>−₹{deal.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#2864FF] dark:text-[#2997ff] font-semibold">
                  <span>Partner Card Bank Offer ({deal.bestBankOffer?.bank})</span>
                  <span>−₹{deal.grossBankDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-300 dark:border-white/10 space-y-1 text-[11px]">
                  <div className="flex justify-between text-emerald-600 dark:text-[#30d158] font-bold">
                    <span>↳ Your Net Cash Savings (70%)</span>
                    <span>+₹{deal.buyerSavings.toLocaleString('en-IN')} Saved</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-[#86868b]">
                    <span>↳ Cardholder Incentive (18%)</span>
                    <span>₹{deal.cardholderCommission.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-[#86868b]">
                    <span>↳ CompareCart Escrow Fee (12%)</span>
                    <span>₹{deal.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-300 dark:border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-700 dark:text-[#86868b]">Amount Payable in Escrow:</span>
                    <p className="text-[10px] text-slate-500 dark:text-[#86868b]">Safeguarded until delivery verification</p>
                  </div>
                  <span className="text-xl font-extrabold text-slate-950 dark:text-white">
                    ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('address')}
                className="cc-gradient-btn w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-white shadow-glow-blue"
              >
                <span>Continue to Delivery Address</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-3.5 text-xs text-slate-700 dark:text-zinc-300 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#2864FF] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white font-bold">Direct Delivery to Your Address:</strong>
                  The order is booked directly in your name on {meta.name} with original GST tax invoice.
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Mobile Number (For Delivery OTP)</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Address</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-mono font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="w-1/3 text-xs py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-white/[0.06] dark:text-[#86868b] dark:border-transparent dark:hover:text-white font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('escrow_payment')}
                  className="cc-gradient-btn w-2/3 text-xs py-3 rounded-full flex items-center justify-center gap-1.5 font-bold text-white shadow-glow-blue"
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
              <div className="bg-slate-50 dark:bg-black/60 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-[#30d158] font-mono uppercase tracking-wider font-bold">
                  <Lock className="w-3.5 h-3.5" /> RBI-Compliant Escrow Account
                </div>
                <div className="text-3xl font-extrabold text-slate-950 dark:text-white">
                  ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#86868b] max-w-xs mx-auto font-medium">
                  Payment is locked in CompareCart's neutral escrow vault and released to the cardholder only after order delivery.
                </p>

                {/* Razorpay Trust Badge & Accepted Rails */}
                <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] p-3 rounded-2xl max-w-sm mx-auto space-y-2 shadow-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Razorpay Secure Checkout</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-[#2997ff] border border-blue-500/20 font-mono font-bold">
                      TEST SANDBOX
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-[#86868b] font-mono">
                    <span>UPI (GPay / PhonePe / Paytm)</span> • <span>Cards</span> • <span>NetBanking</span>
                  </div>
                </div>

                {paymentError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 text-left">
                    {paymentError}
                  </div>
                )}

                <button
                  disabled={isProcessing}
                  onClick={handleRazorpayPayment}
                  className="cc-gradient-btn w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-white shadow-glow-blue disabled:opacity-50"
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
                  className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-white/[0.06] dark:text-zinc-400 dark:border-transparent dark:hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-semibold transition"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>⚡ Instant Sandbox Simulation (Bypass Popup)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BUFFER SEARCHING FOR CARDHOLDERS */}
          {step === 'searching_cardholders' && createdOrder && (
            <div className="py-4 space-y-6 text-center animate-fade-in">
              {/* Radar Pulse Animation */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping duration-1000" />
                <span className="absolute inset-2 rounded-full bg-[#7047F5]/20 animate-pulse duration-700" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#2864FF] to-[#7047F5] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  {matchStatus === 'accepted' ? (
                    <Check className="w-8 h-8 text-white stroke-[3] animate-scale-in" />
                  ) : (
                    <Radio className="w-8 h-8 text-white animate-spin duration-3000" />
                  )}
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>{matchStatus === 'accepted' ? 'CARDHOLDER CLAIM CONFIRMED' : 'ACTIVE POOL MATCHMAKING'}</span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {matchStatus === 'accepted'
                    ? 'Cardholder Accepted Your Swipe Request!'
                    : 'Searching for Cardholders in Liquidity Pool...'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 max-w-sm mx-auto font-medium">
                  {matchStatus === 'accepted'
                    ? `${matchedPartner.name} locked ${matchedCard?.bank} card limit. Order moving to confirmed state...`
                    : `In-app notification broadcast to verified ${deal.partnerCard?.bank || 'HDFC Bank'} cardholders across Mumbai, Bengaluru & Delhi.`}
                </p>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="w-full max-w-sm mx-auto bg-slate-100 dark:bg-black/50 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                <div
                  className="bg-gradient-to-r from-[#2864FF] to-[#7047F5] h-full transition-all duration-700 rounded-full"
                  style={{ width: `${matchProgress}%` }}
                />
              </div>

              {/* Cardholder Candidate Spotlight */}
              <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 max-w-md mx-auto text-left shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 tracking-wider">
                    Priority Network Match
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    Trust Score {matchedPartner.trustScore}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={matchedPartner.avatar}
                    alt={matchedPartner.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{matchedPartner.name}</p>
                    <p className="text-[11px] text-[#2864FF] font-semibold truncate flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#2864FF]" />
                      {matchedCard?.bank} {matchedCard?.cardName} (..{matchedCard?.last4})
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                      Location: {matchedPartner.city} • Available Limit: ₹{matchedCard?.availableLimit.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {matchStatus === 'accepted' ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                      <Check className="w-3 h-3" /> Claimed
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" /> Pinging...
                    </span>
                  )}
                </div>
              </div>

              {matchStatus !== 'accepted' && (
                <div className="pt-1">
                  <button
                    onClick={() => executeCardholderAcceptance(createdOrder)}
                    className="text-xs py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-white/10 dark:text-zinc-300 dark:hover:text-white transition font-semibold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Simulate Instant Cardholder Acceptance</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="space-y-4 text-center py-2 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-[#30d158] flex items-center justify-center mx-auto border border-emerald-500/30">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Order Locked in Escrow</h3>
                <p className="text-xs text-slate-500 dark:text-[#86868b] mt-0.5 font-mono">
                  Order Ref: <strong className="text-slate-900 dark:text-white font-bold">{createdOrder.orderNumber}</strong>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
                {createdOrder.razorpayPaymentId && (
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
                    <span className="text-slate-600 dark:text-[#86868b]">Razorpay Payment ID:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded text-[11px] dark:text-[#30d158]">
                      {createdOrder.razorpayPaymentId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-[#86868b]">Merchant Reference:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.merchantOrderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-[#86868b]">Courier Tracking:</span>
                  <span className="font-semibold text-[#2864FF] dark:text-[#2997ff]">{createdOrder.awbTrackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-[#86868b]">Estimated Delivery:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-[#86868b]">Partner Cardholder:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.partnerName || matchedPartner.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10 font-medium font-sans">
                  <span className="text-slate-800 dark:text-zinc-300 font-bold">Amount in Escrow:</span>
                  <span className="text-emerald-600 dark:text-[#30d158] font-extrabold text-sm">
                    ₹{createdOrder.effectivePricePaid.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleClose}
                  className="cc-gradient-btn w-full py-3.5 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-glow-blue"
                >
                  <PackageCheck className="w-4 h-4 text-white" />
                  <span>Go to My Purchases & Escrow Tracking</span>
                </button>
                <p className="text-[11px] text-slate-500 dark:text-[#86868b] text-center font-medium">
                  Redirecting to Orders in 3 seconds...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
