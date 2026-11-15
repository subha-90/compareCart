'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompareCart } from '../../src/lib/store';
import { Navbar } from '../../src/components/Navbar';
import { AdminPortal } from '../../src/components/AdminPortal';
import { RoleGuard } from '../../src/modules/shared/RoleGuard';
import { ArchitectureModal } from '../../src/components/ArchitectureModal';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminPortalPage() {
  const router = useRouter();
  const { metrics, switchProfile } = useCompareCart();
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSwitchRole = (role: 'user' | 'partner' | 'admin') => {
    switchProfile(role);
    router.push(`/${role}`);
  };

  const handleClearCache = () => {
    setNotification('System in-memory price caches and crawler sessions purged.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col luxury-mesh-bg text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar
        currentPortal="admin"
        metrics={metrics}
        onOpenArchModal={() => setIsArchModalOpen(true)}
      />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950/95 backdrop-blur-xl text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <RoleGuard
        allowedRoles={['admin']}
        portalName="Super Admin Master Control & FRM Operations Suite"
        requiredRoleTitle="Super Admin"
      >
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <AdminPortal
            onSwitchRole={handleSwitchRole}
            onClearCache={handleClearCache}
          />
        </main>
      </RoleGuard>

      <footer className="bg-zinc-950/80 border-t border-white/[0.08] py-8 mt-16 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-white tracking-wide">CompareCart Black Edition</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400">Endpoint: /admin (Super Admin Master Control)</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsArchModalOpen(true)} className="text-zinc-400 hover:text-white transition underline">
              Architecture & Scalability
            </button>
            <span className="text-zinc-700">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Full Audit Trail Logged
            </span>
          </div>
        </div>
      </footer>

      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </div>
  );
}
