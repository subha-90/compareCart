'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompareCart } from '../../lib/store';
import { PortalRole } from '../../types';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: ('user' | 'partner' | 'admin')[];
  portalName: string;
  requiredRoleTitle: string;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  portalName,
  requiredRoleTitle,
  children,
}) => {
  const router = useRouter();
  const { currentProfile, logout, isAuthenticated, isMounted, openAuthModal } = useCompareCart();

  // Determine primary intended role for this portal (user first, partner second, admin if admin only)
  const portalKey: PortalRole = allowedRoles.includes('user')
    ? 'user'
    : allowedRoles.includes('partner')
    ? 'partner'
    : 'admin';

  // 0. Wait for client-side hydration mount before evaluating auth state
  if (!isMounted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
      </div>
    );
  }

  // 1. If not authenticated at all, prompt login modal & credentials request
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#161618] backdrop-blur-3xl max-w-lg w-full rounded-[28px] p-8 border border-slate-200 dark:border-white/15 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center relative overflow-hidden animate-fade-in space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
            <span>AUTHENTICATION REQUIRED</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#101936] dark:text-white tracking-tight">
            Sign In to Access {portalName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-md mx-auto font-medium">
            Please log in with your <strong className="text-slate-900 dark:text-white font-semibold">Username / User ID, Mobile Number, or Email</strong> and <strong className="text-slate-900 dark:text-white font-semibold">Password</strong> to access this portal.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={() => openAuthModal(portalKey)}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 border border-amber-300/40"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Sign In with Credentials</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs transition dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white dark:border-white/20 flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Super Admin has universal oversight across all portals as per design specifications
  const isAuthorized = currentProfile.role === 'admin' || allowedRoles.includes(currentProfile.role);

  if (isAuthorized) {
    return <>{children}</>;
  }

  // Designated return portal based on current authenticated role
  const userPortalUrl = currentProfile.role === 'user' ? '/user' : currentProfile.role === 'partner' ? '/partner' : '/admin';
  const userPortalTitle = currentProfile.role === 'user' ? 'Consumer Store' : currentProfile.role === 'partner' ? 'Card Partner Terminal' : 'Admin Suite';

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c1c1e]/98 backdrop-blur-3xl max-w-lg w-full rounded-[28px] p-8 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-mono uppercase tracking-wider font-semibold mb-3">
          <Lock className="w-3 h-3" />
          <span>RBAC ISOLATION • ACCESS DENIED (HTTP 403)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#101936] dark:text-white tracking-tight">
          {portalName}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#86868b] mt-2 leading-relaxed max-w-md mx-auto font-medium">
          Strict role isolation active. This secure portal is strictly reserved for authenticated <strong className="text-slate-900 dark:text-white font-semibold">{requiredRoleTitle}</strong> accounts.
        </p>

        {/* Current Authenticated Identity (Locked Out) */}
        <div className="mt-5 p-3.5 bg-slate-50 dark:bg-black/50 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10"
            />
            <div>
              <p className="text-xs font-semibold text-[#101936] dark:text-white">{currentProfile.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-[#86868b] font-mono capitalize">
                Authenticated As: <span className="text-slate-900 dark:text-white font-medium">{currentProfile.role.toUpperCase()}</span>
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold uppercase">
            Unauthorized
          </span>
        </div>

        {/* Switch Account Option */}
        <div className="mt-4">
          <button
            onClick={() => openAuthModal(portalKey)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-white hover:bg-amber-500/25 transition text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In with {requiredRoleTitle} Account</span>
          </button>
        </div>

        {/* Strict Return Navigation */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <Link
            href={userPortalUrl}
            className="flex-1 py-3 px-4 rounded-full bg-[#101936] hover:bg-[#1B1D27] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#101936] text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4 text-white dark:text-[#101936]" />
            <span>Return to {userPortalTitle}</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="sm:w-auto py-3 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-white/20 text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            <span>Sign Out</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-[#86868b] mt-5 font-mono">
          Security Policy: Enterprise Tripartite Portal Isolation • Incident Logged to Audit Ledger
        </p>
      </div>
    </div>
  );
};
