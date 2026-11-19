'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useCompareCart } from '../lib/store';
import { PortalRole } from '../types';
import { SignInTab } from './auth/SignInTab';
import { RegisterTab } from './auth/RegisterTab';
import { ForgotPasswordTab } from './auth/ForgotPasswordTab';

export interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultRole?: 'user' | 'partner' | 'admin';
  defaultTab?: 'signin' | 'register' | 'forgot_password';
  onSuccess?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultRole: propDefaultRole,
  defaultTab: propDefaultTab,
  onSuccess: propOnSuccess,
}) => {
  const router = useRouter();
  const { authModal, closeAuthModal } = useCompareCart();

  const isModalOpen = propIsOpen !== undefined ? propIsOpen : authModal.isOpen;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    closeAuthModal();
  };

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot_password'>(
    propDefaultTab || authModal.tab || 'signin'
  );
  const [selectedPortal, setSelectedPortal] = useState<PortalRole>(
    propDefaultRole || authModal.portal || 'user'
  );
  const [resetIdentifierPrefill, setResetIdentifierPrefill] = useState('');

  // Prefetch portal routes for instantaneous transitions
  useEffect(() => {
    router.prefetch('/user');
    router.prefetch('/partner');
    router.prefetch('/admin');
  }, [router]);

  // Sync selected portal and tab when authModal opens
  useEffect(() => {
    if (authModal.isOpen) {
      const targetPortal = propDefaultRole || authModal.portal || 'user';
      setSelectedPortal(targetPortal);
      if (authModal.tab) {
        setActiveTab(authModal.tab);
      }
    }
  }, [authModal.isOpen, authModal.portal, authModal.tab, propDefaultRole]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl animate-fade-in overflow-y-auto cursor-pointer"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col auth-modal-card bg-white dark:bg-[#15161c] border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden text-[#101936] dark:text-white my-auto cursor-default transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="shrink-0 p-4 sm:p-5 sm:pb-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#d4a017]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101936] dark:text-white tracking-tight flex items-center gap-2">
                CompareCart Authentication
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                  256-Bit SSL
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Universal Access for Shoppers, Card Partners & Vault Ops</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        {activeTab !== 'forgot_password' && (
          <div className="shrink-0 p-2 bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-white/10 flex gap-1">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-950 shadow-sm font-extrabold dark:bg-amber-400 dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white'
              }`}
            >
              Sign In (Email / Mobile / User ID)
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-slate-950 shadow-sm font-extrabold dark:bg-amber-400 dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-500" />
              <span>Sign Up (New User)</span>
            </button>
          </div>
        )}

        {/* Modular Tab Content */}
        {activeTab === 'signin' && (
          <SignInTab
            selectedPortal={selectedPortal}
            onSelectPortal={setSelectedPortal}
            onSwitchToRegister={() => setActiveTab('register')}
            onSwitchToForgotPassword={(id) => {
              setResetIdentifierPrefill(id);
              setActiveTab('forgot_password');
            }}
            onClose={handleClose}
            onSuccess={propOnSuccess}
          />
        )}

        {activeTab === 'register' && (
          <RegisterTab
            initialRole={selectedPortal === 'partner' ? 'partner' : 'user'}
            onClose={handleClose}
            onSwitchToSignIn={() => setActiveTab('signin')}
          />
        )}

        {activeTab === 'forgot_password' && (
          <ForgotPasswordTab
            initialIdentifier={resetIdentifierPrefill}
            onSwitchToSignIn={() => setActiveTab('signin')}
          />
        )}

        {/* Modal Footer Note */}
        <div className="shrink-0 p-3 bg-slate-100 border-t border-slate-200 dark:bg-zinc-900/90 dark:border-white/10 text-center text-[11px] text-slate-700 dark:text-zinc-300 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>CompareCart Dual-Key Authentication • Multi-Channel Mobile & Email Security</span>
        </div>
      </div>
    </div>
  );
};
