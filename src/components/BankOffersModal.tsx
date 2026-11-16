'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Sparkles, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BankOffer } from '../types';

interface BankOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkCardClick?: () => void;
}

const FEATURED_BANK_OFFERS: (BankOffer & { logoColor: string; popularCards: string })[] = [
  {
    id: 'bo-hdfc-1',
    bank: 'HDFC',
    cardName: 'HDFC Bank Credit Cards',
    cardTier: 'Super Premium & Premium',
    cardType: 'credit',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 5000,
    minOrderValue: 30000,
    terms: '10% Instant Discount up to ₹5,000 on Apple and flagship laptops. Applicable on both Full Swipe & 6-month No Cost EMI.',
    logoColor: '#004c8f',
    popularCards: 'Infinia, Diners Black, Regalia Gold, Millennia',
  },
  {
    id: 'bo-icici-1',
    bank: 'ICICI',
    cardName: 'ICICI Bank Credit Cards',
    cardTier: 'All Credit Variants',
    cardType: 'credit',
    discountType: 'flat',
    discountValue: 4000,
    maxDiscount: 4000,
    minOrderValue: 35000,
    terms: 'Flat ₹4,000 Instant Discount on Samsung Galaxy & Sony audio equipment with minimum transaction of ₹35,000.',
    logoColor: '#f58220',
    popularCards: 'Emeralde, Sapphiro, Rubyx, Amazon Pay ICICI',
  },
  {
    id: 'bo-axis-1',
    bank: 'AXIS',
    cardName: 'Axis Bank Credit Cards',
    cardTier: 'Select & Premium',
    cardType: 'credit',
    discountType: 'percentage',
    discountValue: 12,
    maxDiscount: 4500,
    minOrderValue: 25000,
    terms: '12% Instant Savings on Flipkart & Croma electronics orders. Plus 5X Edge Reward Points.',
    logoColor: '#97144d',
    popularCards: 'Magnus, Atlas, Flipkart Axis, Select',
  },
  {
    id: 'bo-sbi-1',
    bank: 'SBI',
    cardName: 'SBI Credit Card',
    cardTier: 'Elite & Prime',
    cardType: 'credit',
    discountType: 'flat',
    discountValue: 3000,
    maxDiscount: 3000,
    minOrderValue: 20000,
    terms: 'Flat ₹3,000 off across Amazon and Reliance Digital. Valid on all domestic retail variants.',
    logoColor: '#00a3e0',
    popularCards: 'SBI Card ELITE, PRIME, Cashback SBI Card',
  },
  {
    id: 'bo-amex-1',
    bank: 'AMEX',
    cardName: 'American Express Cards',
    cardTier: 'Platinum & Gold',
    cardType: 'credit',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 7500,
    minOrderValue: 45000,
    terms: '15% instant reduction on luxury electronics & cameras with verified merchant escrow protection.',
    logoColor: '#006fcf',
    popularCards: 'Amex Platinum, Platinum Travel, Gold Card',
  },
];

export const BankOffersModal: React.FC<BankOffersModalProps> = ({
  isOpen,
  onClose,
  onLinkCardClick,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('all');

  if (!isOpen) return null;

  const filteredOffers = selectedBank === 'all'
    ? FEATURED_BANK_OFFERS
    : FEATURED_BANK_OFFERS.filter(b => b.bank.toLowerCase() === selectedBank.toLowerCase());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden my-6 text-[#101936] dark:text-[#F8FAFC]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-[#E8ECF4] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2864FF]/10 text-[#2864FF] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Active Bank & Card Offers</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Unlock instant discounts using your card or our verified partner network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Partner Callout Banner */}
        <div className="p-4 mx-6 mt-4 rounded-2xl bg-gradient-to-r from-[#2864FF]/10 via-[#7047F5]/10 to-transparent border border-[#2864FF]/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#7047F5] shrink-0" />
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              Don’t hold these cards? Our <strong>Verified Card Partner Pool</strong> automatically applies the discount for you.
            </p>
          </div>
        </div>

        {/* Bank Filter Tabs */}
        <div className="px-6 py-3 border-b border-[#E8ECF4] dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'HDFC', 'ICICI', 'AXIS', 'SBI', 'AMEX'].map(bank => (
            <button
              key={bank}
              onClick={() => setSelectedBank(bank)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedBank === bank
                  ? 'bg-[#2864FF] text-white shadow-sm'
                  : 'bg-[#F8F9FC] dark:bg-[#252837] text-zinc-600 dark:text-zinc-300 border border-[#E8ECF4] dark:border-white/10 hover:border-[#2864FF]/40'
              }`}
            >
              {bank === 'all' ? 'All Banks' : bank}
            </button>
          ))}
        </div>

        {/* Bank Offers List */}
        <div className="p-6 max-h-[58vh] overflow-y-auto space-y-4">
          {filteredOffers.map(offer => (
            <div
              key={offer.id}
              className="p-4 rounded-2xl border border-[#E8ECF4] dark:border-white/[0.08] bg-[#F8F9FC]/60 dark:bg-[#252837]/60 hover:border-[#2864FF]/40 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg text-white font-black text-[10px] flex items-center justify-center tracking-tighter"
                    style={{ backgroundColor: offer.logoColor }}
                  >
                    {offer.bank}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#101936] dark:text-white leading-tight">
                      {offer.cardName}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Eligible: {offer.popularCards}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `FLAT ₹${offer.discountValue.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-[#E8ECF4] dark:border-white/5">
                {offer.terms}
              </p>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 pt-1">
                <span>Min Order: ₹{offer.minOrderValue.toLocaleString('en-IN')}</span>
                <span>Max Discount: ₹{offer.maxDiscount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
