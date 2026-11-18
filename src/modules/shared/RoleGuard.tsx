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
        <div className="bg-[#141416]/98 backdrop-blur-3xl max-w-lg w-full rounded-[28px] p-8 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden animate-fade-in space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#d4a017]/15 border border-[#d4a017]/30 text-[#d4a017] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
            <span>AUTHENTICATION REQUIRED</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sign In to Access {portalName}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
            Please log in with your <strong>Username / User ID, Mobile Number, or Email</strong> and <strong>Password</strong> to access this portal.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={() => openAuthModal(portalKey)}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#d4a017] to-[#b38312] text-black font-bold text-xs shadow-lg shadow-[#d4a017]/25 hover:from-[#e5b329] hover:to-[#c69415] transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-black" />
              <span>Sign In with Credentials</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition"
            >
              Return to Home
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
      <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl max-w-lg w-full rounded-[28px] p-8 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7 text-red-400" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-wider font-semibold mb-3">
          <Lock className="w-3 h-3" />
          <span>RBAC ISOLATION • ACCESS DENIED (HTTP 403)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          {portalName}
        </h2>

        <p className="text-xs sm:text-sm text-[#86868b] mt-2 leading-relaxed max-w-md mx-auto">
          Strict role isolation active. This secure portal is strictly reserved for authenticated <strong className="text-white font-medium">{requiredRoleTitle}</strong> accounts.
        </p>

        {/* Current Authenticated Identity (Locked Out) */}
        <div className="mt-5 p-3.5 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-semibold text-white">{currentProfile.name}</p>
              <p className="text-[10px] text-[#86868b] font-mono capitalize">
                Authenticated As: <span className="text-white font-medium">{currentProfile.role.toUpperCase()}</span>
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-semibold uppercase">
            Unauthorized
          </span>
        </div>

        {/* Switch Account Option */}
        <div className="mt-4">
          <button
            onClick={() => openAuthModal(portalKey)}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/25 transition text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In with {requiredRoleTitle} Account</span>
          </button>
        </div>

        {/* Strict Return Navigation */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <Link
            href={userPortalUrl}
            className="apple-pill-btn flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span>Return to {userPortalTitle}</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="apple-pill-btn-secondary sm:w-auto py-3 px-5 text-xs flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-[#86868b]" />
            <span>Sign Out</span>
          </button>
        </div>

        <p className="text-[10px] text-[#86868b] mt-5 font-mono">
          Security Policy: Enterprise Tripartite Portal Isolation • Incident Logged to Audit Ledger
        </p>
      </div>
    </div>
  );
};
