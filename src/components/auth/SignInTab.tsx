'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useCompareCart } from '../../lib/store';
import { PortalRole } from '../../types';

interface SignInTabProps {
  selectedPortal: PortalRole;
  onSelectPortal: (portal: PortalRole) => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: (prefilledIdentifier: string) => void;
  onClose: () => void;
  onSuccess?: (role: string) => void;
}

export const SignInTab: React.FC<SignInTabProps> = ({
  selectedPortal,
  onSelectPortal,
  onSwitchToRegister,
  onSwitchToForgotPassword,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const { portalCredentials, loginWithIdentifier } = useCompareCart();

  const [identifier, setIdentifier] = useState(portalCredentials[selectedPortal]?.email || '');
  const [password, setPassword] = useState(portalCredentials[selectedPortal]?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string>('');

  const currentCred = portalCredentials[selectedPortal];

  const handleAutofill = (role: PortalRole) => {
    onSelectPortal(role);
    const cred = portalCredentials[role];
    if (cred) {
      setIdentifier(cred.email);
      setPassword(cred.password);
      setLoginError(null);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    const result = loginWithIdentifier(identifier, password, selectedPortal);
    if (result.success) {
      const target = result.targetPortal || selectedPortal;
      const targetName = target === 'admin' ? 'Super Admin Vault' : target === 'partner' ? 'Card Partner Terminal' : 'Consumer Portal';
      setIsRedirecting(true);
      setRedirectTarget(targetName);
      if (onSuccess) onSuccess(target);

      router.push(`/${target}`);

      setTimeout(() => {
        onClose();
        setIsLoading(false);
        setIsRedirecting(false);
      }, 700);
    } else {
      setIsLoading(false);
      setLoginError(result.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
      {/* Target Portal Filter Pills */}
      <div>
        <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider block mb-2">
          Destination Portal Clearance
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleAutofill('user')}
            className={`p-2.5 rounded-2xl border text-left transition ${
              selectedPortal === 'user'
                ? 'bg-amber-100 border-amber-500 text-amber-950 dark:bg-amber-500/25 dark:border-amber-400 dark:text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 dark:border-white/15 text-slate-700 dark:text-zinc-200'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 mb-1 ${selectedPortal === 'user' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-zinc-400'}`} />
            <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">Shopper</p>
            <p className="text-[10px] text-slate-600 dark:text-zinc-300 mt-0.5">Price &amp; Deals</p>
          </button>

          <button
            type="button"
            onClick={() => handleAutofill('partner')}
            className={`p-2.5 rounded-2xl border text-left transition ${
              selectedPortal === 'partner'
                ? 'bg-purple-100 border-purple-500 text-purple-950 dark:bg-purple-500/25 dark:border-purple-400 dark:text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 dark:border-white/15 text-slate-700 dark:text-zinc-200'
            }`}
          >
            <CreditCard className={`w-4 h-4 mb-1 ${selectedPortal === 'partner' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-zinc-400'}`} />
            <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">Card Partner</p>
            <p className="text-[10px] text-slate-600 dark:text-zinc-300 mt-0.5">Monetize Swipes</p>
          </button>

          <button
            type="button"
            onClick={() => handleAutofill('admin')}
            className={`p-2.5 rounded-2xl border text-left transition ${
              selectedPortal === 'admin'
                ? 'bg-emerald-100 border-emerald-500 text-emerald-950 dark:bg-emerald-500/25 dark:border-emerald-400 dark:text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 dark:border-white/15 text-slate-700 dark:text-zinc-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 mb-1 ${selectedPortal === 'admin' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400'}`} />
            <p className="text-xs font-bold leading-tight text-slate-900 dark:text-white">Admin Vault</p>
            <p className="text-[10px] text-slate-600 dark:text-zinc-300 mt-0.5">Treasury &amp; Risk</p>
          </button>
        </div>
      </div>

      {/* 1-Click Demo Credential Banner */}
      <div className="auth-modal-banner p-3.5 rounded-2xl bg-amber-50 dark:bg-[#1a1c24] border border-amber-300/80 dark:border-amber-500/40 flex items-center justify-between gap-3 shadow-sm">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Demo Credentials for {currentCred.portalName}</span>
          </div>
          <p className="text-[11px] font-mono font-bold text-slate-800 dark:text-amber-300 mt-0.5 truncate">
            {currentCred.email} • {currentCred.password}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAutofill(selectedPortal)}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-xs font-extrabold shrink-0 transition shadow-sm"
        >
          Autofill
        </button>
      </div>

      {loginError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{loginError}</span>
        </div>
      )}

      {/* Universal Sign In Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-white block mb-1.5">
            Username / User ID, Mobile Number, or Email
          </label>
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-zinc-400" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. Username (shopper_rahul), Mobile (+91 98201 44521), or Email"
              className="auth-modal-input w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white dark:bg-[#1f212a] dark:border-white/20 dark:text-white dark:placeholder-zinc-400 dark:focus:border-amber-400 transition font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-white">Password</label>
            <button
              type="button"
              onClick={() => onSwitchToForgotPassword(identifier)}
              className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-bold"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-zinc-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="auth-modal-input w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white dark:bg-[#1f212a] dark:border-white/20 dark:text-white dark:placeholder-zinc-400 dark:focus:border-amber-400 transition font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-slate-100 border-slate-300 dark:bg-zinc-900 dark:border-white/20 text-amber-500 focus:ring-0"
            />
            <span>Keep me signed in for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || isRedirecting}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-80 ${
            isRedirecting
              ? 'bg-emerald-400 text-black shadow-emerald-400/25'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 border border-amber-300/40 shadow-amber-500/20'
          }`}
        >
          {isRedirecting ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Access Granted! Opening {redirectTarget}...</span>
            </>
          ) : isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Verifying Access Rights...</span>
            </>
          ) : (
            <>
              <span>Sign In to {currentCred.portalName}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </>
          )}
        </button>
      </form>

      <div className="pt-1 text-center text-xs text-slate-600 dark:text-zinc-300 font-medium">
        New to CompareCart?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
        >
          Sign Up as Shopper or Card Partner
        </button>
      </div>
    </div>
  );
};
