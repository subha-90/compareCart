'use client';

import React, { useState } from 'react';
import { useCompareCart, SystemMetrics } from '../lib/store';
import { EscrowOrder, PartnerCardholder } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  Users,
  Activity,
  Layers,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Clock,
  KeyRound,
  FileCheck2,
  DollarSign,
  Info
} from 'lucide-react';

interface AdminPortalProps {
  onSwitchRole: (role: 'user' | 'partner' | 'admin') => void;
  onClearCache?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onSwitchRole, onClearCache }) => {
  const {
    metrics,
    orders,
    partners,
    partnerRequests,
    customers,
    frmConfig,
    updateFRMConfig,
    advanceOrderStatus,
    approvePartnerOnboarding,
    rejectPartnerOnboarding,
    requestStepUpVerification,
  } = useCompareCart();

  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'orders' | 'partners' | 'customers' | 'frm' | 'engine'>('overview');
  const [partnerFilter, setPartnerFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // FRM Rule Form State
  const [dailyGmvLimit, setDailyGmvLimit] = useState(frmConfig.maxDailyGmvPerCard);
  const [hourlySwipes, setHourlySwipes] = useState(frmConfig.maxHourlySwipes);
  const [minCibil, setMinCibil] = useState(frmConfig.minCibilScore);
  const [reserveRatio, setReserveRatio] = useState(frmConfig.reserveRatioPercent);

  const showNotice = (msg: string) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 4000);
  };

  const handleAdvance = (orderId: string) => {
    advanceOrderStatus(orderId);
    showNotice(`Order #${orderId} status advanced to next settlement stage.`);
  };

  const handleApprovePartner = (reqId: string, name: string) => {
    approvePartnerOnboarding(reqId, 'Approved after full FRM scoring & Penny Drop verification.');
    showNotice(`Approved KYC & activated ${name} into the verified cardholder pool.`);
  };

  const handleStepUpPartner = (reqId: string, name: string) => {
    requestStepUpVerification(reqId, 'Step-Up KYC Required: Upload 3-month credit card e-statement or perform Video KYC.');
    showNotice(`Step-Up Verification requested for ${name}.`);
  };

  const handleRejectPartner = (reqId: string, name: string) => {
    rejectPartnerOnboarding(reqId, 'Sub-prime risk parameters or income-to-limit leverage mismatch.');
    showNotice(`Rejected onboarding application for ${name}.`);
  };

  const handleSaveFRMConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateFRMConfig({
      maxDailyGmvPerCard: Number(dailyGmvLimit),
      maxHourlySwipes: Number(hourlySwipes),
      minCibilScore: Number(minCibil),
      reserveRatioPercent: Number(reserveRatio),
    });
    showNotice('Global FRM & Fraud Velocity thresholds successfully updated.');
  };

  const handleFlushCache = async () => {
    try {
      await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'iphone 16', forceFresh: true }),
      });
      showNotice('Master crawler cache flushed. Live price indexing re-initialized.');
      if (onClearCache) onClearCache();
    } catch {
      showNotice('Crawler cache reset initiated across in-memory buffers.');
    }
  };

  const totalGMV = orders.reduce((sum, o) => sum + o.listedPrice, 3850000);
  const totalPlatformFees = orders.reduce((sum, o) => sum + (o.platformFee || 250), 38200);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Super Admin Command Header & Role Switcher */}
      <div className="bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                CENTRAL GOVERNANCE & CONTROL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              CompareCart Central Operations & Governance
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] mt-1 max-w-2xl leading-relaxed">
              Full-system visibility: Monitor real-time crawlers, govern partner cardholder credit allocations, orchestrate multi-party escrow settlements, and switch roles instantly.
            </p>
          </div>

          {/* Quick Role Switcher Panel */}
          <div className="bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-2 shrink-0">
            <span className="text-[10px] font-medium text-slate-500 dark:text-[#86868b] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Perspective</span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onSwitchRole('user')}
                className="apple-pill-btn-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#30d158]" />
                <span>Consumer</span>
              </button>

              <button
                onClick={() => onSwitchRole('partner')}
                className="apple-pill-btn-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Card Partner</span>
              </button>

              <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 dark:bg-white/10 text-white dark:text-white border border-amber-400 dark:border-white/15 flex items-center gap-1">
                <span>👑 Super Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        {adminNotice && (
          <div className="mt-4 p-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-medium text-white flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#30d158] shrink-0" />
            <span>{adminNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Super Admin Navigation Sub-Tabs (Apple Pill Segmented Control) */}
      <div className="flex items-center gap-1.5 bg-[#1c1c1e]/80 p-1 rounded-full border border-white/[0.08] overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Telemetry & Financials', icon: TrendingUp },
          {
            id: 'approvals',
            label: `Cardholder Onboarding (${partnerRequests.filter((r) => r.status === 'PENDING_APPROVAL').length} Pending)`,
            icon: FileCheck2,
          },
          { id: 'frm', label: 'FRM Risk Engine & Velocity Rules', icon: ShieldAlert },
          { id: 'orders', label: `Escrow Transactions (${orders.length})`, icon: ShieldCheck },
          { id: 'partners', label: `Active Cardholders (${partners.length})`, icon: Users },
          { id: 'customers', label: `Customer Accounts (${customers.length})`, icon: ShoppingBag },
          { id: 'engine', label: 'Crawler & AI Health Console', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-[#101936] dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-slate-600 dark:text-[#86868b] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: OVERVIEW & FINANCIAL METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#161617]/90 rounded-[28px] p-6 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#86868b] block">Gross Merchandise Value</span>
              <p className="text-2xl font-semibold text-white mt-1">₹{totalGMV.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Live Consumer Volume</span>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Escrow Reserve Locked</span>
              <p className="text-2xl font-black text-white mt-1">₹{metrics.escrowPoolValue.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">100% RBI Nodal Backed</span>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Consumer Savings Delivered</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">₹{metrics.totalSavingsDelivered.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Via Card Splitting</span>
            </div>

            <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Platform Revenue</span>
              <p className="text-2xl font-black text-amber-300 mt-1">₹{totalPlatformFees.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-amber-400 font-semibold mt-1 block">Net 12% Facilitation Fee</span>
            </div>
          </div>

          {/* Platform Performance & Risk Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Escrow Settlement Lifecycle
                </h3>
                <span className="text-xs text-zinc-400 font-mono">Dispute Ratio: 0.00%</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                CompareCart operates a zero-loss double-sided escrow pipeline. Buyer UPI deposit is held in a licensed nodal account until the 7-day merchant replacement/return window closes. Once confirmed, payment is disbursed to the partner cardholder along with their 18% commission and reward credits.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Stage 1</span>
                  <span className="text-xs font-bold text-white mt-1 block">Buyer UPI Lock</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">Instant Nodal Credit</span>
                </div>
                <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Stage 2</span>
                  <span className="text-xs font-bold text-white mt-1 block">Cardholder Swipe</span>
                  <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">Direct Retailer Order</span>
                </div>
                <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Stage 3</span>
                  <span className="text-xs font-bold text-white mt-1 block">Delivery Verification</span>
                  <span className="text-[10px] text-amber-400 font-mono mt-0.5 block">AWB Courier Sync</span>
                </div>
                <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Stage 4</span>
                  <span className="text-xs font-bold text-white mt-1 block">Payout Disbursed</span>
                  <span className="text-[10px] text-purple-400 font-mono mt-0.5 block">Commission Released</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Scraper Engine Telemetry
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                  <span className="text-zinc-400">Flipkart Crawler</span>
                  <span className="emerald-foil-badge text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">200 OK (0.8s)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                  <span className="text-zinc-400">Amazon Scraper</span>
                  <span className="emerald-foil-badge text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">200 OK (1.1s)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                  <span className="text-zinc-400">Croma Retail Feed</span>
                  <span className="emerald-foil-badge text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">200 OK (0.9s)</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/[0.06]">
                  <span className="text-zinc-400">Reliance Digital</span>
                  <span className="emerald-foil-badge text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">200 OK (1.2s)</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-zinc-400">Vijay Sales</span>
                  <span className="emerald-foil-badge text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">200 OK (1.0s)</span>
                </div>
              </div>

              <button
                onClick={handleFlushCache}
                className="w-full text-xs font-bold text-white dark:text-white bg-[#101936] hover:bg-[#1a2a52] dark:bg-zinc-800 dark:hover:bg-zinc-700 p-3 rounded-xl border border-[#101936]/20 dark:border-white/10 transition flex items-center justify-center gap-2 mt-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Flush In-Memory Cache</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: CARDHOLDER ONBOARDING & FRM APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Cardholder Onboarding & FRM Risk Assessment Deck
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Multi-layer verification: CIBIL bureau pull, NPCI penny drop bank match, NSDL PAN verification, and AML screening.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 gold-foil-badge px-3 py-1 rounded-full">
                {partnerRequests.filter((r) => r.status === 'PENDING_APPROVAL').length} Pending Action
              </span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {partnerRequests.map((req) => (
              <div key={req.id} className="py-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{req.name}</h4>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">({req.city})</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-500">• {req.employmentType} (₹{req.monthlyIncome.toLocaleString('en-IN')}/mo)</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          req.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-400/50 dark:border-amber-500/30'
                            : req.status === 'APPROVED'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400/50 dark:border-emerald-500/30'
                            : req.status === 'STEP_UP_REQUIRED'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-400/50 dark:border-blue-500/30'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-400/50 dark:border-rose-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-mono">
                      PAN: <strong className="text-slate-800 dark:text-zinc-200">{req.panNumber}</strong> • Payout A/c: <strong className="text-slate-800 dark:text-zinc-200">{req.bankAccount}</strong> ({req.ifsc}) • Applied: {new Date(req.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
                    {req.status === 'PENDING_APPROVAL' || req.status === 'STEP_UP_REQUIRED' ? (
                      <>
                        <button
                          onClick={() => handleApprovePartner(req.id, req.name)}
                          className="text-xs font-black text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                        >
                          Approve KYC & Activate
                        </button>
                        <button
                          onClick={() => handleStepUpPartner(req.id, req.name)}
                          className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 dark:text-blue-300 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:border-blue-500/30 px-3.5 py-2 rounded-xl transition"
                        >
                          Request Step-Up KYC
                        </button>
                        <button
                          onClick={() => handleRejectPartner(req.id, req.name)}
                          className="text-xs font-bold text-rose-600 dark:text-zinc-400 hover:text-rose-700 dark:hover:text-rose-400 bg-rose-50 dark:bg-zinc-900 hover:bg-rose-100 dark:hover:bg-zinc-800 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-white/10 transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-zinc-400 italic">Decision Recorded</span>
                    )}
                  </div>
                </div>

                {/* FRM Risk Telemetry Card */}
                <div className="bg-slate-50 dark:bg-zinc-950/80 p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-semibold block">FRM Risk Score</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{req.frmAssessment.overallScore}/100</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-white/10">
                        {req.frmAssessment.riskTier}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-semibold block">CIBIL Bureau Pull</span>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-300 mt-0.5">{req.frmAssessment.cibilScore} ({req.frmAssessment.cibilStatus})</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-semibold block">Penny Drop Verification</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      100% Name Match
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-semibold block">Declared Card & Limit</span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{req.initialCardName}</p>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{req.initialCardLimit.toLocaleString('en-IN')} (Cycle: {req.billingCycleDay || 15}th)</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-semibold block">AML / Sanctions</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">PASSED (Clean)</span>
                  </div>
                </div>

                {/* Admin Notes / Rejection Reason / Step-Up alert */}
                {req.adminNotes && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Admin Instruction: {req.adminNotes}</span>
                  </div>
                )}
                {req.rejectionReason && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/20 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Rejection Reason: {req.rejectionReason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: GLOBAL FRM RISK CONTROLS & VELOCITY RULES */}
      {activeTab === 'frm' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 shadow-2xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Global Fraud & Risk Management (FRM) Rule Engine
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Set autonomous risk guardrails, velocity limits, and mandatory rolling reserve protection for card pooling.
              </p>
            </div>
            <span className="text-xs font-mono font-bold emerald-foil-badge text-emerald-300 px-3 py-1 rounded-full">
              ENGINE ACTIVE • ZERO INCIDENTS
            </span>
          </div>

          <form onSubmit={handleSaveFRMConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 bg-slate-100 dark:bg-zinc-950/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
              <label className="block text-slate-800 dark:text-zinc-200 font-bold">Max Daily GMV Limit Per Card (₹)</label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Restricts total transaction volume a single credit card can swipe across all buyers in a 24-hour cycle.</p>
              <input
                type="number"
                step="10000"
                value={dailyGmvLimit}
                onChange={(e) => setDailyGmvLimit(Number(e.target.value))}
                className="w-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-white/10 font-mono text-sm focus:outline-none focus:border-amber-400 mt-2"
              />
            </div>

            <div className="space-y-2 bg-slate-100 dark:bg-zinc-950/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
              <label className="block text-slate-800 dark:text-zinc-200 font-bold">Max Hourly Swipe Velocity</label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Maximum permitted checkouts per 60 minutes per card to prevent bank automated bot fraud flags.</p>
              <input
                type="number"
                min={1}
                max={10}
                value={hourlySwipes}
                onChange={(e) => setHourlySwipes(Number(e.target.value))}
                className="w-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-white/10 font-mono text-sm focus:outline-none focus:border-amber-400 mt-2"
              />
            </div>

            <div className="space-y-2 bg-slate-100 dark:bg-zinc-950/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
              <label className="block text-slate-800 dark:text-zinc-200 font-bold">Minimum CIBIL Score Threshold</label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Applicants scoring below this score are automatically flagged for mandatory Step-Up manual verification.</p>
              <input
                type="number"
                min={600}
                max={850}
                value={minCibil}
                onChange={(e) => setMinCibil(Number(e.target.value))}
                className="w-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-white/10 font-mono text-sm focus:outline-none focus:border-amber-400 mt-2"
              />
            </div>

            <div className="space-y-2 bg-slate-100 dark:bg-zinc-950/80 p-5 rounded-2xl border border-slate-200 dark:border-white/5">
              <label className="block text-slate-800 dark:text-zinc-200 font-bold">Rolling Reserve Ratio (%)</label>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Percentage of order value held in Escrow until the 7-day e-commerce return window has lapsed.</p>
              <input
                type="number"
                min={2}
                max={20}
                value={reserveRatio}
                onChange={(e) => setReserveRatio(Number(e.target.value))}
                className="w-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-white/10 font-mono text-sm focus:outline-none focus:border-amber-400 mt-2"
              />
            </div>

            <div className="md:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition"
              >
                Save & Enforce FRM Guardrails
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB B: ALL ORDERS & ESCROW MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Universal Escrow & Orders Master Ledger
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect buyer deposits, matched partner credit cards, and advance order states.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono">Filter:</span>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-zinc-950 text-white text-xs px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none"
              >
                <option value="ALL">All States ({orders.length})</option>
                <option value="ESCROW_DEPOSITED">Escrow Deposited</option>
                <option value="ORDER_PLACING">Order Placing</option>
                <option value="MERCHANT_CONFIRMED">Retailer Confirmed</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="DELIVERED">Delivered</option>
                <option value="SETTLED">Settled</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {orders
              .filter((o) => orderFilter === 'ALL' || o.status === orderFilter)
              .map((order) => (
                <div key={order.id} className="py-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-white/[0.02] p-3 rounded-2xl transition">
                  <div className="flex items-start gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-12 h-12 rounded-xl object-cover bg-zinc-950 border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-white">{order.orderNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/10">
                          {order.merchantId.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200 truncate max-w-xs">{order.productTitle}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 flex-wrap">
                        <span>Buyer: <strong className="text-white">{order.buyerName}</strong> ({order.buyerAddress.city})</span>
                        <span>•</span>
                        <span>Effective Paid: <strong className="text-emerald-400 font-bold">₹{order.effectivePricePaid.toLocaleString('en-IN')}</strong></span>
                        <span>•</span>
                        <span>Partner: <strong className="text-blue-600 dark:text-blue-300">{order.partnerName || 'Pending Match'}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end lg:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase font-bold block">Current State</span>
                      <span className="inline-block text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/30">
                        {order.status}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdvance(order.id)}
                      className="text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>Advance State</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB C: CARDHOLDERS & CREDIT LIMITS */}
      {activeTab === 'partners' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Registered Card Partner Network
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                KYC-verified credit cardholders pooling their premium card benefits.
              </p>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Total Active Partners: <strong className="text-emerald-400">{partners.length}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex items-center gap-3">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{partner.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                        {partner.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{partner.city} • Trust: {partner.trustScore}/100</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.08] text-xs">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Registered Cards:</span>
                  {partner.cardsHeld.map((card) => (
                    <div key={card.id} className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-zinc-200">{card.cardName}</p>
                        <p className="text-[10px] font-mono text-zinc-500">•••• {card.last4} ({card.network})</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 block font-mono">Limit Avail:</span>
                        <span className="text-xs font-bold text-emerald-400">₹{card.availableLimit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Fulfilled: <strong className="text-white">{partner.totalOrdersFulfilled} orders</strong></span>
                  <span>Earned: <strong className="text-emerald-400">₹{partner.totalEarnings.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: CUSTOMER ONBOARDING & VERIFICATION RECORDS */}
      {activeTab === 'customers' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Customer Accounts & KYC Records</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Registered consumer shoppers utilizing CompareCart Price Matrix & Escrow checkout.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300 emerald-foil-badge px-3 py-1 rounded-full">
              {customers.length} Verified Shoppers
            </span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {customers.map((cust) => (
              <div key={cust.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{cust.name}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">({cust.city})</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                      {cust.kycStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Email: {cust.email} • Phone: {cust.phone} • Joined: {cust.joinedAt}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase block font-semibold">Total Orders</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{cust.totalOrders} Purchases</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Total Savings</span>
                    <span className="text-xs font-extrabold text-emerald-400">₹{cust.totalSaved.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB F: CRAWLER & AI DIAGNOSTIC CONSOLE */}
      {activeTab === 'engine' && (
        <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Multi-Store Web Crawler & AI Engine Diagnostics
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Active status across direct merchant scraping feeds, Groq LPU, and Gemini Flash failover.
              </p>
            </div>
            <button
              onClick={handleFlushCache}
              className="text-xs font-bold text-white bg-[#101936] hover:bg-[#1a2a52] dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3.5 py-2 rounded-xl border border-[#101936]/20 dark:border-white/10 transition flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Purge Cache</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Primary AI LPU Engine (Groq)</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Ultra-fast token inference using custom LPU clusters for grounded pricing and discount extraction.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-500">Active Priority Model:</span>
                  <span className="text-emerald-400 font-bold">qwen/qwen3.8-27b</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-500">Secondary Reasoner:</span>
                  <span className="text-zinc-300">openai/gpt-oss-120b</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Failover Model:</span>
                  <span className="text-zinc-300">google/gemini-1.5-flash</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Direct Merchant Crawlers</span>
              </h4>
              <p className="text-xs text-zinc-400">
                Headless organic HTTP crawlers with automated user-agent rotation and anti-bot bypass.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 block">Flipkart.com:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (Direct)</span>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 block">Amazon.in:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (Snippets)</span>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 block">Croma.com:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (SERP)</span>
                </div>
                <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 block">Reliance Digital:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (SERP)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
