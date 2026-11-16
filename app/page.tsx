'use client';

import React, { useState } from 'react';
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
  Sun,
  Moon,
  Lock,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../src/lib/theme';
import { Logo } from '../src/components/Logo';

export default function EnterprisePortalGateway() {
  const router = useRouter();
  const { currentProfile, isAuthenticated, logout, openAuthModal } = useCompareCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col luxury-mesh-bg text-[#f5f5f7] font-sans selection:bg-[#0071e3] selection:text-white">
      {/* Apple Minimalist Top Header */}
      <header className="sticky top-0 z-40 bg-black/75 backdrop-blur-3xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
              Enterprise v2.4
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Day / Night Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1c1c1e]/80 hover:bg-[#2c2c2e] border border-white/10 transition text-zinc-300 hover:text-white"
              title={theme === 'dark' ? 'Switch to Day Mode (Golden Yellow & Light Grey)' : 'Switch to Night Mode (Space Black)'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-amber-300 font-medium">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] text-zinc-700 font-medium">Night</span>
                </>
              )}
            </button>

            {/* Live Auth Status / Action Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-[#1c1c1e]/80 border border-white/10 rounded-full px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-zinc-200 font-medium truncate max-w-[120px]">
                  {currentProfile.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                  {currentProfile.role}
                </span>
                <button
                  onClick={logout}
                  className="text-[10px] text-zinc-400 hover:text-red-400 ml-1 transition flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('user', 'signin')}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('user', 'register')}
                  className="apple-pill-btn text-xs px-3.5 py-1.5 font-medium flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section (Apple Keynote Style) */}
      <header className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[#86868b] text-xs font-medium mb-6">
          <span className="text-white font-semibold">CompareCart</span>
          <span>•</span>
          <span className="text-[#2997ff]">Real-Time Price & Card Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.08]">
          Lowest Price Guaranteed. <br />
          <span className="text-[#86868b]">Card Discounts Unlocked.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#86868b] max-w-xl mx-auto mt-4 leading-relaxed font-normal">
          Compare live prices across Flipkart, Amazon, Croma, Reliance Digital & Vijay Sales. Save up to 15% extra by unlocking partner credit card offers with 100% escrow protection.
        </p>

        {/* Active Session Pill or Guest Action Banner */}
        {isAuthenticated ? (
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 pl-3 bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-full border border-white/10 text-xs shadow-xl animate-fade-in">
            <span className="text-[#86868b] text-[11px]">Active session:</span>
            <div className="flex items-center gap-2">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-white font-medium">{currentProfile.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white uppercase font-semibold">
                {currentProfile.role}
              </span>
            </div>
            <Link
              href={`/${currentProfile.role}`}
              className="apple-pill-btn text-xs px-3.5 py-1 flex items-center gap-1"
            >
              <span>Resume Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 inline-flex items-center gap-2.5 p-1.5 pl-3.5 pr-2 bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-full border border-white/10 text-xs shadow-xl animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-zinc-300 text-xs">Access CompareCart Gateway:</span>
            <button
              onClick={() => openAuthModal('user', 'signin')}
              className="px-3 py-1 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('user', 'register')}
              className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#d4a017]" />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </header>

      {/* 3 Apple-Style Product Workspace Cards */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* 1. CONSUMER PORTAL */}
          <div className="bg-[#161617]/90 rounded-[28px] p-7 border border-white/[0.08] hover:border-[#30d158]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(48,209,88,0.12)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-full bg-white/[0.08] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5 text-[#30d158]" />
                </div>
                <span className="text-[11px] text-[#86868b] font-mono bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/5">
                  /user
                </span>
              </div>

              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#30d158] block mb-1">
                Consumer Suite
              </span>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Shopper & Deals
              </h2>
              <p className="text-xs text-[#86868b] leading-relaxed mt-2">
                Real-time price intelligence across 5 storefronts. Automated cardholder discount splitting for maximum consumer savings.
              </p>

              {/* Persona Tag */}
              <div className="mt-5 p-3 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Rahul"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white truncate">Rahul Deshmukh</p>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Demo Profile</span>
                  </div>
                  <p className="text-[10px] text-[#86868b] truncate">rahul.d@gmail.com • Pass: shopper123</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-5 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />
                  <span>5-Store Ingestion (Flipkart, Amazon, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />
                  <span>Card Discount Splitting Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />
                  <span>2-Sided Escrow Protection via RBI Nodal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158] shrink-0" />
                  <span>Interactive 3D Product Showcase</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] space-y-2">
              {isAuthenticated && currentProfile.role === 'user' ? (
                <Link
                  href="/user"
                  className="apple-pill-btn w-full text-xs py-3 px-4 flex items-center justify-center gap-2"
                >
                  <span>Enter Consumer Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('user', 'signin')}
                  className="apple-pill-btn w-full text-xs py-3 px-4 flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In as Shopper</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => openAuthModal('user', 'register')}
                className="apple-pill-btn-secondary w-full text-[11px] py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#30d158]" />
                <span>Create Shopper Account (Sign Up)</span>
              </button>
            </div>
          </div>

          {/* 2. CARD PARTNER PORTAL */}
          <div className="bg-[#161617]/90 rounded-[28px] p-7 border border-white/[0.08] hover:border-[#2997ff]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(41,151,255,0.12)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-full bg-white/[0.08] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-[#2997ff]" />
                </div>
                <span className="text-[11px] text-[#86868b] font-mono bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/5">
                  /partner
                </span>
              </div>

              <span className="text-[11px] uppercase font-semibold tracking-wider text-[#2997ff] block mb-1">
                Liquidity Pool
              </span>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Card Partner Terminal
              </h2>
              <p className="text-xs text-[#86868b] leading-relaxed mt-2">
                Manage credit allocations, execute real-time shopper order swipes, and earn guaranteed nodal bank settlements.
              </p>

              {/* Persona Tag */}
              <div className="mt-5 p-3 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Vikram"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white truncate">Vikramaditya Rao</p>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Demo Profile</span>
                  </div>
                  <p className="text-[10px] text-[#86868b] truncate">vikram.rao@fintech.in • Pass: partner123</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-5 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                  <span>Card Portfolio & Limit Allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                  <span>Live Swipe Queue with Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                  <span>18% Net Facilitation + Reward Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                  <span>Automated Bureau KYC & FRM Assessment</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] space-y-2">
              {isAuthenticated && currentProfile.role === 'partner' ? (
                <Link
                  href="/partner"
                  className="apple-pill-btn w-full text-xs py-3 px-4 flex items-center justify-center gap-2"
                >
                  <span>Enter Partner Terminal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('partner', 'signin')}
                  className="apple-pill-btn w-full text-xs py-3 px-4 flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In as Card Partner</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('partner', 'register')}
                  className="apple-pill-btn-secondary text-[11px] py-2 px-2.5 flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#2997ff]" />
                  <span>Register Partner</span>
                </button>

                <Link
                  href="/partner/onboard"
                  className="apple-pill-btn-secondary text-[11px] py-2 px-2.5 flex items-center justify-center gap-1"
                >
                  <FileCheck2 className="w-3 h-3 text-[#2997ff]" />
                  <span>KYC Wizard</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. SUPER ADMIN SUITE */}
          <div className="bg-[#161617]/90 rounded-[28px] p-7 border border-white/[0.08] hover:border-amber-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(251,191,36,0.12)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 rounded-full bg-white/[0.08] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[11px] text-[#86868b] font-mono bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/5">
                  /admin
                </span>
              </div>

              <span className="text-[11px] uppercase font-semibold tracking-wider text-amber-400 block mb-1">
                Central Governance
              </span>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Super Admin Suite
              </h2>
              <p className="text-xs text-[#86868b] leading-relaxed mt-2">
                Master command: review cardholder KYC requests, govern platform risk parameters, and inspect ledgers.
              </p>

              {/* Persona Tag */}
              <div className="mt-5 p-3 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                  alt="Dr. Arvind"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white truncate">Dr. Arvind Swaminathan</p>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">Demo Profile</span>
                  </div>
                  <p className="text-[10px] text-[#86868b] truncate">arvind.admin@comparecart.in • Pass: admin123</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-5 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Cardholder Onboarding Approvals Deck</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Global FRM Velocity & Daily GMV Controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Customer & Escrow Master Ledgers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Universal Role Switching & Inspection</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] space-y-2">
              {isAuthenticated && currentProfile.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 text-black font-semibold rounded-full text-xs py-3 px-4 flex items-center justify-center gap-2 w-full transition shadow-[0_2px_12px_rgba(245,158,11,0.25)] active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Enter Super Admin Suite</span>
                  <ChevronRight className="w-3.5 h-3.5 text-black" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('admin', 'signin')}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 text-black font-semibold rounded-full text-xs py-3 px-4 flex items-center justify-center gap-2 w-full transition shadow-[0_2px_12px_rgba(245,158,11,0.25)] active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4 text-black" />
                  <span>Sign In to Admin Vault</span>
                  <ChevronRight className="w-3.5 h-3.5 text-black" />
                </button>
              )}

              <p className="text-[10px] text-center text-zinc-500 font-mono py-1">
                Cryptographic vault access restricted to authorized admins
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Apple Minimal Footer */}
      <footer className="bg-black border-t border-white/[0.08] py-8 text-xs text-[#86868b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#30d158] font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RBI Nodal Escrow Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}