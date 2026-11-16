'use client';

import React, { useState } from 'react';
import { useCompareCart } from '../../../src/lib/store';
import { Navbar } from '../../../src/components/Navbar';
import { PartnerOnboardingWizard } from '../../../src/modules/partner/components/PartnerOnboardingWizard';
import { Logo } from '../../../src/components/Logo';
import { ShieldCheck } from 'lucide-react';

export default function PartnerOnboardPage() {
  const { metrics } = useCompareCart();

  return (
    <div className="min-h-screen flex flex-col luxury-mesh-bg text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar
        currentPortal="partner"
        metrics={metrics}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <PartnerOnboardingWizard />
      </main>

      <footer className="bg-zinc-950/80 border-t border-white/[0.08] py-8 mt-16 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" href="/partner" />
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400">Cardholder KYC & Bureau Verification</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Karza & CIBIL Bureau Certified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
