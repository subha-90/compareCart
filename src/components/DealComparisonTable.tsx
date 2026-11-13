'use client';

import React from 'react';
import { OptimizedDeal, Product } from '../types';
import { Tag, CreditCard, ExternalLink, ShieldCheck, Check, Sparkles, Truck, Star } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Universal Matrix
            </span>
            <h3 className="text-base font-bold text-slate-900">Live Merchant & Payment Comparison</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by Effective Purchase Price = Sticker Price − Coupons − Bank Discount
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">
            <Check className="w-3.5 h-3.5" /> Auto-applied coupons
          </span>
          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" /> Partner Escrow Protected
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {deals.map((deal) => {
          const meta = MERCHANT_METADATA[deal.merchantId];
          const listing = product.listings.find(l => l.merchantId === deal.merchantId);

          return (
            <div
              key={deal.merchantId}
              className={`p-5 transition hover:bg-slate-50/70 ${
                deal.isOverallBest ? 'bg-emerald-50/30 ring-1 ring-inset ring-emerald-500/20' : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Col 1: Merchant & Listing Details (3 cols) */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-sm"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{meta.name}</h4>
                        {deal.isOverallBest && (
                          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse-subtle">
                            <Sparkles className="w-2.5 h-2.5" /> #1 BEST VALUE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" /> {listing?.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-slate-600">
                          <Truck className="w-3 h-3 text-slate-400" /> {listing?.deliveryDays === 1 ? 'Next Day' : `${listing?.deliveryDays} Days`}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-400">{listing?.sellerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Price Calculation Breakdown (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
                  <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
                    {/* Listed Price */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Listed Price</span>
                      <p className="text-xs font-bold text-slate-700 line-through">₹{deal.mrp.toLocaleString('en-IN')}</p>
                      <p className="text-sm font-bold text-slate-900">₹{deal.listedPrice.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Applied Coupon */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-emerald-600 flex items-center justify-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" /> Coupon
                      </span>
                      {deal.appliedCoupon ? (
                        <>
                          <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded inline-block mt-0.5">
                            {deal.appliedCoupon.code}
                          </p>
                          <p className="text-xs font-bold text-emerald-600">−₹{deal.couponDiscount.toLocaleString('en-IN')}</p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-1">None active</p>
                      )}
                    </div>

                    {/* Bank / Card Offer */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-blue-600 flex items-center justify-center gap-0.5">
                        <CreditCard className="w-2.5 h-2.5" /> Card Offer
                      </span>
                      {deal.bestBankOffer ? (
                        <>
                          <p className="text-[10px] text-blue-700 truncate font-semibold" title={deal.bestBankOffer.cardName}>
                            {deal.bestBankOffer.bank}
                          </p>
                          <p className="text-xs font-bold text-blue-600">−₹{deal.bankDiscount.toLocaleString('en-IN')}</p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-1">No instant offer</p>
                      )}
                    </div>
                  </div>

                  {deal.bestBankOffer && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="truncate max-w-[220px]">💳 {deal.bestBankOffer.cardName}</span>
                      <span className="text-blue-700 font-medium">{deal.bestBankOffer.terms}</span>
                    </div>
                  )}
                </div>

                {/* Col 3: Final Effective Price & Action CTAs (4 cols) */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-end items-end gap-2.5">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Effective Price
                    </span>
                    <div className="flex items-baseline gap-1.5 justify-end">
                      <span className="text-xl font-black text-emerald-700">
                        ₹{deal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Total Savings: ₹{(deal.mrp - deal.partnerFinalEffectivePrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Option A: Buy Direct with Own Card */}
                    <button
                      onClick={() => onSelectDirect(deal)}
                      className="flex-1 sm:flex-none text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5"
                      title="Use your own credit/debit card on merchant site"
                    >
                      <span>I have this card</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </button>

                    {/* Option B: Partner Card Network Checkout */}
                    {deal.partnerCardEligible ? (
                      <button
                        onClick={() => onSelectPartnerCard(deal)}
                        className="flex-1 sm:flex-none text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Unlock with Partner Card</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectDirect(deal)}
                        className="flex-1 sm:flex-none text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl shadow transition flex items-center justify-center gap-1.5"
                      >
                        <span>Buy on {meta.name}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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
