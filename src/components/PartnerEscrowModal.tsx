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
  Sparkles,
  MapPin,
  Clock,
  UserCheck
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
  const [createdOrder, setCreatedOrder] = useState<EscrowOrder | null>(null);

  if (!isOpen) return null;

  const meta = MERCHANT_METADATA[deal.merchantId];

  // Matched partner from the store
  const matchedPartner: PartnerCardholder = partners[0];
  const matchedCard = matchedPartner?.cardsHeld[0];

  const handlePayAndLockEscrow = () => {
    setIsProcessing(true);
    setTimeout(() => {
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
      });
      setCreatedOrder(order);
      setIsProcessing(false);
      setStep('confirmed');
      onOrderCreated(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Partner Card Discount Checkout</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Zero Card Required
                </span>
              </div>
              <p className="text-xs text-slate-500">Secure Peer-to-Peer Bank Discount Sharing</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className={step === 'review' ? 'text-emerald-700 font-bold' : ''}>1. Savings Split</span>
            <span>→</span>
            <span className={step === 'address' ? 'text-emerald-700 font-bold' : ''}>2. Delivery Address</span>
            <span>→</span>
            <span className={step === 'escrow_payment' ? 'text-emerald-700 font-bold' : ''}>3. UPI Escrow Pay</span>
            <span>→</span>
            <span className={step === 'confirmed' ? 'text-emerald-700 font-bold' : ''}>4. Order Placed</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: REVIEW & PARTNER MATCH */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Product Snippet */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>Fulfillment on <strong>{meta.name}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">100% Original Tax Invoice in your name</span>
                  </div>
                </div>
              </div>

              {/* Matched Verified Cardholder Profile */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Matched Partner Cardholder
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Trust Score: {matchedPartner.trustScore}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={matchedPartner.avatar}
                    alt={matchedPartner.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 text-sm">{matchedPartner.name}</p>
                      <span className="text-[10px] text-slate-500">({matchedPartner.city})</span>
                    </div>
                    <p className="text-xs text-blue-900 font-semibold mt-0.5 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-blue-700" />
                      {matchedCard?.cardName} (..{matchedCard?.last4})
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Fulfilled {matchedPartner.totalOrdersFulfilled}+ orders • KYC Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Financial Split */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Merchant Listed Price</span>
                  <span className="font-semibold text-slate-800">₹{deal.listedPrice.toLocaleString('en-IN')}</span>
                </div>
                {deal.couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Applied Coupon ({deal.appliedCoupon?.code})</span>
                    <span>−₹{deal.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-blue-700 font-medium">
                  <span>Partner Card Bank Discount ({deal.bestBankOffer?.bank})</span>
                  <span>−₹{deal.grossBankDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>↳ Your Net Pocket Savings (70%)</span>
                    <span className="text-emerald-700 font-bold">+₹{deal.buyerSavings.toLocaleString('en-IN')} Saved</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>↳ Cardholder Incentive (18%)</span>
                    <span>₹{deal.cardholderCommission.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>↳ CompareCart Escrow & Protection Fee (12%)</span>
                    <span>₹{deal.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-700">You Pay via UPI Escrow:</span>
                    <p className="text-[10px] text-slate-400">Funds held securely until delivery</p>
                  </div>
                  <span className="text-2xl font-black text-emerald-700">
                    ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('address')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Continue to Shipping Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Delivery Directly to You:</strong>
                  The partner places the order using their card directly with your delivery address on {meta.name}.
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (For Delivery OTP)</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Address Line</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="w-1/3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-2xl transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('escrow_payment')}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow transition text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Escrow Deposit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ESCROW PAYMENT VIA UPI */}
          {step === 'escrow_payment' && (
            <div className="space-y-4 text-center">
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" /> Protected CompareCart Escrow
                </div>
                <div className="text-3xl font-black text-white">
                  ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-400">
                  Your funds are safeguarded in an RBI-compliant nodal escrow account and only released to the cardholder after delivery verification.
                </p>

                {/* Simulated QR Code */}
                <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto">
                  <div className="w-36 h-36 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-800 border border-slate-300">
                    <QrCode className="w-24 h-24 text-slate-900" />
                    <span className="text-[10px] font-mono font-bold text-slate-600 mt-1">UPI: comparecart@nodal</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-xs text-slate-300 pt-1">
                  <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM UPI</span>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handlePayAndLockEscrow}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Escrow Deposit & Matching...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate UPI Escrow Payment Now</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">Order Locked in Escrow!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order ID: <strong className="text-slate-800">{createdOrder.orderNumber}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant Reference:</span>
                  <span className="font-mono font-bold text-slate-800">{createdOrder.merchantOrderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking AWB:</span>
                  <span className="font-mono font-bold text-blue-700">{createdOrder.awbTrackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <span className="font-bold text-emerald-700">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Partner Cardholder:</span>
                  <span className="font-bold text-slate-800">{createdOrder.partnerName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span>Total Amount Deposited:</span>
                  <span className="text-emerald-700">₹{createdOrder.effectivePricePaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition text-xs"
              >
                Track in Escrow Ledger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
