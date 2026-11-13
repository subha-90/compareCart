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
  const currentPartner = partners[0]; // Rohit Sharma as active profile

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
      {/* Top Banner / Cardholder Profile */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentPartner.avatar}
              alt={currentPartner.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">{currentPartner.name}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> KYC Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                City: <strong>{currentPartner.city}</strong> • Trust Score: <strong className="text-emerald-400">{currentPartner.trustScore}/100</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-center">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Earnings</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">₹{currentPartner.totalEarnings.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Orders Fulfilled</span>
              <p className="text-lg font-bold text-white mt-0.5">{currentPartner.totalOrdersFulfilled}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Reward Points</span>
              <p className="text-lg font-bold text-amber-300 mt-0.5">{currentPartner.rewardPointsEarned.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Portfolio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>Registered Credit Cards & Active Limits</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              CompareCart routes incoming buyer orders matching these cards automatically.
            </p>
          </div>

          <button
            onClick={() => setIsAddCardOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
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
                className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md border border-slate-700 relative flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400 font-bold">{card.bank}</span>
                      <h4 className="font-bold text-sm text-white mt-0.5">{card.cardName}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {card.network}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 tracking-widest mt-2">•••• •••• •••• {card.last4}</p>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Available Limit: <strong>₹{card.availableLimit.toLocaleString('en-IN')}</strong></span>
                    <span>Max: ₹{(card.monthlyLimit / 100000).toFixed(1)}L</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${100 - usedPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>Cycle date: {card.billingCycleDate}th</span>
                    <span className="text-emerald-400 font-medium">Ready for Matching</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Order Matching & Fulfillment Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Assigned & Matched Orders</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Escrow-locked buyer purchases routed to your card for discount extraction
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {partnerOrders.length} Orders in Queue
          </span>
        </div>

        {partnerOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No active matched orders currently in progress.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {partnerOrders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={ord.productImage}
                    alt={ord.productTitle}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{ord.productTitle}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {ord.merchantId.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Buyer: <strong>{ord.buyerName}</strong> • Delivery: <strong>{ord.buyerAddress.city}</strong>
                    </p>
                    <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                      Card: {ord.partnerCardUsed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Your Commission</span>
                    <span className="text-sm font-black text-emerald-700">+₹{ord.cardholderCommission?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-amber-600 block font-semibold">+ Milestone Points</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Escrow Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock className="w-3 h-3" /> {ord.status}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Credit Card to Partner Pool</h3>
            <p className="text-xs text-slate-500 mb-4">
              Connect your card to monetize bank sale promotions and earn milestone benefits.
            </p>

            <form onSubmit={handleAddCardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Bank</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Axis Bank">Axis Bank (Flipkart Axis, Magnus)</option>
                  <option value="ICICI Bank">ICICI Bank (Amazon Pay, Sapphiro)</option>
                  <option value="HDFC Bank">HDFC Bank (Infinia, Regalia, Millennia)</option>
                  <option value="SBI Card">SBI Card (SimplyCLICK, PRIME)</option>
                  <option value="Kotak Bank">Kotak Mahindra Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Product Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={last4}
                    onChange={(e) => setLast4(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MasterCard</option>
                    <option value="RUPAY">RuPay</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Credit Limit (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="w-1/2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl shadow transition"
                >
                  Save & Enable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
