'use client';

import React, { useState, useRef } from 'react';
import { Product, OptimizedDeal, CartItem, EscrowOrder } from '../types';
import { DealComparisonTable } from './DealComparisonTable';
import { PriceHistoryChart } from './PriceHistoryChart';
import { useCompareCart } from '../lib/store';
import {
  Search,
  Link as LinkIcon,
  RefreshCw,
  Zap,
  Heart,
  ShoppingCart,
  ShieldCheck,
  ArrowUpRight,
  PackageCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  Layers,
  ChevronRight,
  X,
  CreditCard,
  Bell,
  SlidersHorizontal,
  Eye,
  Check,
  Star,
  Tag,
  RotateCcw
} from 'lucide-react';

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
    removeFromCart,
    clearCart,
    orders,
    optimizeProductDeals,
    matchCardholder,
  } = useCompareCart();

  const [internalActiveTab, setInternalActiveTab] = useState<'browse' | 'loved' | 'cart' | 'purchases'>('browse');
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;
  const [cartNotice, setCartNotice] = useState<string | null>(null);

  // Dynamic 3D Tilt & Parallax State (Pinterest Dynamic Hero Design)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [activeAngle, setActiveAngle] = useState<'3D' | 'FRONT' | 'DETAIL'>('3D');
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(0);
  const [activeMerchantHighlight, setActiveMerchantHighlight] = useState<string | null>(null);

  // 3D Card Hover & Specular State
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);


  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCardTilt({
      x: ((y / rect.height) - 0.5) * -16,
      y: ((x / rect.width) - 0.5) * 16,
    });
    setIsHoveringCard(true);
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
    setIsHoveringCard(false);
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tiltX = ((y / rect.height) - 0.5) * -18;
    const tiltY = ((x / rect.width) - 0.5) * 18;
    setTilt({ x: tiltX, y: tiltY });
    setMousePos({ x, y });
    setIsHoveringHero(true);
  };

  const handleHeroMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHoveringHero(false);
  };

  const showCartNotice = (msg: string) => {
    setCartNotice(msg);
    setTimeout(() => setCartNotice(null), 3000);
  };

  // Filter products for category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const optimizedDeals = optimizeProductDeals(selectedProduct);
  const bestDeal = optimizedDeals[0];

  // Auto-assigned cardholder preview for best deal
  const assignedCardholder = bestDeal?.partnerCard
    ? matchCardholder(bestDeal.partnerCard.bank, bestDeal.partnerCard.cardName, bestDeal.listedPrice)
    : undefined;

  const lovedProducts = products.filter((p) => lovedProductIds.includes(p.id));

  const cartTotalListed = cartItems.reduce((acc, item) => acc + item.selectedDeal.listedPrice * item.quantity, 0);
  const cartTotalEffective = cartItems.reduce(
    (acc, item) => acc + item.selectedDeal.partnerFinalEffectivePrice * item.quantity,
    0
  );
  const cartSavings = cartTotalListed - cartTotalEffective;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* User Portal Sub-Navigation Ribbon (Browse, Loved, Cart, Purchases) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#30d158]">
            Consumer Intelligence Suite
          </span>
          <h2 className="text-xl font-semibold text-white tracking-tight mt-0.5">
            Real-Time Shopping & Partner Card Network
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-[#1c1c1e]/80 p-1 rounded-full border border-white/[0.08] overflow-x-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === 'browse'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Price Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('loved')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === 'loved'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Loved</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'loved' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
            }`}>
              {lovedProductIds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === 'cart'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Cart</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'cart' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
            }`}>
              {cartItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === 'purchases'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Cart Toast Notification */}
      {cartNotice && (
        <div className="p-3 bg-[#1c1c1e]/90 border border-white/10 rounded-2xl text-xs font-medium text-white flex items-center gap-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-[#30d158]" />
          <span>{cartNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: BROWSE & PRICE MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-8">
          {/* Executive Search & Ingestion Banner */}
          <div className="bg-[#161617]/90 rounded-[28px] border border-white/[0.08] p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[#86868b] text-xs font-medium mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#30d158]" />
                  <span>Real-Time E-Commerce & Card Optimizer</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  Universal Price Comparison & Partner Card Network
                </h1>
                <p className="text-xs sm:text-sm text-[#86868b] mt-1.5 max-w-2xl leading-relaxed">
                  Real-time price discovery across Flipkart, Amazon, Croma, Reliance & Vijay Sales. Unlock instant credit card discounts through our verified cardholder pool even without holding the card.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full border border-white/[0.08] self-start md:self-auto text-xs">
                <button
                  onClick={() => setIsUrlMode(false)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition ${
                    !isUrlMode ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  Search Product
                </button>
                <button
                  onClick={() => setIsUrlMode(true)}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                    isUrlMode ? 'bg-white text-black shadow-sm' : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Paste Store Link</span>
                </button>
              </div>
            </div>

            {/* Live Search & URL Input Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                {!isUrlMode ? (
                  <>
                    <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search electronics: iPhone 16, MacBook Air M3, Sony XM5, Galaxy S24..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTriggerLiveScrape()}
                      className="w-full bg-black/60 text-white text-xs pl-11 pr-4 py-3.5 rounded-full border border-white/10 focus:outline-none focus:border-[#0071e3]/60 focus:ring-2 focus:ring-[#0071e3]/20 placeholder:text-[#86868b] transition"
                    />
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Paste Flipkart or Amazon product link (e.g. https://www.flipkart.com/...)"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTriggerLiveScrape()}
                      className="w-full bg-black/60 text-white text-xs pl-11 pr-4 py-3.5 rounded-full border border-white/10 focus:outline-none focus:border-[#0071e3]/60 focus:ring-2 focus:ring-[#0071e3]/20 placeholder:text-[#86868b] transition"
                    />
                  </>
                )}
              </div>

              <button
                disabled={isLiveScraping}
                onClick={() => handleTriggerLiveScrape()}
                className="apple-pill-btn px-6 py-3.5 disabled:opacity-50 transition flex items-center justify-center gap-2 text-xs shrink-0 tracking-wide"
              >
                {isLiveScraping ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Scraping Live...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-black" />
                    <span>Live Compare</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestions & Latency */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Popular:</span>
                {['iPhone 16', 'MacBook Air M3', 'Sony WH-1000XM5', 'Samsung Galaxy S24'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleTriggerLiveScrape(tag);
                    }}
                    className="text-[11px] font-medium bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1 rounded-xl border border-white/[0.08] transition shadow-xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {liveScrapeStatus && (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span className="text-zinc-300 font-semibold">{liveScrapeStatus.source}</span>
                  <span className="text-zinc-500">({liveScrapeStatus.durationMs}ms)</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Selector Ribbon */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Tracked Products ({filteredProducts.length})
              </h2>

              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {[
                  { id: 'all', label: 'All Deals' },
                  { id: 'smartphones', label: 'Phones' },
                  { id: 'laptops', label: 'Laptops' },
                  { id: 'audio', label: 'Audio' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-xl border transition shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-800 text-white border-white/20 shadow-sm'
                        : 'bg-zinc-950/60 text-zinc-400 border-white/[0.08] hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => {
                const isSelected = prod.id === selectedProduct.id;
                const deals = optimizeProductDeals(prod);
                const best = deals[0];
                const isLoved = lovedProductIds.includes(prod.id);

                return (
                  <div
                    key={prod.id}
                    className={`glass-card p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] relative ${
                      isSelected
                        ? 'border-emerald-500/50 bg-zinc-900/90 shadow-[0_0_25px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/40'
                        : 'border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Loved Heart Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLovedProduct(prod.id);
                        showCartNotice(isLoved ? `Removed ${prod.title} from Loved` : `Added ${prod.title} to Loved`);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-white/10 text-zinc-400 hover:text-rose-400 transition z-10"
                      title={isLoved ? 'Remove from Loved' : 'Add to Loved'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLoved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div
                      onClick={() => setSelectedProductId(prod.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-zinc-950/80 border border-white/10 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="max-h-full max-w-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{prod.brand}</span>
                          <h3 className="text-xs font-bold text-white truncate mt-0.5">{prod.title}</h3>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-sm font-extrabold text-white">
                              ₹{(best ? best.partnerFinalEffectivePrice : prod.lowestHistoricalPrice).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-zinc-500 line-through">
                              ₹{prod.highestHistoricalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          Save ₹{(prod.highestHistoricalPrice - (best ? best.partnerFinalEffectivePrice : prod.lowestHistoricalPrice)).toLocaleString('en-IN')}
                        </span>
                        <span className="emerald-foil-badge text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Interactive Product Showcase (3D Tilt & Parallax Layered Depth) */}
          <div className="space-y-6">
            <div
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              className="glass-panel rounded-3xl border border-white/[0.12] p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300"
              style={{
                background: isHoveringHero
                  ? `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), rgba(9, 10, 15, 0.95) 70%)`
                  : undefined,
              }}
            >
              {/* Layered Architectural Watermark Typography Behind Image (Pin 1 3D Depth) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                <span className="text-[90px] sm:text-[140px] font-black tracking-tighter text-white/[0.03] uppercase font-mono transform -rotate-2 scale-110">
                  {selectedProduct.brand}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* 1. Dynamic 3D Interactive Floating Product Card (5 cols) */}
                <div className="lg:col-span-5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div
                    className="relative w-44 h-44 sm:w-52 sm:h-52 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black border border-white/15 rounded-3xl p-5 flex items-center justify-center shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-200 ease-out group"
                    style={{
                      perspective: '1000px',
                      transform: isHoveringHero
                        ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`
                        : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                    }}
                  >
                    {/* Floating 3D Badge on Top Left */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="text-[9px] font-mono font-black text-amber-300 gold-foil-badge px-2 py-0.5 rounded-full uppercase tracking-wider">
                        3D TILT
                      </span>
                    </div>

                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="max-h-full max-w-full object-contain rounded-2xl relative z-10 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105"
                    />

                    {/* Interactive Angle Selector Controls */}
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-center gap-1.5 z-20 bg-zinc-950/80 backdrop-blur-md py-1 px-2 rounded-xl border border-white/10 text-[9px] font-mono">
                      <span className="text-zinc-500 font-bold">MODE:</span>
                      <button
                        onClick={() => setActiveAngle('3D')}
                        className={`px-1.5 py-0.5 rounded ${activeAngle === '3D' ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}
                      >
                        Interactive
                      </button>
                      <span className="text-zinc-700">•</span>
                      <button
                        onClick={() => setActiveAngle('FRONT')}
                        className={`px-2 py-0.5 rounded-full ${activeAngle === 'FRONT' ? 'bg-white/10 text-white font-medium' : 'text-[#86868b]'}`}
                      >
                        Front
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full">
                        {selectedProduct.brand}
                      </span>
                      <span className="text-xs text-zinc-700">•</span>
                      <span className="text-xs text-[#86868b] capitalize">{selectedProduct.category}</span>
                    </div>

                    <h2 className="text-base sm:text-xl font-semibold text-white leading-snug tracking-tight">
                      {selectedProduct.title}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#86868b] pt-0.5">
                      <span className="emerald-foil-badge text-[#30d158] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                        Verified Across 5 Stores
                      </span>
                      <span>
                        Historical Low: <strong className="text-white">₹{selectedProduct.lowestHistoricalPrice.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    {/* Quick Micro-Interaction Actions */}
                    <div className="flex items-center gap-2 pt-2 justify-center sm:justify-start flex-wrap">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct, bestDeal);
                          showCartNotice(`Added ${selectedProduct.title} to Shopping Cart`);
                        }}
                        className="apple-pill-btn-secondary text-xs px-4 py-2 flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-white" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => {
                          toggleLovedProduct(selectedProduct.id);
                          showCartNotice(lovedProductIds.includes(selectedProduct.id) ? 'Removed from Loved' : 'Added to Loved');
                        }}
                        className="apple-pill-btn-secondary text-xs p-2"
                        title="Save to Loved Products"
                      >
                        <Heart className={`w-3.5 h-3.5 ${lovedProductIds.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : 'text-[#86868b]'}`} />
                      </button>

                      <button
                        onClick={() => setIsPriceAlertOpen(true)}
                        className="apple-pill-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5 text-[#2997ff]" />
                        <span>Price Alert</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Hyper-Realistic Physical 3D Metal Credit Card & Real-Time Price Matrix (7 cols) */}
                {bestDeal ? (
                  <div className="lg:col-span-7 bg-[#1c1c1e]/90 rounded-[32px] p-6 sm:p-7 text-white border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden flex flex-col justify-between gap-6">
                    {/* Top Row: Best Verified Tag & Store */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-white text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#30d158] animate-pulse-ring" />
                        <span>Lowest Scraped Price on {bestDeal.merchantName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#30d158] uppercase font-bold bg-[#30d158]/10 px-3 py-1 rounded-full border border-[#30d158]/20">
                        ESCROW PROTECTED
                      </span>
                    </div>

                    {/* PHYSICAL 3D SKEUOMORPHIC CREDIT CARD */}
                    <div
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      className="realistic-card-container w-full max-w-[420px] mx-auto select-none"
                    >
                      <div
                        className="realistic-card p-5 sm:p-6 text-white flex flex-col justify-between relative cursor-pointer border border-white/20"
                        style={{
                          background: bestDeal.bestBankOffer?.bank.toLowerCase().includes('hdfc')
                            ? 'linear-gradient(135deg, #0b0f19 0%, #151c2e 50%, #000000 100%)'
                            : bestDeal.bestBankOffer?.bank.toLowerCase().includes('icici')
                            ? 'linear-gradient(135deg, #0a1f14 0%, #0d3822 50%, #03140b 100%)'
                            : bestDeal.bestBankOffer?.bank.toLowerCase().includes('sbi')
                            ? 'linear-gradient(135deg, #0b1a30 0%, #142a4d 50%, #07101f 100%)'
                            : 'linear-gradient(135deg, #1f1224 0%, #301736 50%, #100813 100%)',
                          transform: isHoveringCard
                            ? `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) scale3d(1.03, 1.03, 1.03)`
                            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                        }}
                      >
                        {/* Iridescent Rainbow Sheen */}
                        <div className="holographic-sheen" />

                        {/* Card Top: Bank Name & Network */}
                        <div className="flex items-center justify-between relative z-10">
                          <div>
                            <span className="text-[11px] font-mono font-black tracking-widest uppercase text-amber-300 drop-shadow-sm">
                              {bestDeal.bestBankOffer?.bank || 'PREMIER BANK'}
                            </span>
                            <p className="text-[10px] text-zinc-300 font-semibold tracking-wide mt-0.5">
                              {bestDeal.bestBankOffer?.cardName || 'Infinite Titanium Metal'}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-extrabold tracking-wider bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                            VISA INFINITE
                          </span>
                        </div>

                        {/* Card Middle: Gold EMV Chip & Contactless Wave */}
                        <div className="flex items-center gap-3 my-2 relative z-10">
                          <div className="realistic-emv-chip" />
                          <svg className="w-5 h-5 text-amber-200/80 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.343 9.343c5.857-5.857 15.355-5.857 21.213 0" />
                          </svg>
                          <span className="text-[10px] font-mono font-bold text-amber-300/90 tracking-widest uppercase ml-auto">
                            10% INSTANT CASHBACK
                          </span>
                        </div>

                        {/* Card Bottom: Masked Number & Cardholder */}
                        <div className="relative z-10 pt-1">
                          <p className="font-mono text-sm sm:text-base font-bold tracking-[0.25em] text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            4532 •••• •••• 9821
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              {assignedCardholder && (
                                <img
                                  src={assignedCardholder.avatar}
                                  alt={assignedCardholder.name}
                                  className="w-4 h-4 rounded-full object-cover ring-1 ring-white/30"
                                />
                              )}
                              <span className="font-mono uppercase font-bold text-zinc-300 tracking-wider">
                                {assignedCardholder ? assignedCardholder.name : 'VERIFIED HOLDER'}
                              </span>
                            </div>
                            <span className="font-mono text-zinc-400">EXP: 11/29</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Spectrum & Deductions */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-baseline justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#86868b] tracking-wider block">
                            Your Net Effective Price
                          </span>
                          <span className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                            ₹{bestDeal.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-[#86868b] line-through block">
                            MRP ₹{bestDeal.mrp.toLocaleString('en-IN')}
                          </span>
                          {bestDeal.mrp > bestDeal.partnerFinalEffectivePrice && (
                            <span className="text-xs font-semibold bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30 px-3 py-1 rounded-full inline-block mt-0.5">
                              Save ₹{Math.max(0, bestDeal.mrp - bestDeal.partnerFinalEffectivePrice).toLocaleString('en-IN')} ({Math.max(0, Math.round(((bestDeal.mrp - bestDeal.partnerFinalEffectivePrice) / bestDeal.mrp) * 100))}% OFF)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Deductions Chips */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                          <span className="text-[#86868b] flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-[#30d158]" />
                            Auto Coupon
                          </span>
                          <strong className="text-[#30d158]">−₹{bestDeal.couponDiscount.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                          <span className="text-[#86868b] flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-[#2997ff]" />
                            Card Discount
                          </span>
                          <strong className="text-[#2997ff]">−₹{bestDeal.buyerSavings.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3 pt-1">
                      {bestDeal.partnerCardEligible ? (
                        <button
                          onClick={() => onSelectPartnerCard(bestDeal)}
                          className="apple-pill-btn tactile-pill flex-1 py-3.5 px-5 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg"
                        >
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>Unlock Deal with Partner Card & Escrow</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectDirect(bestDeal)}
                          className="apple-pill-btn-secondary tactile-pill flex-1 py-3.5 px-5 flex items-center justify-center gap-2 text-xs font-semibold"
                        >
                          <span>Buy Directly on {bestDeal.merchantName}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 3. Live Multi-Store Savings Spectrum (Apple Clean Widgets) */}
            <div className="bg-[#161617]/90 rounded-[28px] p-5 sm:p-6 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2997ff]" />
                  <span className="font-semibold text-white tracking-tight">
                    Live Multi-Store Pricing Spectrum
                  </span>
                </div>
                <span className="text-[11px] text-[#86868b]">
                  Real-time price differential across 5 verified storefronts
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                {selectedProduct.listings
                  .filter((l) => !l.priceUnavailable && l.listedPrice > 0)
                  .map((listing) => {
                    const isLowest = listing.listedPrice === Math.min(...selectedProduct.listings.filter(l => !l.priceUnavailable && l.listedPrice > 0).map(l => l.listedPrice));
                    return (
                      <div
                        key={listing.merchantId}
                        onClick={() => {
                          const deal = optimizedDeals.find(d => d.merchantId === listing.merchantId);
                          if (deal) onSelectDirect(deal);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          isLowest
                            ? 'bg-black/60 border-[#30d158]/50 shadow-[0_0_20px_rgba(48,209,88,0.15)] ring-1 ring-[#30d158]/30'
                            : 'bg-black/40 border-white/[0.06] hover:border-white/20 hover:bg-black/60'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] text-[#86868b] mb-1">
                          <span className="font-medium uppercase tracking-wider">{listing.merchantId.replace('_', ' ')}</span>
                          {isLowest && (
                            <span className="text-[9px] font-semibold text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded-full font-mono">
                              LOWEST
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white">₹{listing.listedPrice.toLocaleString('en-IN')}</p>
                        <span className="text-[10px] text-[#86868b] line-through">MRP ₹{listing.mrp.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
              </div>
            </div>



            {/* Verified Merchant & Card Offer Matrix */}
            <div>
              <DealComparisonTable
                product={selectedProduct}
                deals={optimizedDeals}
                onSelectPartnerCard={onSelectPartnerCard}
                onSelectDirect={onSelectDirect}
              />
            </div>

            {/* Price Trend History & Technical Specifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <PriceHistoryChart product={selectedProduct} />
              </div>

              <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <span>Specifications & Verification</span>
                </h4>
                <div className="space-y-2.5 text-xs divide-y divide-white/[0.08]">
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center pt-2.5 first:pt-0">
                      <span className="text-zinc-400">{key}:</span>
                      <span className="font-semibold text-white text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: LOVED PRODUCTS (WISHLIST) */}
      {/* ========================================================================= */}
      {activeTab === 'loved' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-lg font-black text-white">My Loved Products & Price Drop Alerts</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Products you have bookmarked for real-time price monitoring and instant deal alerts.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
              {lovedProducts.length} Saved
            </span>
          </div>

          {lovedProducts.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 text-xs font-mono">
              You haven&apos;t saved any products yet. Click the heart icon on any product in the Price Matrix to track it!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lovedProducts.map((prod) => {
                const deals = optimizeProductDeals(prod);
                const best = deals[0];
                return (
                  <div key={prod.id} className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      <img src={prod.image} alt={prod.title} className="w-16 h-16 object-contain rounded-xl bg-zinc-900 p-1 border border-white/10" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">{prod.brand}</span>
                        <h4 className="text-xs font-bold text-white truncate mt-0.5">{prod.title}</h4>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-base font-black text-white">
                            ₹{best?.partnerFinalEffectivePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-zinc-500 line-through">
                            ₹{prod.highestHistoricalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 mt-0.5 block">
                          Save ₹{(prod.highestHistoricalPrice - (best?.partnerFinalEffectivePrice || 0)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                      <button
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setActiveTab('browse');
                        }}
                        className="flex-1 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-xl border border-white/10 transition text-center"
                      >
                        Compare All Prices
                      </button>

                      <button
                        onClick={() => toggleLovedProduct(prod.id)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 text-rose-400 border border-white/10 transition"
                        title="Remove from Loved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SHOPPING CART */}
      {/* ========================================================================= */}
      {activeTab === 'cart' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">Your Shopping Cart & Aggregate Savings</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Items added from optimal merchants ready for single-click partner card escrow checkout.
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-zinc-400 hover:text-rose-400 transition underline font-mono"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 text-xs font-mono">
              Your cart is empty. Add products from the Price Matrix to capture maximum cardholder discounts!
            </div>
          ) : (
            <div className="space-y-6">
              <div className="divide-y divide-white/[0.06]">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-14 h-14 object-contain rounded-xl bg-zinc-950 border border-white/10 p-1"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.product.title}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Merchant: <strong className="text-white">{item.selectedDeal.merchantName}</strong> • Qty: {item.quantity}
                        </p>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          Effective: ₹{item.selectedDeal.partnerFinalEffectivePrice.toLocaleString('en-IN')} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-sm font-black text-white">
                          ₹{(item.selectedDeal.partnerFinalEffectivePrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-zinc-500 line-through block">
                          ₹{(item.selectedDeal.listedPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 transition border border-white/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary Box */}
              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Retail Price:</span>
                    <span className="line-through">₹{cartTotalListed.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Total Partner Cardholder Savings:</span>
                    <span>−₹{cartSavings.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/[0.08]">
                    <span>Final Effective Escrow Total:</span>
                    <span className="text-xl">₹{cartTotalEffective.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const firstItem = cartItems[0];
                    if (firstItem) onSelectPartnerCard(firstItem.selectedDeal);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Proceed to Escrow Checkout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: PURCHASES & ESCROW TRACKING */}
      {/* ========================================================================= */}
      {activeTab === 'purchases' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black text-white">My Purchases & Live Escrow Tracking</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time multi-party status of orders placed via Partner Card Network with RBI nodal escrow.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/30">
              {orders.length} Total Purchases
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 text-xs font-mono">
              No orders placed yet. Choose a product and unlock partner card discounts to begin!
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {orders.map((order) => (
                <div key={order.id} className="py-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={order.productImage}
                        alt={order.productTitle}
                        className="w-12 h-12 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{order.orderNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
                            {order.merchantId.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-200 mt-0.5">{order.productTitle}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Delivering to: <strong className="text-zinc-200">{order.buyerAddress.city}</strong> • AWB: <strong className="font-mono text-blue-400">{order.awbTrackingNumber}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Amount Paid</span>
                      <span className="text-base font-black text-white">₹{order.effectivePricePaid.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        Saved ₹{order.totalSavings.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Escrow Status & Dynamic Matching / Refund Banner */}
                  {order.status === 'MATCHING_CARDHOLDER' ? (
                    <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-2xl space-y-2 animate-pulse">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span className="font-semibold text-amber-300">
                            Broadcasting Request to Eligible Cardholders Network...
                          </span>
                        </div>
                        <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded text-amber-300 border border-amber-400/20">
                          Attempt {order.attemptCount} of {order.maxAttempts}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Required Card: <strong className="text-white">{order.requiredBank}</strong> • Your ₹{order.effectivePricePaid.toLocaleString('en-IN')} is 100% secured in Escrow. If no cardholder accepts or all 4 attempts decline, 100% of your funds are automatically refunded.
                      </p>
                    </div>
                  ) : order.status === 'ORDER_PLACING' ? (
                    <div className="bg-[#2997ff]/10 border border-[#2997ff]/30 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#2997ff]" />
                          <span className="font-semibold text-white">
                            Cardholder Found! Swiping with {order.partnerName}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded text-[#2997ff] border border-blue-500/20">
                          ORDER PLACING
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Card in use: <strong className="text-white font-mono">{order.partnerCardUsed}</strong>. The cardholder is booking the order directly to your shipping address on {order.merchantId.toUpperCase()}.
                      </p>
                    </div>
                  ) : order.status === 'REFUNDED' ? (
                    <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-rose-400" />
                          <span className="font-semibold text-rose-300">
                            100% Refund Executed & Returned
                          </span>
                        </div>
                        <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded text-rose-400 border border-rose-500/20">
                          REFUND COMPLETED
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        {order.failureReason || `All ${order.maxAttempts} cardholder attempts declined.`} Ref: <strong className="text-white font-mono">{order.refundRef || 'RFND_AUTO'}</strong>. 100% of ₹{order.effectivePricePaid.toLocaleString('en-IN')} was returned with zero deduction.
                      </p>
                    </div>
                  ) : (
                    /* Standard Escrow Status Progress Bar */
                    <div className="bg-zinc-950/70 p-3.5 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400">Escrow Security State:</span>
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[11px]">
                          {order.status}
                        </span>
                      </div>

                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#34d399]"
                          style={{
                            width:
                              order.status === 'MERCHANT_CONFIRMED'
                                ? '50%'
                                : order.status === 'DISPATCHED'
                                ? '75%'
                                : '100%',
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-1">
                        <span>1. Escrow Deposited</span>
                        <span>2. Card Swiped</span>
                        <span>3. Courier Dispatched</span>
                        <span>4. Delivered & Settled</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dynamic Price Drop Alert Modal (Zero Friction UX) */}
      {isPriceAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsPriceAlertOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-xl bg-zinc-900 border border-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-[#2997ff]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Price Drop Tracker
                </h3>
                <p className="text-xs text-[#86868b]">Continuous multi-store monitoring across 5 storefronts.</p>
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-2xl border border-white/5 flex items-center gap-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-12 h-12 object-contain bg-zinc-900 rounded-xl p-1 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white truncate">{selectedProduct.title}</h4>
                <p className="text-[11px] text-[#86868b] mt-0.5">
                  Current Best: <strong className="text-white">₹{bestDeal?.partnerFinalEffectivePrice.toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-white">Target Alert Price (₹)</label>
              <input
                type="number"
                placeholder={`e.g. ${Math.round((bestDeal?.partnerFinalEffectivePrice || 50000) * 0.95)}`}
                value={alertTargetPrice || ''}
                onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                className="w-full bg-black/60 text-white text-sm p-3.5 rounded-2xl border border-white/10 font-mono focus:outline-none focus:border-[#0071e3]/60 focus:ring-2 focus:ring-[#0071e3]/20"
              />

              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="text-[#86868b]">Quick:</span>
                {[
                  { label: '−₹2,000', amount: (bestDeal?.partnerFinalEffectivePrice || 50000) - 2000 },
                  { label: '−₹5,000', amount: (bestDeal?.partnerFinalEffectivePrice || 50000) - 5000 },
                  { label: '10% Drop', amount: Math.round((bestDeal?.partnerFinalEffectivePrice || 50000) * 0.9) },
                ].map((target, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAlertTargetPrice(target.amount)}
                    className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/5 font-mono text-[10px] transition"
                  >
                    {target.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsPriceAlertOpen(false)}
                className="apple-pill-btn-secondary w-1/2 text-xs py-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPriceAlertOpen(false);
                  showCartNotice(`Price alert set at ₹${(alertTargetPrice || (bestDeal?.partnerFinalEffectivePrice || 0) - 2000).toLocaleString('en-IN')}! We will notify you instantly.`);
                }}
                className="apple-pill-btn w-1/2 text-xs py-3"
              >
                Activate Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
