'use client';

import React, { useState, useEffect } from 'react';
import { OptimizedDeal, Product, PartnerCardholder, EscrowOrder } from '../types';
import { X, ShieldCheck } from 'lucide-react';
import { useCompareCart } from '../lib/store';
import { EscrowReviewStep } from './escrow/EscrowReviewStep';
import { EscrowAddressStep } from './escrow/EscrowAddressStep';
import { EscrowPaymentStep } from './escrow/EscrowPaymentStep';
import { EscrowMatchmakerBuffer } from './escrow/EscrowMatchmakerBuffer';
import { EscrowConfirmedStep } from './escrow/EscrowConfirmedStep';
import { MERCHANT_METADATA } from '../lib/deal-engine';

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

    addNotification({
      title: `⚡ New Swipe Request: ${deal.partnerCard?.bank || 'HDFC Bank'}`,
      message: `Shopper deposited ₹${deal.partnerFinalEffectivePrice.toLocaleString('en-IN')} in Escrow for ${product.title.slice(0, 32)}. Payout reward: ₹${deal.cardholderCommission.toLocaleString('en-IN')}.`,
      type: 'order',
      orderId: order.id,
    });

    const pTimer = setTimeout(() => {
      setMatchProgress(75);
    }, 1200);

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

    claimSwipeOrder(order.id, matchedPartner.id, matchedCard?.id);

    addNotification({
      title: '🎉 Cardholder Matched & Claimed!',
      message: `${matchedPartner.name} locked ${matchedCard?.bank} ${matchedCard?.cardName} (..${matchedCard?.last4}) for ${product.title.slice(0, 32)}. Order moving to fulfillment!`,
      type: 'success',
      orderId: order.id,
    });

    setTimeout(() => {
      setStep('confirmed');
      onOrderCreated(order);
    }, 1200);
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
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

        {/* Stepper Progression */}
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

        {/* Modal Steps */}
        <div className="p-5 sm:p-6 space-y-5">
          {step === 'review' && (
            <EscrowReviewStep
              product={product}
              deal={deal}
              matchedPartner={matchedPartner}
              onContinue={() => setStep('address')}
            />
          )}

          {step === 'address' && (
            <EscrowAddressStep
              merchantName={meta.name}
              buyerName={buyerName}
              setBuyerName={setBuyerName}
              buyerPhone={buyerPhone}
              setBuyerPhone={setBuyerPhone}
              addressLine={addressLine}
              setAddressLine={setAddressLine}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              pincode={pincode}
              setPincode={setPincode}
              onBack={() => setStep('review')}
              onProceed={() => setStep('escrow_payment')}
            />
          )}

          {step === 'escrow_payment' && (
            <EscrowPaymentStep
              amount={deal.partnerFinalEffectivePrice}
              isProcessing={isProcessing}
              paymentError={paymentError}
              onPayRazorpay={handleRazorpayPayment}
              onSimulateSandbox={handleSimulateSandboxPayment}
            />
          )}

          {step === 'searching_cardholders' && createdOrder && (
            <EscrowMatchmakerBuffer
              matchedPartner={matchedPartner}
              matchStatus={matchStatus}
              matchProgress={matchProgress}
              bankName={deal.partnerCard?.bank || 'HDFC Bank'}
              onInstantAccept={() => executeCardholderAcceptance(createdOrder)}
            />
          )}

          {step === 'confirmed' && createdOrder && (
            <EscrowConfirmedStep
              createdOrder={createdOrder}
              matchedPartner={matchedPartner}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
