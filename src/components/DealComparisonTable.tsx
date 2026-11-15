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
    <div className="bg-[#161617]/90 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/[0.08]">
      {/* Table Header */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Verified Merchant & Card Offer Matrix
            </h3>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-white">
              REAL-TIME MOP
            </span>
          </div>
          <p className="text-xs text-[#86868b] mt-1">
            Effective Price = Scraped Price − Active Coupons − Instant Bank Discounts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-[#30d158]/10 text-[#30d158] border border-[#30d158]/20 px-3 py-1 rounded-full font-medium">
            <Check className="w-3 h-3 text-[#30d158]" />
            <span>Auto-Applied Coupons</span>
          </span>
          <span className="flex items-center gap-1.5 bg-white/[0.06] text-white border border-white/10 px-3 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
            <span>Escrow Guaranteed</span>
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.06]">
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
                className={`p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.02] ${
                  deal.isOverallBest ? 'bg-emerald-950/15 relative' : ''
                }`}
              >
                {deal.isOverallBest && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_12px_#10b981]" />
                )}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* 1. Merchant & Seller Details (3 cols) */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md border border-white/10 shrink-0"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.logoText}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-white text-sm">{meta.name}</h4>
                          {deal.isOverallBest && (
                            <span className="gold-foil-badge text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              BEST PRICE
                            </span>
                          )}
                          {listing?.dataSource === 'live_scrape' ? (
                            <span className="emerald-foil-badge text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wider">
                              LIVE
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-blue-300 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-500/30">
                              VERIFIED
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" /> {listing?.rating}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-400 font-medium">
                            {listing?.deliveryDays === 1 ? 'Next-Day Delivery' : `${listing?.deliveryDays} Days`}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">{listing?.sellerName}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Price & Deduction Breakdown (5 cols) */}
                  <div className="lg:col-span-5 bg-zinc-950/60 border border-white/[0.08] rounded-2xl p-3.5 shadow-inner">
                    <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/[0.08]">
                      {/* Listed Price */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                          Listed Price
                        </span>
                        <p className="text-xs text-zinc-500 line-through mt-0.5">₹{deal.mrp.toLocaleString('en-IN')}</p>
                        <p className="text-xs font-extrabold text-zinc-200 mt-0.5">₹{deal.listedPrice.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Verified Coupon */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                          Coupon
                        </span>
                        {deal.appliedCoupon ? (
                          <>
                            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 inline-block mt-0.5">
                              {deal.appliedCoupon.code}
                            </span>
                            <p className="text-xs font-bold text-emerald-400 mt-0.5">
                              −₹{deal.couponDiscount.toLocaleString('en-IN')}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-zinc-600 mt-1 font-mono">—</p>
                        )}
                      </div>

                      {/* Card Discount */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                          Bank Offer
                        </span>
                        {deal.bestBankOffer ? (
                          <>
                            <span className="text-[10px] font-semibold text-blue-300 truncate block mt-0.5 max-w-[110px] mx-auto">
                              {deal.bestBankOffer.bank}
                            </span>
                            <p className="text-xs font-bold text-blue-400 mt-0.5">
                              −₹{deal.bankDiscount.toLocaleString('en-IN')}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-zinc-600 mt-1 font-mono">—</p>
                        )}
                      </div>
                    </div>

                    {deal.bestBankOffer && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                        <span className="truncate max-w-[200px] text-zinc-400 font-medium flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                          <span>{deal.bestBankOffer.cardName}</span>
                        </span>
                        <span className="text-blue-400 font-semibold">{deal.bestBankOffer.terms}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Effective Price & CTAs (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col sm:flex-row items-start sm:items-center lg:justify-end gap-4">
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-widest">
                        Effective Price
                      </span>
                      <div className="flex items-baseline gap-1.5 sm:justify-end mt-0.5">
                        <span className="text-2xl font-black text-white tracking-tight">
                          ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {deal.mrp > deal.partnerFinalEffectivePrice && (
                        <span className="text-[10px] font-bold text-emerald-300 emerald-foil-badge px-2 py-0.5 rounded-full inline-block mt-1">
                          Save ₹{Math.max(0, deal.mrp - deal.partnerFinalEffectivePrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      {deal.bestBankOffer ? (
                        <>
                          {/* Option A: Buy Direct with Own Card */}
                          <button
                            onClick={() => onSelectDirect(deal)}
                            className="apple-pill-btn-secondary tactile-pill text-xs px-3.5 py-2 flex items-center justify-center gap-1.5 whitespace-nowrap"
                            title="Use your own card directly on retailer website"
                          >
                            <span>I have card</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#86868b]" />
                          </button>

                          {/* Option B: Partner Card Network Checkout */}
                          <button
                            onClick={() => onSelectPartnerCard(deal)}
                            className="apple-pill-btn tactile-pill text-xs px-4 py-2 flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span>Unlock Card</span>
                          </button>
                        </>
                      ) : (
                        /* Direct Retailer Link when no bank offer is available */
                        <button
                          onClick={() => onSelectDirect(deal)}
                          className="apple-pill-btn-secondary tactile-pill text-xs px-4 py-2 flex items-center justify-center gap-1.5 whitespace-nowrap"
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
