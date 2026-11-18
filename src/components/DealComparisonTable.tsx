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
    <div className="bg-white dark:bg-[#1B1D27] rounded-[28px] overflow-hidden shadow-soft dark:shadow-glow-dark border border-[#E8ECF4] dark:border-white/10 transition-colors duration-200">
      {/* Table Header */}
      <div className="p-5 sm:p-6 border-b border-[#E8ECF4] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-black/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#101936] dark:text-white tracking-tight">
              Verified Merchant &amp; Card Offer Matrix
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2864FF]/10 text-[#2864FF] dark:text-blue-400 border border-[#2864FF]/20">
              REAL-TIME MOP
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Effective Price = Scraped Price − Active Coupons − Instant Bank Discounts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Auto-Applied Coupons</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[#2864FF]/10 text-[#2864FF] dark:text-blue-400 border border-[#2864FF]/20 px-3 py-1 rounded-full font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2864FF]" />
            <span>Escrow Guaranteed</span>
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
        {deals
          .filter((deal) => {
            const listing = product.listings.find((l) => l.merchantId === deal.merchantId);
            return listing && !listing.priceUnavailable && listing.listedPrice > 0 && deal.listedPrice > 0;
          })
          .map((deal) => {
            const meta = MERCHANT_METADATA[deal.merchantId];
            const listing = product.listings.find((l) => l.merchantId === deal.merchantId);
            if (!listing) return null;

            return (
              <div
                key={deal.merchantId}
                className={`p-5 sm:p-6 transition-all duration-200 hover:bg-slate-50/60 dark:hover:bg-white/[0.02] ${
                  deal.isOverallBest ? 'bg-emerald-500/[0.04] dark:bg-emerald-950/20 relative' : ''
                }`}
              >
                {deal.isOverallBest && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-[#16A36A] shadow-[0_0_12px_#10b981]" />
                )}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* 1. Merchant & Seller Details (3 cols) */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.logoText}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-[#101936] dark:text-white text-sm">{meta.name}</h4>
                          {deal.isOverallBest && (
                            <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              BEST PRICE
                            </span>
                          )}
                          {listing?.dataSource === 'live_scrape' ? (
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 tracking-wider">
                              LIVE
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                              VERIFIED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" /> {listing?.rating}
                          </span>
                          <span className="text-slate-300 dark:text-zinc-600">•</span>
                          <span className="font-medium">
                            {listing?.deliveryDays === 1 ? 'Next-Day Delivery' : `${listing?.deliveryDays} Days`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">{listing?.sellerName}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Price & Deduction Breakdown (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-50 dark:bg-black/40 border border-[#E8ECF4] dark:border-white/10 rounded-2xl p-3.5 shadow-sm">
                    <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-200 dark:divide-white/[0.08]">
                      {/* Listed Price */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 tracking-wider block">
                          Listed Price
                        </span>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 line-through mt-0.5">₹{deal.mrp.toLocaleString('en-IN')}</p>
                        <p className="text-xs font-black text-[#101936] dark:text-zinc-100 mt-0.5">₹{deal.listedPrice.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Verified Coupon */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block">
                          Coupon
                        </span>
                        {deal.appliedCoupon ? (
                          <>
                            <span
                              title={deal.appliedCoupon.source ? `${deal.appliedCoupon.source} (${deal.appliedCoupon.successRate || 95}% success)` : 'Verified Coupon'}
                              className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-0.5 cursor-help"
                            >
                              {deal.appliedCoupon.code}
                            </span>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                              −₹{deal.couponDiscount.toLocaleString('en-IN')}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1 font-mono">—</p>
                        )}
                      </div>

                      {/* Card Discount */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#2864FF] dark:text-blue-400 tracking-wider block">
                          Bank Offer
                        </span>
                        {deal.bestBankOffer ? (
                          <>
                            <span className="text-[10px] font-bold text-[#2864FF] dark:text-blue-300 truncate block mt-0.5 max-w-[110px] mx-auto">
                              {deal.bestBankOffer.bank}
                            </span>
                            <p className="text-xs font-bold text-[#2864FF] dark:text-blue-400 mt-0.5">
                              −₹{deal.bankDiscount.toLocaleString('en-IN')}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1 font-mono">—</p>
                        )}
                      </div>
                    </div>

                    {deal.bestBankOffer && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px]">
                        <span className="truncate max-w-[200px] text-slate-600 dark:text-zinc-400 font-medium flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-[#2864FF] shrink-0" />
                          <span className="truncate">{deal.bestBankOffer.cardName}</span>
                        </span>
                        <span className="text-[#2864FF] dark:text-blue-400 font-bold shrink-0">{deal.bestBankOffer.terms}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Effective Price & CTAs (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col sm:flex-row items-start sm:items-center lg:justify-end gap-3 sm:gap-4">
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 block tracking-widest">
                        Effective Price
                      </span>
                      <div className="flex items-baseline gap-1.5 sm:justify-end mt-0.5">
                        <span className="text-2xl font-black text-[#101936] dark:text-white tracking-tight">
                          ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {deal.mrp > deal.partnerFinalEffectivePrice && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mt-1">
                          Save ₹{Math.max(0, deal.mrp - deal.partnerFinalEffectivePrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
                      {deal.bestBankOffer ? (
                        <>
                          {/* Option A: Buy Direct with Own Card */}
                          <button
                            onClick={() => onSelectDirect(deal)}
                            className="px-3 py-2 rounded-full border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition flex items-center justify-center gap-1 shrink-0"
                            title="Open store directly"
                          >
                            <span>I have card</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          {/* Option B: Partner Card Network Checkout */}
                          <button
                            onClick={() => onSelectPartnerCard(deal)}
                            className="px-4 py-2 rounded-full cc-gradient-btn text-white text-xs font-bold shadow-glow-blue hover:scale-105 transition flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span>Unlock Card</span>
                          </button>
                        </>
                      ) : (
                        /* Direct Retailer Link when no bank offer is available */
                        <button
                          onClick={() => onSelectDirect(deal)}
                          className="px-4 py-2 rounded-full cc-gradient-btn text-white text-xs font-bold shadow-glow-blue hover:scale-105 transition flex items-center justify-center gap-1.5"
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
