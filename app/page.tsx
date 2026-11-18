'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompareCart } from '../src/lib/store';
import {
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ChevronRight,
  Lock,
  Sparkles,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { Logo } from '../src/components/Logo';
import { ThemeToggleCapsule } from '../src/components/ThemeToggleCapsule';

export default function EnterprisePortalGateway() {
  const router = useRouter();
  const { currentProfile, isAuthenticated, logout, openAuthModal } = useCompareCart();

  return (
    <div className="min-h-screen flex flex-col luxury-mesh-bg text-[#101936] dark:text-[#f5f5f7] font-sans selection:bg-[#2864FF] selection:text-white transition-colors duration-200">
      {/* Modern Top Header */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#101116]/85 backdrop-blur-3xl border-b border-[#E8ECF4] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(16,25,54,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/5">
              Enterprise v2.4
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* CompareCart Light / Dark Capsule Toggle */}
            <ThemeToggleCapsule size="sm" />

            {/* Live Auth Status / Action Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1c1c1e]/80 border border-slate-200 dark:border-white/10 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-800 dark:text-zinc-200 font-semibold truncate max-w-[120px]">
                  {currentProfile.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-slate-700 dark:text-zinc-300 font-medium">
                  {currentProfile.role}
                </span>
                <button
                  onClick={logout}
                  className="text-[11px] text-slate-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 ml-1 transition flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('user', 'signin')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-[#101936] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('user', 'register')}
                  className="cc-gradient-btn text-xs px-4 py-1.5 font-semibold flex items-center gap-1.5 shadow-glow-blue"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2864FF]/10 border border-[#2864FF]/20 text-xs font-semibold text-[#2864FF] dark:text-blue-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CompareCart • Real-Time Price &amp; Card Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]">
          Lowest Price Guaranteed. <br />
          <span className="cc-gradient-text">Card Discounts Unlocked.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-4 leading-relaxed font-medium">
          Compare live prices across Flipkart, Amazon, Croma, Reliance Digital &amp; Vijay Sales. Save up to 15% extra by unlocking partner credit card offers with 100% escrow protection.
        </p>

        {/* Active Session Pill or Guest Action Banner */}
        {isAuthenticated ? (
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 pl-3.5 pr-2 bg-white dark:bg-[#1B1D27] rounded-full border border-slate-200 dark:border-white/10 text-xs shadow-lg animate-fadeIn">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Active session:</span>
            <div className="flex items-center gap-2">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-bold">{currentProfile.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 uppercase font-semibold">
                {currentProfile.role}
              </span>
            </div>
            <Link
              href={`/${currentProfile.role}`}
              className="cc-gradient-btn text-xs px-4 py-1.5 flex items-center gap-1 shadow-glow-blue ml-2"
            >
              <span>Resume Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 inline-flex items-center gap-2.5 p-1.5 pl-4 pr-2 bg-white dark:bg-[#1B1D27] rounded-full border border-slate-200 dark:border-white/10 text-xs shadow-lg animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">Access CompareCart Gateway:</span>
            <button
              onClick={() => openAuthModal('user', 'signin')}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/20 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('user', 'register')}
              className="px-3.5 py-1.5 rounded-full cc-gradient-btn text-white text-xs font-semibold transition flex items-center gap-1 shadow-glow-blue"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </header>

      {/* 3 Product Workspace Cards */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* 1. CONSUMER PORTAL */}
          <div className="bg-white dark:bg-[#1B1D27] rounded-[32px] p-7 border border-[#E8ECF4] dark:border-white/10 hover:border-[#2864FF]/40 shadow-soft hover:shadow-glow-blue transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#2864FF]/10 text-[#2864FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/5">
                  /user
                </span>
              </div>

              <span className="text-[11px] uppercase font-bold tracking-wider text-[#2864FF] block mb-1">
                Consumer Suite
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Shopper &amp; Deals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                Real-time price intelligence across 5 storefronts. Automated cardholder discount splitting for maximum consumer savings.
              </p>

              {/* Persona Tag */}
              <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Rahul"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold truncate">Rahul Deshmukh</p>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Demo Profile</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">rahul.d@gmail.com • Pass: shopper123</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>5-Store Ingestion (Flipkart, Amazon, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Card Discount Splitting Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>2-Sided Escrow Protection via RBI Nodal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Clean Apple &amp; Klarna Experience</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
              <Link
                href="/user"
                className="w-full py-3 rounded-full cc-gradient-btn text-white text-xs font-semibold shadow-glow-blue flex items-center justify-center gap-2 transition"
              >
                <span>Enter Consumer Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. CARD PARTNER PORTAL */}
          <div className="bg-white dark:bg-[#1B1D27] rounded-[32px] p-7 border border-[#E8ECF4] dark:border-white/10 hover:border-[#7047F5]/40 shadow-soft hover:shadow-glow-purple transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#7047F5]/10 text-[#7047F5] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/5">
                  /partner
                </span>
              </div>

              <span className="text-[11px] uppercase font-bold tracking-wider text-[#7047F5] block mb-1">
                Liquidity Pool
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Card Partner Terminal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                Manage credit allocations, execute real-time shopper order swipes, and earn guaranteed 10% platform rewards.
              </p>

              {/* Persona Tag */}
              <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Vikram"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold truncate">Vikramaditya Rao</p>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Demo Profile</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">vikram.rao@fintech.in • Pass: partner123</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7047F5] shrink-0" />
                  <span>Card Portfolio &amp; Limit Allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7047F5] shrink-0" />
                  <span>Live Swipe Queue with Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7047F5] shrink-0" />
                  <span>10% Platform Rewards on Buyer Savings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7047F5] shrink-0" />
                  <span>Automated Bureau KYC &amp; FRM Assessment</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
              <Link
                href="/partner"
                className="w-full py-3 rounded-full bg-[#101936] hover:bg-[#1B1D27] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#101936] text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition"
              >
                <span>Enter Partner Terminal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. SUPER ADMIN SUITE */}
          <div className="bg-white dark:bg-[#1B1D27] rounded-[32px] p-7 border border-[#E8ECF4] dark:border-white/10 hover:border-amber-400/40 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/5">
                  /admin
                </span>
              </div>

              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-500 block mb-1">
                Central Governance
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Super Admin Suite
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-medium">
                Master command: review cardholder KYC requests, govern platform risk parameters, and inspect ledgers.
              </p>

              {/* Persona Tag */}
              <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                  SS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold truncate text-[#101936] dark:text-white">Subhashree Mohan Swain</p>
                    <span className="text-[9px] font-mono text-amber-500 uppercase font-semibold">Super Admin</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">subhashree.admin@comparecart.in • Pass: Subhashree@Admin2026!</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Cardholder Onboarding Approvals Deck</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Global FRM Velocity &amp; Daily GMV Controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Customer &amp; Escrow Master Ledgers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Universal Role Switching &amp; Inspection</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
              <Link
                href="/admin"
                className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Super Admin Suite</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Clean Footer */}
      <footer className="bg-white dark:bg-[#101116] border-t border-[#E8ECF4] dark:border-white/[0.08] py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> RBI Nodal Escrow Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
