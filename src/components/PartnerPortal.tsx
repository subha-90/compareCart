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
  UserCheck,
  RefreshCw,
  XCircle,
  RotateCcw,
  Check,
  ArrowRight,
  ShieldAlert,
  Send,
  PackageCheck
} from 'lucide-react';

export const PartnerPortal: React.FC = () => {
  const {
    partners,
    orders,
    addPartnerCard,
    updateCardLimit,
    claimSwipeOrder,
    declineOrRetryOrder,
    confirmOrderPlaced,
    advanceOrderStatus,
  } = useCompareCart();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || 'partner-rohit-s');
  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const [activeQueueTab, setActiveQueueTab] = useState<'open_requests' | 'my_active' | 'completed' | 'refunded'>('open_requests');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<number>(250000);
  const [bank, setBank] = useState('HDFC Bank');
  const [cardName, setCardName] = useState('HDFC Millennia Credit Card');
  const [last4, setLast4] = useState('8832');
  const [network, setNetwork] = useState<'VISA' | 'MASTERCARD' | 'RUPAY'>('VISA');
  const [monthlyLimit, setMonthlyLimit] = useState(250000);
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  // Fulfillment & Decline Modals State
  const [confirmingOrder, setConfirmingOrder] = useState<any | null>(null);
  const [merchantOrderRefInput, setMerchantOrderRefInput] = useState('');
  const [awbTrackingInput, setAwbTrackingInput] = useState('');
  const [decliningOrder, setDecliningOrder] = useState<any | null>(null);
  const [declineReason, setDeclineReason] = useState('Bank daily credit limit exceeded');

  const showNotice = (msg: string) => {
    setPayoutNotice(msg);
    setTimeout(() => setPayoutNotice(null), 5000);
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

  // Queues
  const openRequests = orders.filter(o => o.status === 'MATCHING_CARDHOLDER');
  const myActiveSwipes = orders.filter(o => o.partnerId === currentPartner.id && o.status === 'ORDER_PLACING');
  const completedOrders = orders.filter(o => o.partnerId === currentPartner.id && ['MERCHANT_CONFIRMED', 'DISPATCHED', 'DELIVERED', 'RETURN_WINDOW_CLOSED', 'SETTLED'].includes(o.status));
  const refundedOrders = orders.filter(o => o.status === 'REFUNDED');

  const handleAcceptSwipe = (orderId: string) => {
    const success = claimSwipeOrder(orderId, currentPartner.id);
    if (success) {
      showNotice(`🎉 Accepted swipe request! Order locked to ${currentPartner.name}. Please fulfill with shipping address.`);
      setActiveQueueTab('my_active');
    } else {
      showNotice('Unable to claim order. Another cardholder may have accepted it first.');
    }
  };

  const handleOpenConfirmModal = (ord: any) => {
    setConfirmingOrder(ord);
    setMerchantOrderRefInput(`OD${Math.floor(1000000000000 + Math.random() * 9000000000000)}`);
    setAwbTrackingInput(`EXP-${Math.floor(100000 + Math.random() * 900000)}-IN`);
  };

  const handleConfirmOrderSubmit = () => {
    if (!confirmingOrder) return;
    confirmOrderPlaced(confirmingOrder.id, merchantOrderRefInput, awbTrackingInput);
    setConfirmingOrder(null);
    showNotice(`✅ Order #${confirmingOrder.orderNumber} confirmed! Merchant Order ID and Tracking recorded.`);
  };

  const handleDeclineSubmit = () => {
    if (!decliningOrder) return;
    const res = declineOrRetryOrder(decliningOrder.id, currentPartner.id, declineReason);
    setDecliningOrder(null);
    if (res?.status === 'REFUNDED') {
      showNotice(`All ${res.maxAttempts} cardholder attempts exhausted. 100% refund of ₹${res.effectivePricePaid.toLocaleString('en-IN')} initiated to shopper.`);
    } else {
      showNotice(`Card declined. Re-routing Order #${decliningOrder.orderNumber} to next eligible network cardholder (Attempt ${res?.attemptCount} of 4)...`);
    }
  };

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
              onClick={() => setSelectedPartnerId(p.id)}
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
              onClick={handleWithdrawPayout}
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
          <span className="text-[10px] text-emerald-600 dark:text-[#30d158] font-mono">Zero Chargeback History</span>
        </div>
      </div>

      {/* Cards Portfolio & Dynamic Limit Management */}
      <div className="bg-white dark:bg-[#161617]/90 rounded-[28px] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-7 shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-[#101936] dark:text-white flex items-center gap-2 tracking-tight">
              <CreditCard className="w-4 h-4 text-[#2997ff]" />
              <span>Registered Cards & Limit Allocation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#86868b] mt-1">
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

      {/* P2P Liquidity Pool & Fulfillment Queues */}
      <div className="bg-[#161617]/90 rounded-[28px] border border-white/[0.08] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 tracking-tight">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Cardholder P2P Matching & Swipe Network</span>
            </h3>
            <p className="text-xs text-[#86868b] mt-1">
              Escrow-locked buyer checkout requests broadcast to eligible partners. Accept to claim and fulfill.
            </p>
          </div>

          {/* Sub-Queue Tabs */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-2xl border border-white/10 text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setActiveQueueTab('open_requests')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'open_requests'
                  ? 'bg-amber-400 text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Incoming Requests</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeQueueTab === 'open_requests' ? 'bg-black text-amber-300' : 'bg-white/10 text-zinc-300'}`}>
                {openRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveQueueTab('my_active')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'my_active'
                  ? 'bg-[#2997ff] text-white font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>My Active Swipes</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeQueueTab === 'my_active' ? 'bg-white text-blue-900' : 'bg-white/10 text-zinc-300'}`}>
                {myActiveSwipes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveQueueTab('completed')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'completed'
                  ? 'bg-[#30d158] text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Fulfilled ({completedOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveQueueTab('refunded')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                activeQueueTab === 'refunded'
                  ? 'bg-rose-500 text-white font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Auto-Refunded ({refundedOrders.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OPEN BROADCAST REQUESTS */}
        {activeQueueTab === 'open_requests' && (
          <div className="space-y-4">
            {openRequests.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No new buyer escrow checkout requests waiting. When a shopper locks escrow, eligible cardholders get notified here in real-time.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {openRequests.map((ord) => {
                  const hasDeclined = ord.declinedPartnerIds?.includes(currentPartner.id);
                  const matchingCard = currentPartner.cardsHeld.find(c =>
                    (c.bank.toLowerCase().includes((ord.requiredBank || '').toLowerCase()) ||
                     c.cardName.toLowerCase().includes((ord.requiredBank || '').toLowerCase())) &&
                    c.availableLimit >= ord.listedPrice
                  ) || currentPartner.cardsHeld[0];

                  const isEligible = matchingCard && matchingCard.availableLimit >= ord.listedPrice && !hasDeclined;

                  return (
                    <div
                      key={ord.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isEligible
                          ? 'bg-black/60 border-amber-400/30 hover:border-amber-400/60 shadow-[0_4px_25px_rgba(251,191,36,0.08)]'
                          : 'bg-black/30 border-white/[0.06] opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={ord.productImage}
                            alt={ord.productTitle}
                            className="w-14 h-14 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1.5 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                {ord.merchantId.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                                Attempt {ord.attemptCount} of {ord.maxAttempts}
                              </span>
                            </div>

                            <h4 className="text-sm font-semibold text-white">{ord.productTitle}</h4>

                            <p className="text-xs text-[#86868b]">
                              Required Card: <strong className="text-amber-300">{ord.requiredBank}</strong> • Delivery: <strong className="text-white">{ord.buyerAddress.city}</strong>
                            </p>

                            {ord.failureReason && (
                              <p className="text-[11px] text-rose-400 font-mono">
                                ⚠️ Previous Attempt Declined: {ord.failureReason}
                              </p>
                            )}

                            {isEligible && (
                              <p className="text-[11px] text-[#30d158] font-mono flex items-center gap-1 pt-1">
                                <Check className="w-3.5 h-3.5" />
                                Your card matches: <strong>{matchingCard.cardName}</strong> (Available: ₹{matchingCard.availableLimit.toLocaleString('en-IN')})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Earnings & Accept Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-[#86868b] uppercase font-bold block">Your Commission</span>
                            <span className="text-base font-extrabold text-[#30d158]">
                              +₹{ord.cardholderCommission?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-amber-300/80 block font-mono">
                              (100% Escrow Guaranteed)
                            </span>
                          </div>

                          {hasDeclined ? (
                            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              Declined by you
                            </span>
                          ) : isEligible ? (
                            <button
                              onClick={() => handleAcceptSwipe(ord.id)}
                              className="apple-pill-btn text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-[0_4px_15px_rgba(251,191,36,0.25)] bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold"
                            >
                              <Zap className="w-3.5 h-3.5 fill-black" />
                              <span>Accept Swipe Request</span>
                            </button>
                          ) : (
                            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              Card limit insufficient
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ACTIVE SWIPES */}
        {activeQueueTab === 'my_active' && (
          <div className="space-y-4">
            {myActiveSwipes.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No active swipe orders in your queue. Accept incoming requests above to begin fulfillment.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myActiveSwipes.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-black/60 border border-[#2997ff]/40 shadow-[0_8px_30px_rgba(0,113,227,0.15)] space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <img
                          src={ord.productImage}
                          alt={ord.productTitle}
                          className="w-14 h-14 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1.5 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#2997ff] border border-blue-500/20">
                              {ord.merchantId.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              SWIPE IN PROGRESS
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white mt-0.5">{ord.productTitle}</h4>
                          <p className="text-xs text-zinc-300 mt-1">
                            Card Assigned: <strong className="text-white">{ord.partnerCardUsed}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-[#86868b] uppercase font-bold block">Your Profit</span>
                        <span className="text-lg font-extrabold text-[#30d158]">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Buyer Shipping Details (Direct Delivery Requirement) */}
                    <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 text-xs space-y-1 font-mono">
                      <div className="text-zinc-400 text-[11px] uppercase font-bold">Buyer Shipping Address (Deliver Here):</div>
                      <div className="text-white font-sans font-medium">{ord.buyerName} ({ord.buyerPhone})</div>
                      <div className="text-zinc-300">{ord.buyerAddress.line1}, {ord.buyerAddress.city}, {ord.buyerAddress.state} - {ord.buyerAddress.pincode}</div>
                    </div>

                    {/* Actions: Confirm Placed or Card Declined */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setDecliningOrder(ord);
                          setDeclineReason('Bank daily transaction limit exceeded');
                        }}
                        className="apple-pill-btn-secondary w-full sm:w-auto text-xs py-2.5 px-4 text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Card Declined / Cannot Swipe</span>
                      </button>

                      <button
                        onClick={() => handleOpenConfirmModal(ord)}
                        className="apple-pill-btn w-full sm:w-auto text-xs py-2.5 px-5 flex items-center justify-center gap-1.5 shadow-lg bg-[#30d158] hover:bg-[#28b84d] text-black font-bold"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Confirm Order Placed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLETED & SETTLED */}
        {activeQueueTab === 'completed' && (
          <div className="space-y-4">
            {completedOrders.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No fulfilled orders yet. Completed orders will appear here ready for nodal payout settlement.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {completedOrders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={ord.productImage}
                        alt={ord.productTitle}
                        className="w-12 h-12 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#30d158] border border-emerald-500/20">
                            {ord.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-0.5">{ord.productTitle}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                          Ref: <strong className="text-white">{ord.merchantOrderRef}</strong> • AWB: <strong className="text-[#2997ff]">{ord.awbTrackingNumber}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Commission Earned</span>
                      <span className="text-sm font-extrabold text-[#30d158]">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-zinc-400 block font-mono">Principal Settled</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUTO-REFUNDED AUDIT */}
        {activeQueueTab === 'refunded' && (
          <div className="space-y-4">
            {refundedOrders.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-xs font-mono">
                No orders were refunded. All checkout requests have been fulfilled successfully.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {refundedOrders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={ord.productImage}
                        alt={ord.productTitle}
                        className="w-12 h-12 object-contain bg-zinc-950 rounded-xl border border-white/10 p-1 shrink-0 grayscale"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{ord.orderNumber}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            100% REFUNDED
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {ord.attemptCount} Cardholder Attempts Failed
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-300 mt-0.5">{ord.productTitle}</h4>
                        <p className="text-[11px] text-rose-300 mt-0.5 font-mono">
                          {ord.failureReason || 'All network cardholders declined. 100% refund executed.'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Refund Reference</span>
                      <span className="text-xs font-mono font-bold text-white">{ord.refundRef || 'RFND_AUTO'}</span>
                      <span className="text-[10px] text-rose-400 block font-semibold">₹{ord.effectivePricePaid.toLocaleString('en-IN')} Returned</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Confirm Order Placed (Submit Merchant Ref & AWB) */}
      {confirmingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl rounded-[28px] max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#30d158]/10 text-[#30d158] flex items-center justify-center border border-[#30d158]/20">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">Confirm Order Placed</h3>
                <p className="text-xs text-[#86868b]">Order #{confirmingOrder.orderNumber}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {confirmingOrder.merchantId.toUpperCase()} Order Reference ID
                </label>
                <input
                  type="text"
                  value={merchantOrderRefInput}
                  onChange={(e) => setMerchantOrderRefInput(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:outline-none font-mono"
                  placeholder="e.g. OD339182049182"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Courier AWB Tracking Number
                </label>
                <input
                  type="text"
                  value={awbTrackingInput}
                  onChange={(e) => setAwbTrackingInput(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-xs p-3 rounded-xl border border-white/10 focus:outline-none font-mono"
                  placeholder="e.g. DELHIVERY_88214"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmingOrder(null)}
                className="apple-pill-btn-secondary w-1/2 text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOrderSubmit}
                className="apple-pill-btn w-1/2 text-xs py-2.5 font-bold"
              >
                Submit Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Card Declined / Cannot Swipe (Re-routes or Auto-Refunds) */}
      {decliningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fade-in">
          <div className="bg-[#1c1c1e]/98 backdrop-blur-3xl rounded-[28px] max-w-md w-full p-6 sm:p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">Card Declined / Re-route</h3>
                <p className="text-xs text-[#86868b]">
                  Attempt {decliningOrder.attemptCount} of {decliningOrder.maxAttempts}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300">
              {decliningOrder.attemptCount < decliningOrder.maxAttempts ? (
                <>This order will be immediately released back to the network pool and re-broadcasted to other eligible cardholders.</>
              ) : (
                <strong className="text-rose-400">This is the final attempt (4/4). Declining now will automatically execute a 100% refund of ₹{decliningOrder.effectivePricePaid.toLocaleString('en-IN')} to the shopper.</strong>
              )}
            </p>

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Select Failure Reason:</label>
              {[
                'Bank daily transaction limit exceeded',
                'Card declined / Merchant 3D Secure OTP failure',
                'Card promo discount inactive on merchant',
                'Item out of stock on merchant site',
              ].map((reason) => (
                <label
                  key={reason}
                  onClick={() => setDeclineReason(reason)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    declineReason === reason
                      ? 'bg-rose-500/10 border-rose-500/40 text-white font-medium'
                      : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declineReason === reason}
                    onChange={() => setDeclineReason(reason)}
                    className="accent-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecliningOrder(null)}
                className="apple-pill-btn-secondary w-1/2 text-xs py-2.5"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleDeclineSubmit}
                className="apple-pill-btn w-1/2 text-xs py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {decliningOrder.attemptCount < decliningOrder.maxAttempts ? 'Re-Route to Next Partner' : 'Confirm 100% Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

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
