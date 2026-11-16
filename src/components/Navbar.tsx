'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ChevronDown,
  Check,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Sliders,
  ExternalLink,
  Sun,
  Moon,
  Lock,
  KeyRound
} from 'lucide-react';
import { SystemMetrics, useCompareCart } from '../lib/store';
import { useTheme } from '../lib/theme';
import { Logo } from './Logo';
import { NotificationCenter } from './NotificationCenter';
import { ThemeToggleCapsule } from './ThemeToggleCapsule';

interface NavbarProps {
  currentPortal?: 'user' | 'partner' | 'admin';
  setCurrentPortal?: (portal: 'user' | 'partner' | 'admin') => void;
  metrics?: SystemMetrics;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal: controlledPortal,
  setCurrentPortal,
  metrics: controlledMetrics,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentProfile,
    switchProfile,
    logout,
    cartItems,
    metrics: storeMetrics,
    isAuthenticated,
    openAuthModal,
  } = useCompareCart();
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking anywhere outside or pressing Escape
  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen]);

  const metrics = controlledMetrics || storeMetrics;

  // Active portal context
  const currentPortal: 'user' | 'partner' | 'admin' = controlledPortal || (
    pathname?.startsWith('/partner') ? 'partner' :
    pathname?.startsWith('/admin') ? 'admin' :
    'user'
  );

  const isAdmin = currentProfile.role === 'admin';

  const handleAdminPortalSwitch = (portal: 'user' | 'partner' | 'admin') => {
    if (!isAdmin) return;
    switchProfile(portal);
    if (setCurrentPortal) {
      setCurrentPortal(portal);
    }
    router.push(`/${portal}`);
    setIsProfileMenuOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setIsProfileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#101116]/90 backdrop-blur-3xl border-b border-[#E8ECF4] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(16,25,54,0.04)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-200">
      {/* Super Admin Inspection Mode Banner */}
      {isAdmin && currentPortal !== 'admin' && (
        <div className="bg-[#1c1c1e]/90 border-b border-amber-500/30 text-amber-300 text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold tracking-wide text-[11px] uppercase">
                ADMIN AUDIT MODE: Inspecting {currentPortal === 'user' ? 'Consumer' : 'Card Partner'} View
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentPortal === 'user' && (
                <button
                  onClick={() => handleAdminPortalSwitch('partner')}
                  className="bg-white/10 hover:bg-white/15 text-white text-[11px] px-3 py-1 rounded-full transition flex items-center gap-1 font-sans"
                >
                  <CreditCard className="w-3 h-3 text-blue-400" />
                  <span>Inspect Partner Portal</span>
                </button>
              )}
              {currentPortal === 'partner' && (
                <button
                  onClick={() => handleAdminPortalSwitch('user')}
                  className="bg-white/10 hover:bg-white/15 text-white text-[11px] px-3 py-1 rounded-full transition flex items-center gap-1 font-sans"
                >
                  <ShoppingBag className="w-3 h-3 text-emerald-400" />
                  <span>Inspect Consumer Portal</span>
                </button>
              )}
              <Link
                href="/admin"
                className="bg-white text-black font-semibold text-[11px] px-3 py-1 rounded-full transition flex items-center gap-1 hover:bg-white/90 font-sans shadow-sm"
              >
                <span>Return to Admin Suite →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Official CompareCart Brand Logo */}
          <div className="flex items-center gap-2.5">
            <Logo size="sm" href={`/${currentProfile.role}`} />
            <span
              className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full ${
                currentProfile.role === 'admin'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  : currentProfile.role === 'partner'
                  ? 'bg-blue-400/10 text-blue-300 border border-blue-400/20'
                  : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
              }`}
            >
              {currentProfile.role === 'admin' ? 'Admin' : currentProfile.role === 'partner' ? 'Partner' : 'Store'}
            </span>
          </div>

          {/* Role-Isolated Portal Navigation Pills */}
          <div className="flex items-center gap-2">
            {/* 1. Shopper Role */}
            {currentProfile.role === 'user' && (
              <nav className="flex items-center gap-1.5 bg-[#1c1c1e]/80 p-1 rounded-full border border-white/[0.08]">
                <Link
                  href="/user"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-black transition shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop</span>
                  {cartItems.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center ml-0.5">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 text-[11px] text-[#86868b] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
                  <span>Escrow Protected</span>
                </div>
              </nav>
            )}

            {/* 2. Card Partner Role */}
            {currentProfile.role === 'partner' && (
              <nav className="flex items-center gap-1.5 bg-[#1c1c1e]/80 p-1 rounded-full border border-white/[0.08]">
                <Link
                  href="/partner"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-black transition shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cards & Swipes</span>
                </Link>
                <Link
                  href="/partner/onboard"
                  className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-[#86868b] hover:text-white transition"
                >
                  <span>KYC Onboarding</span>
                </Link>
              </nav>
            )}

            {/* 3. Super Admin Role */}
            {currentProfile.role === 'admin' && (
              <nav className="flex items-center gap-1.5 bg-[#1c1c1e]/80 p-1 rounded-full border border-white/[0.08]">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-white text-black transition shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Central Governance</span>
                </Link>
              </nav>
            )}

            {/* Real-World Notification Center Bell */}
            <NotificationCenter />

            {/* CompareCart Light / Dark Capsule Toggle */}
            <ThemeToggleCapsule size="sm" />

            {/* Authentication: Profile Pill or Sign In CTA */}
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-[#1c1c1e]/90 hover:bg-slate-200 dark:hover:bg-[#2c2c2e] p-1 pr-2.5 rounded-full border border-slate-200 dark:border-white/10 transition"
                >
                  <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-[12px] font-semibold text-[#101936] dark:text-white hidden md:inline">
                    {currentProfile.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500 dark:text-[#86868b]" />
                </button>

                {/* Apple-style Action Sheet Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-3xl rounded-2xl border border-slate-200 dark:border-white/15 shadow-[0_20px_50px_rgba(16,25,54,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-50 animate-fade-in space-y-1 text-[#101936] dark:text-white">
                    {/* Identity */}
                    <div className="p-2.5 border-b border-slate-200 dark:border-white/[0.08]">
                      <p className="text-xs font-semibold text-[#101936] dark:text-white">{currentProfile.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-[#86868b]">{currentProfile.email}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[#101936] dark:text-white font-medium uppercase">
                          {currentProfile.role}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-[#86868b]">{currentProfile.city}</span>
                      </div>
                    </div>

                    {/* Switch / Log In with Credentials */}
                    <div className="py-1 border-b border-slate-200 dark:border-white/[0.08]">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          openAuthModal(currentPortal);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-[#2864FF] hover:bg-[#2864FF]/10 transition font-medium"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Switch Portal / Credentials</span>
                      </button>
                    </div>

                    {/* Admin Perspective Switching */}
                    {isAdmin ? (
                      <div className="pt-1 border-b border-slate-200 dark:border-white/[0.08] pb-1">
                        <span className="text-[10px] text-slate-400 dark:text-[#86868b] uppercase font-semibold tracking-wider px-2 block mb-1">
                          Perspective Switching
                        </span>

                        <button
                          onClick={() => handleAdminPortalSwitch('user')}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition ${
                            currentPortal === 'user' ? 'bg-[#2864FF]/10 text-[#2864FF] font-semibold dark:bg-white/10 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-600 dark:text-[#86868b]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Consumer Portal</span>
                          </div>
                          {currentPortal === 'user' && <Check className="w-3.5 h-3.5 text-[#2864FF] dark:text-white" />}
                        </button>

                        <button
                          onClick={() => handleAdminPortalSwitch('partner')}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition ${
                            currentPortal === 'partner' ? 'bg-[#2864FF]/10 text-[#2864FF] font-semibold dark:bg-white/10 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-600 dark:text-[#86868b]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-[#2864FF]" />
                            <span>Card Partner Portal</span>
                          </div>
                          {currentPortal === 'partner' && <Check className="w-3.5 h-3.5 text-[#2864FF] dark:text-white" />}
                        </button>

                        <button
                          onClick={() => handleAdminPortalSwitch('admin')}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition ${
                            currentPortal === 'admin' ? 'bg-[#2864FF]/10 text-[#2864FF] font-semibold dark:bg-white/10 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-600 dark:text-[#86868b]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                            <span>Super Admin Suite</span>
                          </div>
                          {currentPortal === 'admin' && <Check className="w-3.5 h-3.5 text-[#2864FF] dark:text-white" />}
                        </button>
                      </div>
                    ) : (
                      <div className="py-1.5 border-b border-slate-200 dark:border-white/[0.08] px-2 text-[11px] text-slate-500 dark:text-[#86868b]">
                        {currentProfile.role === 'user' ? (
                          <p>Universal Price Comparison & Cart Escrow</p>
                        ) : (
                          <p>Cardholder Liquidity Pool & Instant Nodal Settlement</p>
                        )}
                      </div>
                    )}

                    {/* Sign Out */}
                    <div className="pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal(currentPortal)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold cc-gradient-btn text-white transition shadow-glow-blue"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};