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
    <div className="min-h-screen flex flex-col luxury-mesh-bg text-[#101936] dark:text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black transition-colors duration-200">
      <Navbar
        currentPortal="partner"
        metrics={metrics}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <PartnerOnboardingWizard />
      </main>

      <footer className="bg-white/90 dark:bg-zinc-950/80 border-t border-slate-200 dark:border-white/[0.08] py-8 mt-16 text-xs text-slate-500 dark:text-zinc-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" href="/partner" />
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="text-slate-600 dark:text-zinc-400">Cardholder KYC &amp; Bureau Verification</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Karza &amp; CIBIL Bureau Certified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
