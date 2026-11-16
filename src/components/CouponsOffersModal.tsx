'use client';

import React, { useState } from 'react';
import { X, Tag, Copy, Check, Sparkles, Clock, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Coupon } from '../types';

interface CouponsOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURED_COUPONS: (Coupon & { store: string; storeColor: string })[] = [
  {
    id: 'c-fk-1',
    code: 'TECHSAVE2000',
    title: 'Flat ₹2,000 Off on Flagship Electronics',
    description: 'Valid on cart value above ₹40,000 across smartphones and laptops.',
    discountType: 'flat',
    discountValue: 2000,
    minOrderValue: 40000,
    verified: true,
    expiresInDays: 4,
    store: 'Flipkart',
    storeColor: '#2874F0',
  },
  {
    id: 'c-amz-1',
    code: 'AMZPRIME15',
    title: '15% Instant Cashback for Prime Shoppers',
    description: 'Max savings ₹3,500 on premium gadgets and accessories.',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 3500,
    minOrderValue: 10000,
    verified: true,
    expiresInDays: 2,
    store: 'Amazon',
    storeColor: '#FF9900',
  },
  {
    id: 'c-croma-1',
    code: 'CROMAPREMIUM',
    title: 'Flat ₹1,800 Off on Apple & Sony Products',
    description: 'Exclusive authorized retailer voucher for soundbars and phones.',
    discountType: 'flat',
    discountValue: 1800,
    minOrderValue: 25000,
    verified: true,
    expiresInDays: 6,
    store: 'Croma',
    storeColor: '#00B5B5',
  },
  {
    id: 'c-rd-1',
    code: 'DIGITALFEST10',
    title: '10% Extra Savings on Reliance Digital',
    description: 'Applicable with partner card facilitation or UPI escrow checkout.',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 2500,
    minOrderValue: 15000,
    verified: true,
    expiresInDays: 5,
    store: 'Reliance Digital',
    storeColor: '#E42529',
  },
  {
    id: 'c-vs-1',
    code: 'VIJAYMEGA3000',
    title: 'Flat ₹3,000 Mega Discount on Appliances',
    description: 'Available in-store and online across pan-India stores.',
    discountType: 'flat',
    discountValue: 3000,
    minOrderValue: 50000,
    verified: true,
    expiresInDays: 8,
    store: 'Vijay Sales',
    storeColor: '#D11242',
  },
];

export const CouponsOffersModal: React.FC<CouponsOffersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>('all');

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = selectedStore === 'all'
    ? FEATURED_COUPONS
    : FEATURED_COUPONS.filter(c => c.store.toLowerCase().includes(selectedStore.toLowerCase()));

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
            <div className="w-10 h-10 rounded-2xl bg-[#7047F5]/10 text-[#7047F5] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Verified Coupons & Offers</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Stack with partner card discounts for maximum savings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store Filter Pills */}
        <div className="px-6 py-3 bg-[#F8F9FC] dark:bg-[#101116] border-b border-[#E8ECF4] dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Flipkart', 'Amazon', 'Croma', 'Reliance Digital', 'Vijay Sales'].map(store => (
            <button
              key={store}
              onClick={() => setSelectedStore(store)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedStore === store
                  ? 'bg-[#2864FF] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1B1D27] text-zinc-600 dark:text-zinc-300 border border-[#E8ECF4] dark:border-white/10 hover:border-[#2864FF]/40'
              }`}
            >
              {store === 'all' ? 'All Stores' : store}
            </button>
          ))}
        </div>

        {/* Coupon Cards List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3.5">
          {filteredCoupons.map(coupon => (
            <div
              key={coupon.id}
              className="p-4 rounded-2xl border border-[#E8ECF4] dark:border-white/[0.08] bg-[#F8F9FC]/60 dark:bg-[#252837]/60 hover:border-[#7047F5]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: coupon.storeColor }}
                  >
                    {coupon.store}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> Verified Working
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#101936] dark:text-white leading-tight">
                  {coupon.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                  {coupon.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 font-mono">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>Expires in {coupon.expiresInDays} days</span>
                </div>
              </div>

              {/* Code pill & copy button */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <div className="px-3 py-1.5 rounded-xl border border-dashed border-[#7047F5]/50 bg-[#7047F5]/5 text-[#7047F5] dark:text-[#2864FF] font-mono text-xs font-bold tracking-wider">
                  {coupon.code}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2864FF] hover:bg-[#2052d9] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
