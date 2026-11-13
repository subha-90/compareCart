'use client';

import React from 'react';
import { ShoppingBag, CreditCard, ShieldCheck, Zap, Layers, Sparkles, Activity } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      {/* Live Market Ribbon */}
      <div className="bg-zinc-950 text-zinc-400 text-[11px] py-1.5 px-4 font-mono tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE COMMERCE ENGINE
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-zinc-300">
              Flipkart, Amazon & Croma Active
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="hidden md:inline text-zinc-300">
              Deals Verified Today: <strong className="text-white">{metrics.totalOrdersProcessed.toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400 hidden sm:inline">
              Engine Latency: <strong className="text-emerald-400">{metrics.avgComputeLatencyMs}ms</strong>
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <button
              onClick={onOpenArchModal}
              className="text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-0.5 rounded border border-zinc-700/80 transition text-[11px]"
            >
              System Specs
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentTab('shopper')}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm ring-1 ring-zinc-800">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-zinc-900">
                  Compare<span className="text-emerald-600">Cart</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium -mt-0.5">
                Price Intelligence & Partner Card Network
              </p>
            </div>
          </div>

          {/* Core App Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setCurrentTab('shopper')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                currentTab === 'shopper'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Price Matrix</span>
            </button>

            <button
              onClick={() => setCurrentTab('partner')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                currentTab === 'partner'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              <span>Partner Cards</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </button>

            <button
              onClick={() => setCurrentTab('escrow')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                currentTab === 'escrow'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Escrow Ledger</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
