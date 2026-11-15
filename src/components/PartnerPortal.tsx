'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCompareCart } from '../lib/store';
import {
  CreditCard,
  Plus,
  CheckCircle,
  TrendingUp,
  Award,
  Shield,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Clock,
  Sparkles,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export const PartnerPortal: React.FC = () => {
  const { partners, orders, addPartnerCard, updateCardLimit, advanceOrderStatus } = useCompareCart();
  const currentPartner = partners[0]; // Active partner profile

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<number>(250000);
  const [bank, setBank] = useState('HDFC Bank');
  const [cardName, setCardName] = useState('HDFC Millennia Credit Card');
  const [last4, setLast4] = useState('8832');
  const [network, setNetwork] = useState<'VISA' | 'MASTERCARD' | 'RUPAY'>('VISA');
  const [monthlyLimit, setMonthlyLimit] = useState(250000);
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setPayoutNotice(msg);
    setTimeout(() => setPayoutNotice(null), 4000);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartnerCard(currentPartner.id, {
      bank,
      cardName,
      last4,
      network,
      monthlyLimit: Number(monthlyLimit),
    });
    setIsAddCardOpen(false);
    showNotice(`Successfully added ${cardName} (..${last4}) to active cardholder pool.`);
  };

  const handleUpdateLimit = (cardId: string) => {
    updateCardLimit(currentPartner.id, cardId, newLimitInput);
    setEditingCardId(null);
    showNotice(`Updated monthly credit limit to ₹${newLimitInput.toLocaleString('en-IN')}.`);
  };

  const handleWithdrawPayout = () => {
    showNotice(`Payout request of ₹${currentPartner.totalEarnings.toLocaleString('en-IN')} initiated to linked HDFC Bank A/c ••••4892.`);
  };

  const partnerOrders = orders.filter(o => o.partnerId === currentPartner.id || !o.partnerId);

  return (
    <div className="space-y-6">
      {/* Top Profile Banner with Payout Withdrawal */}
      <div className="bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/[0.08] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentPartner.avatar}
              alt={currentPartner.name}
              className="w-14 h-14 rounded-full object-cover border border-white/10"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold tracking-tight text-white">{currentPartner.name}</h2>
                <span className="text-[10px] font-medium text-[#30d158] bg-[#30d158]/10 px-2.5 py-0.5 rounded-full border border-[#30d158]/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-[#30d158]" /> KYC Verified
                </span>
                <span className="text-[10px] font-medium text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Nodal Settlement Active
                </span>
              </div>
              <p className="text-xs text-[#86868b] mt-1">
                Settlement Bank: <strong className="text-white">HDFC Bank A/c ••••4892</strong> • Trust Score: <strong className="text-white">{currentPartner.trustScore}/100</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Payout CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-8">
            <div className="grid grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-[#86868b] uppercase font-medium tracking-wider block">Total Earnings</span>
                <p className="text-lg font-semibold text-white mt-0.5">₹{currentPartner.totalEarnings.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#86868b] uppercase font-medium tracking-wider block">Fulfilled</span>
                <p className="text-lg font-semibold text-white mt-0.5">{currentPartner.totalOrdersFulfilled}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#86868b] uppercase font-medium tracking-wider block">Milestones</span>
                <p className="text-lg font-semibold text-amber-300 mt-0.5">{currentPartner.rewardPointsEarned.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <button
              onClick={handleWithdrawPayout}
              className="apple-pill-btn text-xs px-4 py-2.5 whitespace-nowrap"
            >
              Withdraw Payout
            </button>
          </div>
        </div>

        {payoutNotice && (
          <div className="mt-4 p-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-medium text-white flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-[#30d158]" />
            <span>{payoutNotice}</span>
          </div>
        )}
      </div>

      {/* FRM Fraud & Risk Security Telemetry */}
      <div className="bg-[#161617]/90 rounded-[28px] p-5 sm:p-6 border border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[10px] text-[#86868b] uppercase font-medium block">FRM Risk Status</span>
          <span className="text-sm font-semibold text-[#30d158] flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[#30d158]" />
            TIER 1 (Low Risk)
          </span>
          <span className="text-[10px] text-[#86868b] font-mono">CIBIL 810 • 100% Penny Match</span>
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[10px] text-[#86868b] uppercase font-medium block">Hourly Velocity Guard</span>
          <p className="text-sm font-semibold text-white mt-0.5">0 / 2 Swipes Active</p>
          <span className="text-[10px] text-[#30d158] font-mono">100% Velocity Headroom</span>
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[10px] text-[#86868b] uppercase font-medium block">Daily Cap Utilization</span>
          <p className="text-sm font-semibold text-amber-300 mt-0.5">₹0 / ₹1,50,000</p>
          <span className="text-[10px] text-[#86868b] font-mono">Rolling 24-hr Window</span>
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.06]">
          <span className="text-[10px] text-[#86868b] uppercase font-medium block">Rolling Escrow Reserve</span>
          <p className="text-sm font-semibold text-white mt-0.5">5% Protected</p>
          <span className="text-[10px] text-[#30d158] font-mono">Zero Chargeback History</span>
        </div>
      </div>

      {/* Cards Portfolio & Dynamic Limit Management */}
      <div className="bg-[#161617]/90 rounded-[28px] border border-white/[0.08] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 tracking-tight">
              <CreditCard className="w-4 h-4 text-[#2997ff]" />
              <span>Registered Cards & Limit Allocation</span>
            </h3>
            <p className="text-xs text-[#86868b] mt-1">
              Adjust credit limit allocations in real-time. Orders will only be auto-routed within your configured limit.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/partner/onboard"
              className="apple-pill-btn-secondary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>KYC Onboarding Wizard</span>
            </Link>

            <button
              onClick={() => setIsAddCardOpen(true)}
              className="apple-pill-btn text-xs px-3.5 py-1.5 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        {/* Realistic Physical 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPartner.cardsHeld.map((card) => {
            const usedPercentage = Math.round(((card.monthlyLimit - card.availableLimit) / card.monthlyLimit) * 100);
            const isEditing = editingCardId === card.id;

            return (
              <div
                key={card.id}
                className="realistic-card-container group select-none"
              >
                <div
                  className="realistic-card p-5 sm:p-6 text-white flex flex-col justify-between border border-white/20 relative"
                  style={{
                    background: card.bank.toLowerCase().includes('hdfc')
                      ? 'linear-gradient(135deg, #0b0f19 0%, #151c2e 50%, #000000 100%)'
                      : card.bank.toLowerCase().includes('icici')
                      ? 'linear-gradient(135deg, #0a1f14 0%, #0d3822 50%, #03140b 100%)'
                      : card.bank.toLowerCase().includes('sbi')
                      ? 'linear-gradient(135deg, #0b1a30 0%, #142a4d 50%, #07101f 100%)'
                      : 'linear-gradient(135deg, #1f1224 0%, #301736 50%, #100813 100%)',
                  }}
                >
                  {/* Holographic Rainbow Reflective Sheen */}
                  <div className="holographic-sheen" />

                  {/* Card Header: Bank & Network */}
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300 font-extrabold drop-shadow">
                        {card.bank}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5 tracking-wide">{card.cardName}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                      {card.network}
                    </span>
                  </div>

                  {/* EMV Chip & Contactless Wave */}
                  <div className="flex items-center gap-3 my-2 relative z-10">
                    <div className="realistic-emv-chip" />
                    <svg className="w-4 h-4 text-amber-200/80 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.343 9.343c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                    <span className="text-[10px] font-mono text-zinc-300 ml-auto tracking-wider">
                      Cycle: {card.billingCycleDate}th
                    </span>
                  </div>

                  {/* Card Number & Available Limit */}
                  <div className="relative z-10">
                    <p className="font-mono text-xs sm:text-sm font-bold text-zinc-200 tracking-[0.25em] drop-shadow-md">
                      •••• •••• •••• {card.last4}
                    </p>

                    {isEditing ? (
                      <div className="mt-2 space-y-1.5 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/20">
                        <label className="text-[10px] text-zinc-300 block font-semibold">New Monthly Limit (₹):</label>
                        <input
                          type="number"
                          step="10000"
                          value={newLimitInput}
                          onChange={(e) => setNewLimitInput(Number(e.target.value))}
                          className="w-full bg-zinc-900 text-white text-xs p-1 rounded border border-white/20 font-mono"
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleUpdateLimit(card.id)}
                            className="flex-1 bg-[#30d158] hover:bg-[#28b84d] text-black text-[10px] font-bold py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCardId(null)}
                            className="flex-1 bg-zinc-800 text-zinc-300 text-[10px] py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-zinc-300">
                            Available: <strong className="text-white">₹{card.availableLimit.toLocaleString('en-IN')}</strong>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-400">Max: ₹{(card.monthlyLimit / 100000).toFixed(1)}L</span>
                            <button
                              onClick={() => {
                                setEditingCardId(card.id);
                                setNewLimitInput(card.monthlyLimit);
                              }}
                              className="text-[10px] text-amber-300 hover:text-amber-200 font-mono font-bold"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        {/* Liquid Limit Bar */}
                        <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-[#30d158] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#30d158]"
                            style={{ width: `${Math.max(5, 100 - usedPercentage)}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1.5 font-mono">
                          <span className="text-[#30d158] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
                            Active for Routing
                          </span>
                          <span>{usedPercentage}% Utilized</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Order Matching & Fulfillment Queue */}
      <div className="glass-panel rounded-3xl border border-white/[0.08] p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 tracking-wide uppercase">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Assigned & Matched Orders Queue</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Escrow-locked buyer purchases auto-routed to your card. Confirming order placement unlocks your commission.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-300 gold-foil-badge px-3 py-1 rounded-full">
            {partnerOrders.length} in Queue
          </span>
        </div>

        {partnerOrders.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs font-mono">
            No active matched orders currently in progress.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {partnerOrders.map((ord) => (
              <div key={ord.id} className="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={ord.productImage}
                    alt={ord.productTitle}
                    className="w-12 h-12 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{ord.productTitle}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/10">
                        {ord.merchantId.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Buyer: <strong className="text-zinc-200">{ord.buyerName}</strong> • Delivery: <strong className="text-zinc-200">{ord.buyerAddress.city}</strong>
                    </p>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                      Card: {ord.partnerCardUsed || 'Auto-matched to your active limit'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Your Earnings</span>
                    <span className="text-sm font-extrabold text-emerald-400">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-amber-300 block font-semibold">+ Milestone Points</span>
                  </div>

                  <button
                    onClick={() => {
                      advanceOrderStatus(ord.id);
                      showNotice(`Order #${ord.orderNumber} confirmed. Retailer invoice generated.`);
                    }}
                    className="apple-pill-btn text-xs px-4 py-2 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Confirm Swipe</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl rounded-[28px] max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-sm font-semibold text-white mb-1 tracking-tight">Add Credit Card</h3>
            <p className="text-xs text-[#86868b] mb-4">
              Connect your card to monetize merchant bank sale promotions and earn milestone benefits.
            </p>

            <form onSubmit={handleAddCardSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Issuing Bank</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none"
                >
                  <option value="HDFC Bank">HDFC Bank (Infinia, Regalia Gold, Millennia)</option>
                  <option value="Axis Bank">Axis Bank (Flipkart Axis, Magnus, Atlas)</option>
                  <option value="ICICI Bank">ICICI Bank (Amazon Pay, Sapphiro, Emeralde)</option>
                  <option value="SBI Card">SBI Card (Cashback, SimplyCLICK, PRIME)</option>
                  <option value="Kotak Bank">Kotak Mahindra Bank (White, Zen)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Card Product Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={last4}
                    onChange={(e) => setLast4(e.target.value)}
                    className="w-full bg-zinc-950 text-white text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as any)}
                    className="w-full bg-zinc-950 text-white text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MasterCard</option>
                    <option value="RUPAY">RuPay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Monthly Credit Limit (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full bg-zinc-950 text-white text-xs p-2.5 rounded-xl border border-white/10 focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="apple-pill-btn-secondary w-1/2 text-xs py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-pill-btn w-1/2 text-xs py-2.5"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
