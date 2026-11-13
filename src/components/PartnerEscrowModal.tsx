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
  Check
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
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-zinc-200 shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b border-zinc-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-900 text-sm">Partner Card Discount Checkout</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Escrow Protected
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Peer-to-Peer Bank Offer Fulfillment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-100">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
            <span className={step === 'review' ? 'text-zinc-900 font-bold' : ''}>1. Split</span>
            <span>•</span>
            <span className={step === 'address' ? 'text-zinc-900 font-bold' : ''}>2. Address</span>
            <span>•</span>
            <span className={step === 'escrow_payment' ? 'text-zinc-900 font-bold' : ''}>3. UPI Deposit</span>
            <span>•</span>
            <span className={step === 'confirmed' ? 'text-zinc-900 font-bold' : ''}>4. Status</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: REVIEW & PARTNER MATCH */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Product Brief */}
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded-xl border border-zinc-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{product.title}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Order fulfilled on <strong>{meta.name}</strong> directly to your shipping address
                  </p>
                </div>
              </div>

              {/* Matched Verified Cardholder */}
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Matched Verified Cardholder
                  </span>
                  <span className="bg-white text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
                    Trust Rating: {matchedPartner.trustScore}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={matchedPartner.avatar}
                    alt={matchedPartner.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-zinc-900 text-xs">{matchedPartner.name}</p>
                      <span className="text-[10px] text-zinc-400">({matchedPartner.city})</span>
                    </div>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-blue-600" />
                      {matchedCard?.cardName} (..{matchedCard?.last4})
                    </p>
                    <span className="text-[10px] text-zinc-500 block">
                      {matchedPartner.totalOrdersFulfilled}+ verified fulfillments • KYC Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Financial Split */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Merchant Listed Price</span>
                  <span className="font-semibold text-zinc-800">₹{deal.listedPrice.toLocaleString('en-IN')}</span>
                </div>
                {deal.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Applied Merchant Coupon</span>
                    <span>−₹{deal.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-blue-700 font-medium">
                  <span>Partner Card Bank Offer ({deal.bestBankOffer?.bank})</span>
                  <span>−₹{deal.grossBankDiscount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-2 border-t border-dashed border-zinc-200 space-y-1 text-[11px]">
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>↳ Your Net Cash Savings (70%)</span>
                    <span>+₹{deal.buyerSavings.toLocaleString('en-IN')} Saved</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>↳ Cardholder Incentive (18%)</span>
                    <span>₹{deal.cardholderCommission.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>↳ CompareCart Escrow Fee (12%)</span>
                    <span>₹{deal.platformFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase text-zinc-700">Amount Payable in Escrow:</span>
                    <p className="text-[10px] text-zinc-400">Safeguarded until delivery verification</p>
                  </div>
                  <span className="text-xl font-black text-zinc-900">
                    ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('address')}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
              >
                <span>Continue to Delivery Address</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {step === 'address' && (
            <div className="space-y-4">
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3 text-xs text-zinc-700 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-zinc-900">Direct Delivery to Your Address:</strong>
                  The order is booked directly in your name on {meta.name} with original GST tax invoice.
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Mobile Number (For Delivery OTP)</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="w-1/3 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 py-3 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('escrow_payment')}
                  className="w-2/3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs flex items-center justify-center gap-1.5"
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
              <div className="bg-zinc-950 text-white p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-mono uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" /> RBI-Compliant Escrow Account
                </div>
                <div className="text-2xl font-black text-white">
                  ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                  Payment is locked in nodal escrow and released to the cardholder only after order delivery.
                </p>

                {/* QR Code */}
                <div className="bg-white p-3 rounded-xl inline-block shadow-inner mx-auto">
                  <div className="w-32 h-32 bg-zinc-50 rounded-lg flex flex-col items-center justify-center text-zinc-900 border border-zinc-200">
                    <QrCode className="w-20 h-20 text-zinc-900" />
                    <span className="text-[9px] font-mono font-semibold text-zinc-500 mt-0.5">UPI: comparecart@escrow</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-mono">
                  <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handlePayAndLockEscrow}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-400 text-white font-bold py-3.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Nodal Escrow Deposit...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulate UPI Escrow Payment</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 4: CONFIRMED */}
          {step === 'confirmed' && createdOrder && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-base font-black text-zinc-900">Order Locked in Escrow</h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  Order Ref: <strong className="text-zinc-800">{createdOrder.orderNumber}</strong>
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Merchant Reference:</span>
                  <span className="font-bold text-zinc-800">{createdOrder.merchantOrderRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Courier Tracking:</span>
                  <span className="font-bold text-blue-700">{createdOrder.awbTrackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Estimated Delivery:</span>
                  <span className="font-bold text-zinc-800">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Partner Cardholder:</span>
                  <span className="font-bold text-zinc-800">{createdOrder.partnerName}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 font-bold font-sans">
                  <span>Amount in Escrow:</span>
                  <span className="text-emerald-700">₹{createdOrder.effectivePricePaid.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl transition text-xs"
              >
                View in Escrow Ledger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
