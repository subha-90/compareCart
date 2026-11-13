'use client';

import React, { useState } from 'react';
import { useCompareCart } from '../lib/store';
import {
  CreditCard,
  Plus,
  CheckCircle,
  TrendingUp,
  Award,
  Shield,
  Zap,
  ArrowUpRight,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const PartnerPortal: React.FC = () => {
  const { partners, orders, addPartnerCard } = useCompareCart();
  const currentPartner = partners[0]; // Active partner profile

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [bank, setBank] = useState('HDFC Bank');
  const [cardName, setCardName] = useState('HDFC Millennia Credit Card');
  const [last4, setLast4] = useState('8832');
  const [network, setNetwork] = useState<'VISA' | 'MASTERCARD' | 'RUPAY'>('VISA');
  const [monthlyLimit, setMonthlyLimit] = useState(250000);

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
  };

  const partnerOrders = orders.filter(o => o.partnerId === currentPartner.id);

  return (
    <div className="space-y-6">
      {/* Top Profile Banner */}
      <div className="bg-zinc-950 rounded-3xl p-6 sm:p-8 text-white shadow-xs border border-zinc-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentPartner.avatar}
              alt={currentPartner.name}
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-700 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">{currentPartner.name}</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> KYC Verified Cardholder
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Location: <strong>{currentPartner.city}</strong> • Trust Score: <strong className="text-emerald-400">{currentPartner.trustScore}/100</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-4 md:pt-0 md:pl-8 text-center sm:text-left">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">Total Earnings</span>
              <p className="text-base font-extrabold text-white mt-0.5">₹{currentPartner.totalEarnings.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">Orders Fulfilled</span>
              <p className="text-base font-extrabold text-white mt-0.5">{currentPartner.totalOrdersFulfilled}</p>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">Reward Points</span>
              <p className="text-base font-extrabold text-amber-300 mt-0.5">{currentPartner.rewardPointsEarned.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Portfolio */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-zinc-700" />
              <span>Registered Cards & Spend Capacity</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              CompareCart routes incoming buyer orders matching these cards automatically.
            </p>
          </div>

          <button
            onClick={() => setIsAddCardOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-xl transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Card</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPartner.cardsHeld.map((card) => {
            const usedPercentage = Math.round(((card.monthlyLimit - card.availableLimit) / card.monthlyLimit) * 100);

            return (
              <div
                key={card.id}
                className="bg-zinc-900 text-white p-5 rounded-2xl shadow-xs border border-zinc-800 relative flex flex-col justify-between h-44"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 font-bold">{card.bank}</span>
                      <h4 className="font-bold text-xs text-white mt-0.5">{card.cardName}</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {card.network}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-zinc-400 tracking-widest mt-2">•••• •••• •••• {card.last4}</p>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Available: <strong className="text-white">₹{card.availableLimit.toLocaleString('en-IN')}</strong></span>
                    <span>Max: ₹{(card.monthlyLimit / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${100 - usedPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-2 font-mono">
                    <span>Cycle: {card.billingCycleDate}th</span>
                    <span className="text-emerald-400 font-medium">Ready</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Order Matching & Fulfillment Queue */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Assigned & Matched Orders</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Escrow-locked buyer purchases routed to your card for discount extraction
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
            {partnerOrders.length} in Queue
          </span>
        </div>

        {partnerOrders.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xs">
            No active matched orders currently in progress.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {partnerOrders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={ord.productImage}
                    alt={ord.productTitle}
                    className="w-12 h-12 object-cover rounded-xl border border-zinc-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-zinc-900">{ord.productTitle}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {ord.merchantId.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Buyer: <strong>{ord.buyerName}</strong> • Delivery: <strong>{ord.buyerAddress.city}</strong>
                    </p>
                    <p className="text-[11px] text-zinc-600 font-medium mt-0.5">
                      Card: {ord.partnerCardUsed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Your Earnings</span>
                    <span className="text-sm font-bold text-emerald-700">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-zinc-500 block">+ Milestone Points</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                      <Clock className="w-3 h-3 text-zinc-500" /> {ord.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-900 mb-1">Add Credit Card to Partner Pool</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Connect your card to monetize bank sale promotions and earn milestone benefits.
            </p>

            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Issuing Bank</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="Axis Bank">Axis Bank (Flipkart Axis, Magnus)</option>
                  <option value="ICICI Bank">ICICI Bank (Amazon Pay, Sapphiro)</option>
                  <option value="HDFC Bank">HDFC Bank (Infinia, Regalia, Millennia)</option>
                  <option value="SBI Card">SBI Card (SimplyCLICK, PRIME)</option>
                  <option value="Kotak Bank">Kotak Mahindra Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Card Product Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={last4}
                    onChange={(e) => setLast4(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MasterCard</option>
                    <option value="RUPAY">RuPay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Monthly Credit Limit (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="w-1/2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 py-2.5 rounded-xl transition"
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
