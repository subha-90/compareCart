'use client';

import React from 'react';
import { UserCheck, CheckCircle, ShieldCheck } from 'lucide-react';
import { PartnerCardholder } from '../../types';

interface PartnerHeaderBannerProps {
  partners: PartnerCardholder[];
  currentPartner: PartnerCardholder;
  onSelectPartner: (id: string) => void;
  onWithdrawPayout: () => void;
  payoutNotice: string | null;
}

export const PartnerHeaderBanner: React.FC<PartnerHeaderBannerProps> = ({
  partners,
  currentPartner,
  onSelectPartner,
  onWithdrawPayout,
  payoutNotice,
}) => {
  return (
    <div className="space-y-6">
      {/* Switch Active Cardholder Persona */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#161617]/90 p-3 sm:px-5 rounded-[22px] border border-slate-200 dark:border-white/[0.08] shadow-md dark:shadow-lg transition-colors duration-200">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-zinc-400">
          <UserCheck className="w-4 h-4 text-[#2997ff]" />
          <span className="font-semibold text-slate-900 dark:text-white">Active Cardholder Persona:</span>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 hidden sm:inline">(Switch profile to simulate multi-cardholder claim & failover)</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {partners.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectPartner(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                currentPartner.id === p.id
                  ? 'bg-[#101936] text-white dark:bg-white dark:text-black shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white dark:border-white/[0.06]'
              }`}
            >
              {p.name} ({p.cardsHeld[0]?.bank.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Top Profile Banner with Payout Withdrawal */}
      <div className="bg-white dark:bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 text-[#101936] dark:text-white shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-white/[0.08] relative overflow-hidden transition-colors duration-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentPartner.avatar}
              alt={currentPartner.name}
              className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-white/10"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold tracking-tight text-[#101936] dark:text-white">{currentPartner.name}</h2>
                <span className="text-[10px] font-medium text-emerald-700 dark:text-[#30d158] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-[#30d158]" /> KYC Verified
                </span>
                <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 font-semibold">
                  Nodal Settlement Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#86868b] mt-1">
                Settlement Bank: <strong className="text-slate-900 dark:text-white">HDFC Bank A/c ••••4892</strong> • Trust Score: <strong className="text-slate-900 dark:text-white">{currentPartner.trustScore}/100</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Payout CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/[0.08] pt-4 md:pt-0 md:pl-8">
            <div className="grid grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium tracking-wider block">Total Earnings</span>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">₹{currentPartner.totalEarnings.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium tracking-wider block">Fulfilled</span>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{currentPartner.totalOrdersFulfilled}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium tracking-wider block">Milestones</span>
                <p className="text-lg font-semibold text-amber-600 dark:text-amber-300 mt-0.5">{currentPartner.rewardPointsEarned.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <button
              onClick={onWithdrawPayout}
              className="apple-pill-btn text-xs px-4 py-2.5 whitespace-nowrap"
            >
              Withdraw Payout
            </button>
          </div>
        </div>

        {payoutNotice && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-medium text-slate-900 dark:text-white flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-[#30d158]" />
            <span>{payoutNotice}</span>
          </div>
        )}
      </div>

      {/* FRM Fraud & Risk Security Telemetry */}
      <div className="bg-white dark:bg-[#161617]/90 rounded-[28px] p-5 sm:p-6 border border-slate-200 dark:border-white/[0.08] shadow-md grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs transition-colors duration-200">
        <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/[0.06]">
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium block">FRM Risk Status</span>
          <span className="text-sm font-semibold text-emerald-600 dark:text-[#30d158] flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#30d158]" />
            TIER 1 (Low Risk)
          </span>
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] font-mono">CIBIL 810 • 100% Penny Match</span>
        </div>

        <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/[0.06]">
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium block">Hourly Velocity Guard</span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">0 / 2 Swipes Active</p>
          <span className="text-[10px] text-emerald-600 dark:text-[#30d158] font-mono">100% Velocity Headroom</span>
        </div>

        <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/[0.06]">
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium block">Daily Cap Utilization</span>
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-300 mt-0.5">₹0 / ₹1,50,000</p>
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] font-mono">Rolling 24-hr Window</span>
        </div>

        <div className="bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/[0.06]">
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] uppercase font-medium block">Rolling Escrow Reserve</span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">5% Protected</p>
          <span className="text-[10px] text-slate-500 dark:text-[#86868b] font-mono">Zero Chargeback History</span>
        </div>
      </div>
    </div>
  );
};
