'use client';

import React from 'react';
import {
  ChevronLeft,
  Heart,
  Star,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Product, OptimizedDeal } from '../../types';
import { DealComparisonTable } from '../DealComparisonTable';
import { PriceHistoryChart } from '../PriceHistoryChart';

interface UserCompareTabProps {
  isLiveScraping: boolean;
  activeScrapeTarget: string;
  searchQuery: string;
  onNavigateHome: () => void;
  selectedProduct: Product;
  toggleLovedProduct: (id: string) => void;
  isSaved: boolean;
  compareSubTab: 'compare' | 'history' | 'details';
  setCompareSubTab: (tab: 'compare' | 'history' | 'details') => void;
  bestDeal: OptimizedDeal | null;
  optimizedDeals: OptimizedDeal[];
  onSelectPartnerCard: (deal: OptimizedDeal) => void;
  onSelectDirect: (deal: OptimizedDeal) => void;
  getDealSavings: (deal?: OptimizedDeal | null) => number;
  getDealPrice: (deal?: OptimizedDeal | null) => number;
}

export const UserCompareTab: React.FC<UserCompareTabProps> = ({
  isLiveScraping,
  activeScrapeTarget,
  searchQuery,
  onNavigateHome,
  selectedProduct,
  toggleLovedProduct,
  isSaved,
  compareSubTab,
  setCompareSubTab,
  bestDeal,
  optimizedDeals,
  onSelectPartnerCard,
  onSelectDirect,
  getDealSavings,
  getDealPrice,
}) => {
  if (isLiveScraping) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fadeIn">
        {/* Top Bar: Back to Home */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#2864FF] font-semibold animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Crawling 5 Stores Live...</span>
          </div>
        </div>

        {/* Crawling Radar Card */}
        <div className="rounded-[32px] bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-7 sm:p-10 shadow-soft text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-[#2864FF]/10 text-[#2864FF] flex items-center justify-center relative">
            <span className="absolute inset-0 rounded-3xl bg-[#2864FF]/20 animate-ping" />
            <RefreshCw className="w-8 h-8 animate-spin relative z-10" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2864FF]/10 text-[#2864FF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Multi-Store Scraper Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101936] dark:text-white tracking-tight">
              Searching 5 Major Stores for &ldquo;{activeScrapeTarget || searchQuery || 'Product'}&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              Live crawling Flipkart, Amazon, Croma, Reliance Digital &amp; Vijay Sales to fetch the lowest price...
            </p>
          </div>

          {/* 5 Store Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto pt-2">
            {[
              { name: 'Flipkart', color: '#2874F0', tag: 'Checking F-Assured Deals' },
              { name: 'Amazon', color: '#FF9900', tag: 'Scanning Prime Listings' },
              { name: 'Croma', color: '#00B5B5', tag: 'Tata Neu Instant Offers' },
              { name: 'Reliance Digital', color: '#E42529', tag: 'Checking Store Stocks' },
              { name: 'Vijay Sales', color: '#D11242', tag: 'Syncing Retail Discounts' },
            ].map((store) => (
              <div
                key={store.name}
                className="p-3.5 rounded-2xl bg-[#F8F9FC] dark:bg-[#252837]/60 border border-[#E8ECF4] dark:border-white/5 text-left space-y-1.5 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: store.color }}
                  />
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Crawling
                  </span>
                </div>
                <p className="text-xs font-bold text-[#101936] dark:text-white truncate">{store.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{store.tag}</p>
              </div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="max-w-md mx-auto pt-3 text-left space-y-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Query dispatched to real-time ingestion coordinator</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#2864FF] animate-spin shrink-0" />
              <span>Matching GrabOn verified promo codes &amp; bank cashback</span>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20 shrink-0" />
              <span>Optimizing peer-to-peer cardholder savings</span>
            </div>
          </div>
        </div>

        {/* Shimmer Skeleton Comparison Matrix */}
        <div className="rounded-[32px] bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="h-4 w-48 rounded-lg bg-slate-200 dark:bg-white/10 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Bar: Back Button & Wishlist Heart */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => toggleLovedProduct(selectedProduct.id)}
          className={`p-2.5 rounded-full border transition ${
            isSaved
              ? 'bg-red-500 text-white border-red-500 shadow-md'
              : 'bg-white dark:bg-[#1B1D27] text-slate-600 dark:text-slate-300 border-[#E8ECF4] dark:border-white/10 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Presentation Header */}
      <div className="rounded-[32px] bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-56 h-52 rounded-2xl bg-slate-50 dark:bg-black/30 flex items-center justify-center p-4 shrink-0">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="max-h-44 object-contain drop-shadow-md"
          />
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2864FF]/10 text-[#2864FF] dark:text-blue-400">
            <span>{selectedProduct.brand}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {selectedProduct.title}
          </h2>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>4.7</span>
            </div>
            <span>•</span>
            <span>12.4K reviews</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">In Stock across 5 stores</span>
          </div>
        </div>
      </div>

      {/* 3-Tab Segment Capsule: Compare | Price History | Details */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 shadow-sm text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCompareSubTab('compare')}
            className={`px-5 py-2 rounded-full transition-all ${
              compareSubTab === 'compare'
                ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => setCompareSubTab('history')}
            className={`px-5 py-2 rounded-full transition-all ${
              compareSubTab === 'history'
                ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Price History
          </button>
          <button
            type="button"
            onClick={() => setCompareSubTab('details')}
            className={`px-5 py-2 rounded-full transition-all ${
              compareSubTab === 'details'
                ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {/* TAB CONTENT: COMPARE */}
      {compareSubTab === 'compare' && (
        <div className="space-y-4">
          {/* Best Price Green Callout Banner */}
          {bestDeal && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between shadow-soft">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
                  Best Price
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  ₹{getDealPrice(bestDeal).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                {bestDeal.listedPrice > 0 ? Math.max(0, Math.round((getDealSavings(bestDeal) / bestDeal.listedPrice) * 100)) : 0}% off
              </div>
            </div>
          )}

          {/* Verified Merchant & Card Offer Matrix */}
          <DealComparisonTable
            product={selectedProduct}
            deals={optimizedDeals}
            onSelectPartnerCard={onSelectPartnerCard}
            onSelectDirect={onSelectDirect}
          />
        </div>
      )}

      {/* TAB CONTENT: PRICE HISTORY */}
      {compareSubTab === 'history' && (
        <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold tracking-tight">30-Day Cross-Store Price Trajectory</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Lowest Recorded: ₹{(getDealPrice(bestDeal) || 74999).toLocaleString('en-IN')}</span>
          </div>
          <PriceHistoryChart product={selectedProduct} />
        </div>
      )}

      {/* TAB CONTENT: DETAILS */}
      {compareSubTab === 'details' && (
        <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft space-y-4 text-sm">
          <h3 className="text-base font-bold tracking-tight">Product Specifications &amp; Escrow Policy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Brand</span>
              <p className="font-semibold text-sm mt-0.5">{selectedProduct.brand}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Category</span>
              <p className="font-semibold text-sm mt-0.5 uppercase">{selectedProduct.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Warranty</span>
              <p className="font-semibold text-sm mt-0.5">1 Year Official Brand Warranty</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Escrow Security</span>
              <p className="font-semibold text-sm mt-0.5 text-emerald-600 dark:text-emerald-400">100% RBI Compliant Nodal Account</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action CTA Button */}
      {bestDeal && (
        <div className="sticky bottom-20 sm:bottom-6 inset-x-0 z-30 pt-2 pb-4">
          <button
            type="button"
            onClick={() => onSelectPartnerCard(bestDeal)}
            className="w-full py-4 rounded-full cc-gradient-btn text-white font-bold text-base shadow-glow-blue flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Shop Now &amp; Save ₹{getDealSavings(bestDeal).toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
