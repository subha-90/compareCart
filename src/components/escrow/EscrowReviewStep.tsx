'use client';

import React from 'react';
import { Product, OptimizedDeal, PartnerCardholder } from '../../types';
import { UserCheck, CreditCard, ArrowRight } from 'lucide-react';
import { MERCHANT_METADATA } from '../../lib/deal-engine';

interface EscrowReviewStepProps {
  product: Product;
  deal: OptimizedDeal;
  matchedPartner: PartnerCardholder;
  onContinue: () => void;
}

export const EscrowReviewStep: React.FC<EscrowReviewStepProps> = ({
  product,
  deal,
  matchedPartner,
  onContinue,
}) => {
  const meta = MERCHANT_METADATA[deal.merchantId];
  const matchedCard = matchedPartner?.cardsHeld[0];

  return (
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
        onClick={onContinue}
        className="cc-gradient-btn w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-white shadow-glow-blue"
      >
        <span>Continue to Delivery Address</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
