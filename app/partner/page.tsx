'use client';

import React, { useState } from 'react';
import { useCompareCart } from '../../src/lib/store';
import { Navbar } from '../../src/components/Navbar';
import { PartnerPortal } from '../../src/components/PartnerPortal';
import { RoleGuard } from '../../src/modules/shared/RoleGuard';
import { ArchitectureModal } from '../../src/components/ArchitectureModal';
import { ShieldCheck } from 'lucide-react';

export default function PartnerPortalPage() {
  const { metrics } = useCompareCart();
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col luxury-mesh-bg text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar
        currentPortal="partner"
        metrics={metrics}
        onOpenArchModal={() => setIsArchModalOpen(true)}
      />

      <RoleGuard
        allowedRoles={['partner', 'admin']}
        portalName="Card Partner Operations & FRM Risk Console"
        requiredRoleTitle="Cardholder Partner"
      >
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <PartnerPortal />
        </main>
      </RoleGuard>

      <footer className="bg-zinc-950/80 border-t border-white/[0.08] py-8 mt-16 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-white tracking-wide">CompareCart Black Edition</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400">Endpoint: /partner (Cardholder Liquidity Pool)</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsArchModalOpen(true)} className="text-zinc-400 hover:text-white transition underline">
              Architecture & Scalability
            </button>
            <span className="text-zinc-700">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> RBI Nodal Bank Settlement
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
