'use client';

import React from 'react';
import { Lock, ShieldCheck, Zap } from 'lucide-react';

interface EscrowPaymentStepProps {
  amount: number;
  isProcessing: boolean;
  paymentError: string | null;
  onPayRazorpay: () => void;
  onSimulateSandbox: () => void;
}

export const EscrowPaymentStep: React.FC<EscrowPaymentStepProps> = ({
  amount,
  isProcessing,
  paymentError,
  onPayRazorpay,
  onSimulateSandbox,
}) => {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-slate-50 dark:bg-black/60 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-[#30d158] font-mono uppercase tracking-wider font-bold">
          <Lock className="w-3.5 h-3.5" /> RBI-Compliant Escrow Account
        </div>
        <div className="text-3xl font-extrabold text-slate-950 dark:text-white">
          ₹{amount.toLocaleString('en-IN')}
        </div>
        <p className="text-[11px] text-slate-600 dark:text-[#86868b] max-w-xs mx-auto font-medium">
          Payment is locked in CompareCart's neutral escrow vault and released to the cardholder only after order delivery.
        </p>

        {/* Razorpay Trust Badge & Accepted Rails */}
        <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] p-3 rounded-2xl max-w-sm mx-auto space-y-2 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Razorpay Secure Checkout</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-[#2997ff] border border-blue-500/20 font-mono font-bold">
              TEST SANDBOX
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-[#86868b] font-mono">
            <span>UPI (GPay / PhonePe / Paytm)</span> • <span>Cards</span> • <span>NetBanking</span>
          </div>
        </div>

        {paymentError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 text-left">
            {paymentError}
          </div>
        )}

        <button
          disabled={isProcessing}
          onClick={onPayRazorpay}
          className="cc-gradient-btn w-full py-3.5 flex items-center justify-center gap-2 text-xs font-bold text-white shadow-glow-blue disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Opening Razorpay Gateway...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Pay ₹{amount.toLocaleString('en-IN')} via Razorpay / UPI</span>
            </>
          )}
        </button>

        <button
          disabled={isProcessing}
          onClick={onSimulateSandbox}
          className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-white/[0.06] dark:text-zinc-400 dark:border-transparent dark:hover:text-white flex items-center justify-center gap-1.5 text-[11px] font-semibold transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>⚡ Instant Sandbox Simulation (Bypass Popup)</span>
        </button>
      </div>
    </div>
  );
};
