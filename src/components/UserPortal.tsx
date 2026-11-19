'use client';

import React, { useState, useMemo } from 'react';
import { Product, OptimizedDeal } from '../types';
import { useCompareCart } from '../lib/store';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { CouponsOffersModal } from './CouponsOffersModal';
import { BankOffersModal } from './BankOffersModal';
import { MyCardsModal } from './MyCardsModal';
import { BottomNavBar, NavTab } from './BottomNavBar';
import { UserHomeTab } from './user/UserHomeTab';
import { UserCompareTab } from './user/UserCompareTab';
import { UserRewardsTab } from './user/UserRewardsTab';
import { UserSavedTab } from './user/UserSavedTab';
import { UserProfileTab } from './user/UserProfileTab';

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
  selectedCategory,
  setSelectedCategory,
  isLiveScraping,
  handleTriggerLiveScrape,
  onSelectPartnerCard,
  onSelectDirect,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
}) => {
  const {
    lovedProductIds,
    toggleLovedProduct,
    orders,
    optimizeProductDeals,
    currentProfile,
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
  const [activeScrapeTarget, setActiveScrapeTarget] = useState<string>('');

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

  const executeSearchOrScrape = (q?: string) => {
    const target = (q !== undefined ? q : (isUrlMode ? urlInput : searchQuery)).trim();
    if (!target) return;
    setActiveScrapeTarget(target);
    handleTriggerLiveScrape(target);
    handleTabChange('compare');
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
    { id: 'tablets', label: 'Tablets' },
  ];

  return (
    <div className="min-h-screen pb-24 sm:pb-16 text-[#101936] dark:text-white transition-colors duration-200">
      {/* Top Floating App Sub-Navigation for Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 p-1 rounded-full bg-slate-200/60 dark:bg-[#1B1D27] border border-slate-300/50 dark:border-white/10 text-xs font-semibold">
            <button
              type="button"
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
              type="button"
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
              type="button"
              onClick={() => handleTabChange('rewards')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                navTab === 'rewards'
                  ? 'bg-white dark:bg-[#2864FF] text-[#101936] dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rewards &amp; Savings
            </button>
            <button
              type="button"
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
              type="button"
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
        {/* TAB 1: HOME SCREEN */}
        {navTab === 'home' && (
          <UserHomeTab
            selectedProduct={selectedProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLiveScraping={isLiveScraping}
            executeSearchOrScrape={executeSearchOrScrape}
            setUrlInput={setUrlInput}
            onNavigateTab={handleTabChange}
            onOpenCoupons={() => setIsCouponsModalOpen(true)}
            onOpenBankOffers={() => setIsBankOffersModalOpen(true)}
            onOpenMyCards={() => setIsMyCardsModalOpen(true)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            filteredProducts={filteredProducts}
            optimizeProductDeals={optimizeProductDeals}
            lovedProductIds={lovedProductIds}
            toggleLovedProduct={toggleLovedProduct}
            onSelectProduct={setSelectedProductId}
            getDealSavings={getDealSavings}
            getDealPrice={getDealPrice}
          />
        )}

        {/* TAB 2: PRODUCT COMPARISON SCREEN */}
        {navTab === 'compare' && (
          <UserCompareTab
            isLiveScraping={isLiveScraping}
            activeScrapeTarget={activeScrapeTarget}
            searchQuery={searchQuery}
            onNavigateHome={() => handleTabChange('home')}
            selectedProduct={selectedProduct}
            toggleLovedProduct={toggleLovedProduct}
            isSaved={isSaved}
            compareSubTab={compareSubTab}
            setCompareSubTab={setCompareSubTab}
            bestDeal={bestDeal}
            optimizedDeals={optimizedDeals}
            onSelectPartnerCard={onSelectPartnerCard}
            onSelectDirect={onSelectDirect}
            getDealSavings={getDealSavings}
            getDealPrice={getDealPrice}
          />
        )}

        {/* TAB 3: REWARDS & SAVINGS SCREEN */}
        {navTab === 'rewards' && (
          <UserRewardsTab
            onNavigateHome={() => handleTabChange('home')}
            orders={orders}
            onOpenMyCards={() => setIsMyCardsModalOpen(true)}
          />
        )}

        {/* TAB 4: SAVED PRODUCTS (WISHLIST) */}
        {navTab === 'saved' && (
          <UserSavedTab
            lovedProductIds={lovedProductIds}
            toggleLovedProduct={toggleLovedProduct}
            products={products}
            optimizeProductDeals={optimizeProductDeals}
            onSelectProduct={setSelectedProductId}
            onNavigateTab={handleTabChange}
            getDealPrice={getDealPrice}
          />
        )}

        {/* TAB 5: PROFILE & SETTINGS */}
        {navTab === 'profile' && (
          <UserProfileTab
            currentProfile={currentProfile}
            onOpenMyCards={() => setIsMyCardsModalOpen(true)}
          />
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

      {/* Real-Time Scraping & Price Ingestion Modal */}
      {isLiveScraping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-7 text-center space-y-5 text-[#101936] dark:text-white">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#2864FF]/10 text-[#2864FF] flex items-center justify-center relative">
              <span className="absolute inset-0 rounded-2xl bg-[#2864FF]/20 animate-ping" />
              <RefreshCw className="w-7 h-7 animate-spin relative z-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2864FF] bg-[#2864FF]/10 px-2.5 py-0.5 rounded-full inline-block">
                Live Store Ingestion Active
              </span>
              <h3 className="text-xl font-black tracking-tight text-[#101936] dark:text-white">
                Searching for &ldquo;{activeScrapeTarget || searchQuery || 'Product'}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
                Crawling real-time prices &amp; GrabOn coupons across 5 platforms...
              </p>
            </div>

            {/* 5 Stores Grid */}
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[
                { name: 'Flipkart', color: '#2874F0' },
                { name: 'Amazon', color: '#FF9900' },
                { name: 'Croma', color: '#00B5B5' },
                { name: 'Reliance', color: '#E42529' },
                { name: 'Vijay Sales', color: '#D11242' },
              ].map((s) => (
                <div key={s.name} className="p-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 text-center space-y-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full mx-auto block" style={{ backgroundColor: s.color }} />
                  <p className="text-[10px] font-bold truncate text-[#101936] dark:text-white">{s.name}</p>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono block">Syncing</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2864FF] via-[#7047F5] to-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
