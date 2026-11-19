'use client';

import React from 'react';
import {
  Search,
  Scan,
  Heart,
  Tag,
  Ticket,
  CreditCard,
  Wallet,
  ArrowRight,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { Product, OptimizedDeal } from '../../types';
import { NavTab } from '../BottomNavBar';

interface UserHomeTabProps {
  selectedProduct: Product;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLiveScraping: boolean;
  executeSearchOrScrape: (override?: string) => void;
  setUrlInput: (u: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenCoupons: () => void;
  onOpenBankOffers: () => void;
  onOpenMyCards: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: { id: string; label: string }[];
  filteredProducts: Product[];
  optimizeProductDeals: (p: Product) => OptimizedDeal[];
  lovedProductIds: string[];
  toggleLovedProduct: (id: string) => void;
  onSelectProduct: (id: string) => void;
  getDealSavings: (deal?: OptimizedDeal | null) => number;
  getDealPrice: (deal?: OptimizedDeal | null) => number;
}

export const UserHomeTab: React.FC<UserHomeTabProps> = ({
  selectedProduct,
  searchQuery,
  setSearchQuery,
  isLiveScraping,
  executeSearchOrScrape,
  setUrlInput,
  onNavigateTab,
  onOpenCoupons,
  onOpenBankOffers,
  onOpenMyCards,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredProducts,
  optimizeProductDeals,
  lovedProductIds,
  toggleLovedProduct,
  onSelectProduct,
  getDealSavings,
  getDealPrice,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero Card with Apple/Klarna Presentation */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-100 via-white to-slate-200/80 dark:from-[#1B1D27] dark:via-[#161821] dark:to-[#101116] border border-[#E8ECF4] dark:border-white/10 p-6 sm:p-10 shadow-soft dark:shadow-glow-dark">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2864FF]/10 dark:bg-[#2864FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#7047F5]/10 dark:bg-[#7047F5]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2864FF]/10 text-[#2864FF] dark:text-blue-400 border border-[#2864FF]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Multi-Store Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Find the{' '}
              <span className="cc-gradient-text">best deal</span>
              <br />
              across top stores
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Compare prices, apply coupons, use bank offers and save more across Flipkart, Amazon, Croma, Reliance Digital &amp; Vijay Sales.
            </p>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2864FF]/20 to-[#7047F5]/20 rounded-full blur-2xl" />
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="relative z-10 max-h-48 sm:max-h-52 object-contain drop-shadow-[0_20px_30px_rgba(40,100,255,0.3)] transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Pill Search Bar with Enter-to-Scrape & Scan Action */}
        <div className="mt-8 relative max-w-2xl">
          <div className="relative flex items-center bg-white dark:bg-[#252837] rounded-full border border-slate-300 dark:border-white/10 shadow-lg px-4 py-2 sm:py-2.5 transition-all focus-within:border-[#2864FF] focus-within:ring-2 focus-within:ring-[#2864FF]/20">
            <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  executeSearchOrScrape();
                }
              }}
              placeholder="Search for iPhone 17, brand, or paste product link"
              className="w-full bg-transparent text-sm sm:text-base text-[#101936] dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const target = prompt('Paste product link from Flipkart, Amazon, Croma, Reliance or Vijay Sales:');
                if (target) {
                  setUrlInput(target);
                  executeSearchOrScrape(target);
                }
              }}
              title="Paste Product Link"
              className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition shrink-0 ml-1"
            >
              <Scan className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeSearchOrScrape()}
              disabled={isLiveScraping || !searchQuery.trim()}
              className="px-4 py-1.5 rounded-full cc-gradient-btn text-white text-xs font-semibold shadow-glow-blue disabled:opacity-50 flex items-center gap-1.5 shrink-0 ml-1.5 hover:scale-105 transition"
            >
              {isLiveScraping ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Scraping...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>

          {isLiveScraping && (
            <div className="absolute -bottom-6 left-4 flex items-center gap-1.5 text-[11px] text-[#2864FF] font-medium animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Scraping live prices across Flipkart, Amazon, Croma, Reliance &amp; Vijay Sales...</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Quick Action Squircles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Compare Prices */}
        <button
          type="button"
          onClick={() => onNavigateTab('compare')}
          className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-[#2864FF]/40 shadow-soft hover:shadow-glow-blue transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2864FF] to-[#7047F5] flex items-center justify-center text-white shadow-glow-blue mb-3 group-hover:scale-110 transition-transform">
            <Tag className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold tracking-tight">Compare Prices</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">5 Major Stores</span>
        </button>

        {/* 2. Coupons & Offers */}
        <button
          type="button"
          onClick={onOpenCoupons}
          className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-[#7047F5]/40 shadow-soft hover:shadow-glow-purple transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e11d48] to-[#7047F5] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform">
            <Ticket className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold tracking-tight">Coupons &amp; Offers</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Verified Codes</span>
        </button>

        {/* 3. Bank Offers */}
        <button
          type="button"
          onClick={onOpenBankOffers}
          className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-[#2864FF]/40 shadow-soft hover:shadow-glow-blue transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#2864FF] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform">
            <CreditCard className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold tracking-tight">Bank Offers</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">HDFC, ICICI &amp; more</span>
        </button>

        {/* 4. My Cards */}
        <button
          type="button"
          onClick={onOpenMyCards}
          className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-emerald-500/40 shadow-soft hover:shadow-md transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold tracking-tight">My Cards</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Earn 10% Rewards</span>
        </button>
      </div>

      {/* Card Linking & Rewards Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101936] via-[#1B1D27] to-[#2864FF]/80 p-6 sm:p-8 text-white shadow-elevated border border-white/10">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Link your cards &amp; earn 10% rewards
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Get a share of savings when others shop using your cards. Zero-knowledge escrow protection with instant nodal payouts.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMyCards}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#101936] flex items-center justify-center transition shadow-lg shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative Card Shapes */}
        <div className="absolute right-12 -bottom-6 w-36 h-24 rounded-2xl bg-gradient-to-tr from-[#2864FF] to-[#7047F5] opacity-30 transform rotate-12 blur-[1px] pointer-events-none hidden md:block" />
        <div className="absolute right-4 -bottom-4 w-32 h-20 rounded-2xl bg-gradient-to-tr from-[#7047F5] to-purple-400 opacity-40 transform -rotate-6 blur-[1px] pointer-events-none hidden md:block" />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#101936] text-white dark:bg-white dark:text-[#101936] shadow-sm'
                : 'bg-white dark:bg-[#1B1D27] text-slate-600 dark:text-slate-300 border border-[#E8ECF4] dark:border-white/10 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending Deals 🔥 Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Trending Deals 🔥</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              Live Drops
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('compare')}
            className="text-xs font-semibold text-[#2864FF] hover:underline"
          >
            View All
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-base font-bold">No Products Found for &quot;{searchQuery}&quot;</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching for iPhone, MacBook, AirPods, or paste a live product link from Flipkart, Amazon, Croma, Reliance, or Vijay Sales.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 rounded-full cc-gradient-btn text-white text-xs font-semibold shadow-glow-blue mt-2"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((p) => {
              const deals = optimizeProductDeals(p);
              const lowest = deals[0];
              const savings = getDealSavings(lowest);
              const discountPct = lowest && lowest.listedPrice > 0 ? Math.max(0, Math.round((savings / lowest.listedPrice) * 100)) : 0;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p.id);
                    onNavigateTab('compare');
                  }}
                  className="group cursor-pointer rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-5 shadow-soft hover:shadow-glow-blue hover:border-[#2864FF]/40 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Showcase */}
                    <div className="relative w-full h-44 rounded-2xl bg-slate-50 dark:bg-black/30 flex items-center justify-center p-4 overflow-hidden mb-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLovedProduct(p.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                          lovedProductIds.includes(p.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 dark:bg-black/40 text-slate-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${lovedProductIds.includes(p.id) ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Title & Brand */}
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">{p.brand}</p>
                    <h4 className="text-base font-bold text-[#101936] dark:text-white line-clamp-1 mt-0.5">{p.title}</h4>
                  </div>

                  {/* Pricing & Discount Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">From</span>
                      <p className="text-lg font-black text-[#101936] dark:text-white">
                        ₹{lowest ? getDealPrice(lowest).toLocaleString('en-IN') : p.listings[0]?.listedPrice.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      <span>↓ {discountPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
