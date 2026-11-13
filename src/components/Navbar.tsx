'use client';

import React from 'react';
import { ShoppingBag, CreditCard, ShieldCheck, Zap, Activity, Cpu } from 'lucide-react';
import { SystemMetrics } from '../lib/store';

interface NavbarProps {
  currentTab: 'shopper' | 'partner' | 'escrow';
  setCurrentTab: (tab: 'shopper' | 'partner' | 'escrow') => void;
  metrics: SystemMetrics;
  onOpenArchModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  metrics,
  onOpenArchModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* High-Throughput System Real-Time Ticker */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE ENGINE
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span>⚡ Deals Optimized Today: <strong className="text-white">{metrics.totalOrdersProcessed.toLocaleString()}</strong></span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="hidden md:inline">💰 Total Consumer Savings: <strong className="text-emerald-300">₹{(metrics.totalSavingsDelivered / 100000).toFixed(2)} Lakhs</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline text-slate-400">
              Avg Deal Latency: <strong className="text-emerald-300">{metrics.avgComputeLatencyMs}ms</strong>
            </span>
            <span className="hidden sm:inline text-slate-400">
              Cache Hit: <strong className="text-blue-300">{metrics.cacheHitRatio}%</strong>
            </span>
            <button
              onClick={onOpenArchModal}
              className="inline-flex items-center gap-1 text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 transition"
            >
              <Cpu className="w-3 h-3 text-cyan-400" />
              High-Throughput Specs
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('shopper')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">Compare<span className="text-emerald-600">Cart</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Universal Price & Card Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">Universal Price & Partner Card Optimizer</p>
            </div>
          </div>

          {/* Core App Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentTab('shopper')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                currentTab === 'shopper'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Shopper Hub</span>
            </button>

            <button
              onClick={() => setCurrentTab('partner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition relative ${
                currentTab === 'partner'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Partner Cards</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('escrow')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                currentTab === 'escrow'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Escrow Ledger</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
