'use client';

import React from 'react';
import { OptimizedDeal, Product } from '../types';
import { Tag, CreditCard, ExternalLink, ShieldCheck, Check, Sparkles, Truck, Star, ArrowUpRight } from 'lucide-react';
import { MERCHANT_METADATA } from '../lib/deal-engine';

interface DealComparisonTableProps {
  product: Product;
  deals: OptimizedDeal[];
  onSelectPartnerCard: (deal: OptimizedDeal) => void;
  onSelectDirect: (deal: OptimizedDeal) => void;
}

export const DealComparisonTable: React.FC<DealComparisonTableProps> = ({
  product,
  deals,
  onSelectPartnerCard,
  onSelectDirect,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs">
      {/* Table Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50/50">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Verified Merchant & Card Offer Matrix</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Effective Price = Listed Price − Active Coupons − Instant Bank Discounts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200/60 font-semibold">
            <Check className="w-3 h-3 text-emerald-600" /> Auto-applied coupons
          </span>
          <span className="flex items-center gap-1 bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md border border-zinc-200 font-semibold">
            <ShieldCheck className="w-3 h-3 text-zinc-500" /> Escrow Protected
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-100">
        {deals.map((deal) => {
          const meta = MERCHANT_METADATA[deal.merchantId];
          const listing = product.listings.find(l => l.merchantId === deal.merchantId);

          return (
            <div
              key={deal.merchantId}
              className={`p-5 transition hover:bg-zinc-50/60 ${
                deal.isOverallBest ? 'bg-emerald-50/20' : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* 1. Merchant & Seller Details (3 cols) */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs shrink-0"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.logoText}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-zinc-900 text-sm">{meta.name}</h4>
                        {deal.isOverallBest && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            BEST PRICE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" /> {listing?.rating}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-600 font-medium">
                          {listing?.deliveryDays === 1 ? 'Next-Day Delivery' : `${listing?.deliveryDays} Days`}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{listing?.sellerName}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Price & Deduction Breakdown (5 cols) */}
                <div className="lg:col-span-5 bg-zinc-50/60 border border-zinc-200/80 rounded-xl p-3">
                  <div className="grid grid-cols-3 gap-2 text-center divide-x divide-zinc-200/60">
                    {/* Listed Price */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Listed Price</span>
                      <p className="text-xs text-zinc-400 line-through">₹{deal.mrp.toLocaleString('en-IN')}</p>
                      <p className="text-xs font-bold text-zinc-800">₹{deal.listedPrice.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Verified Coupon */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-emerald-700 block">Coupon</span>
                      {deal.appliedCoupon ? (
                        <>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            {deal.appliedCoupon.code}
                          </span>
                          <p className="text-xs font-bold text-emerald-600 mt-0.5">−₹{deal.couponDiscount.toLocaleString('en-IN')}</p>
                        </>
                      ) : (
                        <p className="text-xs text-zinc-400 mt-1 italic">—</p>
                      )}
                    </div>

                    {/* Card Discount */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-blue-700 block">Bank Offer</span>
                      {deal.bestBankOffer ? (
                        <>
                          <span className="text-[10px] font-semibold text-blue-800 truncate block mt-0.5">
                            {deal.bestBankOffer.bank}
                          </span>
                          <p className="text-xs font-bold text-blue-600 mt-0.5">−₹{deal.bankDiscount.toLocaleString('en-IN')}</p>
                        </>
                      ) : (
                        <p className="text-xs text-zinc-400 mt-1 italic">—</p>
                      )}
                    </div>
                  </div>

                  {deal.bestBankOffer && (
                    <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] text-zinc-600">
                      <span className="truncate max-w-[200px] text-zinc-700 font-medium">💳 {deal.bestBankOffer.cardName}</span>
                      <span className="text-blue-700 font-semibold">{deal.bestBankOffer.terms}</span>
                    </div>
                  )}
                </div>

                {/* 3. Effective Price & CTAs (4 cols) */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-end items-end gap-2.5">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block tracking-wider">
                      Effective Price
                    </span>
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="text-xl font-black text-zinc-900">
                        ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Save ₹{(deal.mrp - deal.partnerFinalEffectivePrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Option A: Buy Direct with Own Card */}
                    <button
                      onClick={() => onSelectDirect(deal)}
                      className="flex-1 sm:flex-none text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-100 px-3 py-2 rounded-xl border border-zinc-200 transition flex items-center justify-center gap-1.5 shadow-2xs"
                      title="Use your own card directly on retailer website"
                    >
                      <span>I have this card</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>

                    {/* Option B: Partner Card Network Checkout */}
                    {deal.partnerCardEligible ? (
                      <button
                        onClick={() => onSelectPartnerCard(deal)}
                        className="flex-1 sm:flex-none text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Unlock Partner Card</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectDirect(deal)}
                        className="flex-1 sm:flex-none text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-3.5 py-2 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <span>Buy on {meta.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
