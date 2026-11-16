'use client';

import React, { useState, useMemo } from 'react';
import { Product, OptimizedDeal, CartItem, EscrowOrder } from '../types';
import { PriceHistoryChart } from './PriceHistoryChart';
import { useCompareCart } from '../lib/store';
import {
  Search,
  Scan,
  Heart,
  Tag,
  Ticket,
  CreditCard,
  Wallet,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Coins,
  CheckCircle2,
  Package,
  Layers,
  Clock,
  SlidersHorizontal,
  ChevronDown,
  Info,
  User as UserIcon,
  ShoppingBag,
  Bell,
  RefreshCw,
  X
} from 'lucide-react';
import { MERCHANT_METADATA } from '../lib/deal-engine';
import { CouponsOffersModal } from './CouponsOffersModal';
import { BankOffersModal } from './BankOffersModal';
import { MyCardsModal } from './MyCardsModal';
import { BottomNavBar, NavTab } from './BottomNavBar';
import { ThemeToggleCapsule } from './ThemeToggleCapsule';

interface UserPortalProps {
  products: Product[];
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  urlInput: string;
  setUrlInput: (u: string) => void;
  isUrlMode: boolean;
  setIsUrlMode: (m: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  isLiveScraping: boolean;
  liveScrapeStatus: { source: string; durationMs: number } | null;
  handleTriggerLiveScrape: (q?: string) => void;
  onSelectPartnerCard: (deal: OptimizedDeal) => void;
  onSelectDirect: (deal: OptimizedDeal) => void;
  activeTab?: 'browse' | 'loved' | 'cart' | 'purchases';
  setActiveTab?: (tab: 'browse' | 'loved' | 'cart' | 'purchases') => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  products,
  selectedProductId,
  setSelectedProductId,
  searchQuery,
  setSearchQuery,
  urlInput,
  setUrlInput,
  isUrlMode,
  setIsUrlMode,
  selectedCategory,
  setSelectedCategory,
  isLiveScraping,
  liveScrapeStatus,
  handleTriggerLiveScrape,
  onSelectPartnerCard,
  onSelectDirect,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
}) => {
  const {
    lovedProductIds,
    toggleLovedProduct,
    cartItems,
    addToCart,
    orders,
    optimizeProductDeals,
    currentProfile,
    switchProfile
  } = useCompareCart();

  // Navigation tab state (home, compare, rewards, saved, profile)
  const [navTab, setNavTab] = useState<NavTab>(() => {
    if (externalActiveTab === 'loved') return 'saved';
    if (externalActiveTab === 'purchases') return 'rewards';
    return 'home';
  });

  // Sub-tabs on comparison screen: Compare | Price History | Details
  const [compareSubTab, setCompareSubTab] = useState<'compare' | 'history' | 'details'>('compare');

  // Quick Action Modals
  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);
  const [isBankOffersModalOpen, setIsBankOffersModalOpen] = useState(false);
  const [isMyCardsModalOpen, setIsMyCardsModalOpen] = useState(false);

  // Store comparison row expansion
  const [showAllStores, setShowAllStores] = useState(false);

  // Sync external tab when provided
  const handleTabChange = (tab: NavTab) => {
    setNavTab(tab);
    if (externalSetActiveTab) {
      if (tab === 'saved') externalSetActiveTab('loved');
      else if (tab === 'rewards') externalSetActiveTab('purchases');
      else externalSetActiveTab('browse');
    }
  };

  // Selected product & computed deals
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  const optimizedDeals = useMemo(() => {
    return optimizeProductDeals(selectedProduct);
  }, [selectedProduct, optimizeProductDeals]);

  const bestDeal = optimizedDeals[0] || null;

  // Helper for computing effective price and savings across both card types
  const getDealPrice = (deal: OptimizedDeal | null | undefined): number => {
    if (!deal) return 0;
    return deal.partnerCardEligible ? deal.partnerFinalEffectivePrice : deal.effectiveSelfPrice;
  };

  const getDealSavings = (deal: OptimizedDeal | null | undefined): number => {
    if (!deal) return 0;
    return deal.partnerCardEligible ? (deal.buyerSavings + deal.couponDiscount) : deal.effectiveDiscountTotal;
  };

  // Filtered products for search & category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const isSaved = lovedProductIds.includes(selectedProduct.id);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'audio', label: 'Audio' },
    { id: 'tablets', label: 'Tablets' }
  ];

  return (
    <div className="min-h-screen pb-24 sm:pb-16 text-[#101936] dark:text-white transition-colors duration-200">
      {/* Top Floating App Sub-Navigation for Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 p-1 rounded-full bg-slate-200/60 dark:bg-[#1B1D27] border border-slate-300/50 dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => handleTabChange('home')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                navTab === 'home'
                  ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange('compare')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                navTab === 'compare'
                  ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => handleTabChange('rewards')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                navTab === 'rewards'
                  ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rewards & Savings
            </button>
            <button
              onClick={() => handleTabChange('saved')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                navTab === 'saved'
                  ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Saved</span>
              {lovedProductIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#7047F5] text-white text-[10px] flex items-center justify-center">
                  {lovedProductIds.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('profile')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                navTab === 'profile'
                  ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profile
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Protected
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* =========================================================================
            TAB 1: HOME SCREEN (Matches Concept Left Screen)
           ========================================================================= */}
        {navTab === 'home' && (
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
                    Compare prices, apply coupons, use bank offers and save more across Flipkart, Amazon, Croma, Reliance Digital & Vijay Sales.
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

              {/* Pill Search Bar with Barcode/Link Scanner Icon */}
              <div className="mt-8 relative max-w-2xl">
                <div className="relative flex items-center bg-white dark:bg-[#252837] rounded-full border border-slate-300 dark:border-white/10 shadow-lg px-4 py-2 sm:py-2.5 transition-all focus-within:border-[#2864FF] focus-within:ring-2 focus-within:ring-[#2864FF]/20">
                  <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a product, brand or link"
                    className="w-full bg-transparent text-sm sm:text-base text-[#101936] dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsUrlMode(!isUrlMode);
                      if (!isUrlMode) {
                        const target = prompt('Paste product link from Flipkart, Amazon, Croma, Reliance or Vijay Sales:');
                        if (target) {
                          setUrlInput(target);
                          handleTriggerLiveScrape(target);
                        }
                      }
                    }}
                    title="Scan or Paste Link"
                    className="p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition shrink-0 ml-1"
                  >
                    <Scan className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Quick Action Squircles (Matches Reference Concept) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* 1. Compare Prices */}
              <button
                onClick={() => handleTabChange('compare')}
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
                onClick={() => setIsCouponsModalOpen(true)}
                className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-[#7047F5]/40 shadow-soft hover:shadow-glow-purple transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e11d48] to-[#7047F5] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform">
                  <Ticket className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold tracking-tight">Coupons & Offers</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Verified Codes</span>
              </button>

              {/* 3. Bank Offers */}
              <button
                onClick={() => setIsBankOffersModalOpen(true)}
                className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-[#2864FF]/40 shadow-soft hover:shadow-glow-blue transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#2864FF] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold tracking-tight">Bank Offers</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">HDFC, ICICI & more</span>
              </button>

              {/* 4. My Cards */}
              <button
                onClick={() => setIsMyCardsModalOpen(true)}
                className="group p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 hover:border-emerald-500/40 shadow-soft hover:shadow-md transition-all duration-200 flex flex-col items-center text-center text-[#101936] dark:text-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold tracking-tight">My Cards</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Earn 10% Rewards</span>
              </button>
            </div>

            {/* Card Linking & Rewards Promo Banner (Exact Match to Reference Concept) */}
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
                  onClick={() => setIsMyCardsModalOpen(true)}
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
                  onClick={() => handleTabChange('compare')}
                  className="text-xs font-semibold text-[#2864FF] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((p) => {
                  const deals = optimizeProductDeals(p);
                  const lowest = deals[0];
                  const savings = getDealSavings(lowest);
                  const discountPct = lowest ? Math.round((savings / lowest.listedPrice) * 100) : 12;

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        handleTabChange('compare');
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
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCT COMPARISON SCREEN (Matches Concept Middle Screen)
           ========================================================================= */}
        {navTab === 'compare' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Top Bar: Back Button & Wishlist Heart */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleTabChange('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>

              <button
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
                {/* Best Price Green Callout Banner (Matches Reference Concept) */}
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
                      {Math.round((getDealSavings(bestDeal) / bestDeal.listedPrice) * 100)}% off
                    </div>
                  </div>
                )}

                {/* Store Comparison List */}
                <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5 shadow-soft overflow-hidden">
                  {optimizedDeals
                    .slice(0, showAllStores ? undefined : 3)
                    .map((deal) => {
                      const meta = MERCHANT_METADATA[deal.merchantId];
                      const dealPrice = getDealPrice(deal);
                      const dealSavings = getDealSavings(deal);
                      return (
                        <div
                          key={deal.merchantId}
                          className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition"
                        >
                          {/* Store Info */}
                          <div className="flex items-center gap-3.5">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-sm shrink-0"
                              style={{ backgroundColor: meta.color }}
                            >
                              {meta.logoText}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#101936] dark:text-white">{meta.name}</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {deal.partnerCard ? `${deal.partnerCard.bank} Offer Unlocked` : 'Direct Store Price'}
                              </p>
                            </div>
                          </div>

                          {/* Price & CTA Button */}
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right">
                              <p className="text-base sm:text-lg font-black text-[#101936] dark:text-white">
                                ₹{dealPrice.toLocaleString('en-IN')}
                              </p>
                              {dealSavings > 0 && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold line-through">
                                  ₹{deal.listedPrice.toLocaleString('en-IN')}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => onSelectPartnerCard(deal)}
                              className="px-4 py-2 rounded-full cc-gradient-btn text-white text-xs font-semibold shadow-glow-blue hover:scale-105 transition"
                            >
                              Get offer
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Expand / Collapse More Stores */}
                {optimizedDeals.length > 3 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllStores(!showAllStores)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#101936] dark:hover:text-white py-2"
                    >
                      <span>{showAllStores ? 'Show less stores' : `View ${optimizedDeals.length - 3} more stores`}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAllStores ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}
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
                <h3 className="text-base font-bold tracking-tight">Product Specifications & Escrow Policy</h3>
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

            {/* Sticky Bottom Action CTA Button (Exact Match to Concept Middle Screen) */}
            {bestDeal && (
              <div className="sticky bottom-20 sm:bottom-6 inset-x-0 z-30 pt-2 pb-4">
                <button
                  onClick={() => onSelectPartnerCard(bestDeal)}
                  className="w-full py-4 rounded-full cc-gradient-btn text-white font-bold text-base shadow-glow-blue flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Shop Now &amp; Save ₹{getDealSavings(bestDeal).toLocaleString('en-IN')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: REWARDS & SAVINGS SCREEN (Matches Concept Right Screen "My Savings")
           ========================================================================= */}
        {navTab === 'rewards' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-2xl mx-auto">
            {/* Top Bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTabChange('home')}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 flex items-center justify-center shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-extrabold tracking-tight">My Savings</h2>
            </div>

            {/* Big Total Saved Card */}
            <div className="rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#1B1D27] dark:via-[#161821] dark:to-[#101116] border border-[#E8ECF4] dark:border-white/10 p-6 sm:p-8 shadow-soft relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Total Saved
                  </span>
                  <p className="text-4xl sm:text-5xl font-black text-[#101936] dark:text-white mt-1">
                    ₹18,450
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-[#7047F5] flex items-center justify-center border border-purple-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* 3 Metrics Pill Row */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/5 text-center">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Orders</span>
                  <p className="text-lg font-bold text-[#101936] dark:text-white mt-0.5">{orders.length || 12}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Avg. Savings</span>
                  <p className="text-lg font-bold text-[#101936] dark:text-white mt-0.5">₹1,537</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Best Deal</span>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">24%</p>
                </div>
              </div>
            </div>

            {/* "Your Rewards" Card with Gold Coins (Exact Match) */}
            <div
              onClick={() => setIsMyCardsModalOpen(true)}
              className="cursor-pointer rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-5 sm:p-6 shadow-soft hover:shadow-glow-purple hover:border-[#7047F5]/40 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  🪙
                </div>

                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Earnings</span>
                  <h4 className="text-2xl font-black text-[#101936] dark:text-white">₹1,845</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">10% share from card-linked purchases</p>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            {/* Escrow Orders Ledger */}
            <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft space-y-4">
              <h3 className="text-base font-bold tracking-tight">Recent Escrow Transactions</h3>
              {orders.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 text-center text-xs text-slate-500">
                  No pending escrow transactions. Completed orders settle automatically within 24 hours of delivery.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{order.orderNumber}</p>
                        <p className="text-[11px] text-slate-500">{order.productTitle}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{order.totalSavings.toLocaleString('en-IN')} Saved</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{order.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SAVED PRODUCTS (WISHLIST)
           ========================================================================= */}
        {navTab === 'saved' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Saved Products</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track price drops and instant bank deals</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7047F5]/10 text-[#7047F5] border border-[#7047F5]/20">
                {lovedProductIds.length} Items Saved
              </span>
            </div>

            {lovedProductIds.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="text-base font-bold">Your Wishlist is Empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any product to save it and monitor instant bank price drops.
                </p>
                <button
                  onClick={() => handleTabChange('home')}
                  className="px-5 py-2.5 rounded-full cc-gradient-btn text-white text-xs font-semibold shadow-glow-blue mt-2"
                >
                  Explore Trending Deals
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products
                  .filter((p) => lovedProductIds.includes(p.id))
                  .map((p) => {
                    const deals = optimizeProductDeals(p);
                    const lowest = deals[0];
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProductId(p.id);
                          handleTabChange('compare');
                        }}
                        className="cursor-pointer rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-5 shadow-soft hover:shadow-glow-blue transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative w-full h-40 rounded-2xl bg-slate-50 dark:bg-black/30 flex items-center justify-center p-4 mb-3">
                            <img src={p.image} alt={p.title} className="max-h-32 object-contain" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLovedProduct(p.id);
                              }}
                              className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white shadow-sm"
                            >
                              <Heart className="w-4 h-4 fill-white" />
                            </button>
                          </div>
                          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{p.brand}</p>
                          <h4 className="text-sm font-bold text-[#101936] dark:text-white line-clamp-1 mt-0.5">{p.title}</h4>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500">Best Deal</span>
                            <p className="text-base font-black text-[#101936] dark:text-white">
                              ₹{lowest ? getDealPrice(lowest).toLocaleString('en-IN') : 'N/A'}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductId(p.id);
                              handleTabChange('compare');
                            }}
                            className="px-3.5 py-1.5 rounded-full cc-gradient-btn text-white text-xs font-semibold"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: PROFILE & SETTINGS
           ========================================================================= */}
        {navTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold tracking-tight">Account &amp; Settings</h2>

            {/* Profile Card */}
            <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft flex items-center gap-4">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#2864FF]"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold">{currentProfile.name}</h3>
                <p className="text-xs text-slate-500">{currentProfile.email}</p>
                <span className="inline-block text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  {currentProfile.role}
                </span>
              </div>
            </div>

            {/* Theme & Preferences */}
            <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Theme Preference</h4>
                  <p className="text-xs text-slate-500">Switch between Light &amp; Dark interface</p>
                </div>
                <ThemeToggleCapsule />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">My Linked Cards</h4>
                  <p className="text-xs text-slate-500">Manage card liquidity and 10% platform rewards</p>
                </div>
                <button
                  onClick={() => setIsMyCardsModalOpen(true)}
                  className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/20 transition"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (5 Tabs) */}
      <BottomNavBar activeTab={navTab} onChangeTab={handleTabChange} />

      {/* Modals for Quick Actions */}
      <CouponsOffersModal
        isOpen={isCouponsModalOpen}
        onClose={() => setIsCouponsModalOpen(false)}
      />

      <BankOffersModal
        isOpen={isBankOffersModalOpen}
        onClose={() => setIsBankOffersModalOpen(false)}
      />

      <MyCardsModal
        isOpen={isMyCardsModalOpen}
        onClose={() => setIsMyCardsModalOpen(false)}
      />
    </div>
  );
};
