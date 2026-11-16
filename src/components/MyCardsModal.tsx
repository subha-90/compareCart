'use client';

import React, { useState } from 'react';
import { X, CreditCard, Plus, ShieldCheck, CheckCircle2, Coins, ArrowRight, Lock, Zap } from 'lucide-react';
import { useCompareCart } from '../lib/store';

interface MyCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyCardsModal: React.FC<MyCardsModalProps> = ({ isOpen, onClose }) => {
  const { partners } = useCompareCart();
  const [showAddForm, setShowAddForm] = useState(false);
  const [bankName, setBankName] = useState('HDFC Bank');
  const [cardType, setCardType] = useState('Infinia Metal Edition');
  const [limit, setLimit] = useState('100000');
  const [last4, setLast4] = useState('8842');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const mockCards = [
    {
      id: 'c1',
      bank: 'HDFC Bank',
      name: 'Infinia Metal',
      last4: '4092',
      dailyLimit: '₹1,50,000',
      availableLimit: '₹1,24,000',
      earnedRewards: '₹1,240',
      status: 'Active & Verified',
      gradient: 'from-[#101936] via-[#1B1D27] to-[#2864FF]/60',
      accent: '#2864FF'
    },
    {
      id: 'c2',
      bank: 'ICICI Bank',
      name: 'Amazon Pay ICICI',
      last4: '9921',
      dailyLimit: '₹75,000',
      availableLimit: '₹62,500',
      earnedRewards: '₹605',
      status: 'Active & Verified',
      gradient: 'from-[#1B1D27] via-[#252837] to-[#7047F5]/60',
      accent: '#7047F5'
    }
  ];

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1B1D27] rounded-3xl border border-[#E8ECF4] dark:border-white/10 shadow-2xl overflow-hidden text-[#101936] dark:text-white transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8ECF4] dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2864FF] to-[#7047F5] flex items-center justify-center text-white shadow-glow-blue">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">My Linked Cards</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Earn 10% platform rewards whenever your card unlocks discounts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Rewards Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2864FF]/10 via-[#7047F5]/10 to-transparent border border-[#2864FF]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Total Rewards Earned</span>
                <p className="text-xl font-black text-[#101936] dark:text-white">₹1,845</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" /> 10% Share Active
            </div>
          </div>

          {!showAddForm ? (
            <>
              {/* Linked Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Active Cards ({mockCards.length})</h4>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2864FF] dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Link New Card
                  </button>
                </div>

                <div className="grid gap-3">
                  {mockCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-5 rounded-2xl bg-gradient-to-r dark:bg-gradient-to-r from-slate-50 to-slate-100 dark:from-[#252837] dark:to-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">{card.bank}</p>
                          <h5 className="text-base font-bold text-[#101936] dark:text-white">{card.name}</h5>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {card.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-white/5">
                        <span>Ending in •••• {card.last4}</span>
                        <span>Daily Limit: <strong className="text-slate-800 dark:text-white">{card.dailyLimit}</strong></span>
                        <span>Earned: <strong className="text-emerald-600 dark:text-emerald-400">{card.earnedRewards}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-[#E8ECF4] dark:border-white/5 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-5 h-5 text-[#2864FF] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-200 font-semibold">Zero-Knowledge Card Linking</strong>
                  <p className="mt-0.5">CompareCart never asks for or stores your CVV or PIN. Transactions occur exclusively via RBI-authorized 2FA dual-channel OTP and nodal escrow.</p>
                </div>
              </div>
            </>
          ) : (
            /* Add Card Form */
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Link a Partner Credit Card</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Issuing Bank</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-[#E8ECF4] dark:border-white/10 text-sm focus:outline-none focus:border-[#2864FF]"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="SBI Card">SBI Card</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Card Variant</label>
                <input
                  type="text"
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  placeholder="e.g. Millennia, Regalia, Flipkart Axis"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-[#E8ECF4] dark:border-white/10 text-sm focus:outline-none focus:border-[#2864FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={last4}
                    onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
                    placeholder="4092"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-[#E8ECF4] dark:border-white/10 text-sm focus:outline-none focus:border-[#2864FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Daily Sharing Limit (₹)</label>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="50000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-[#E8ECF4] dark:border-white/10 text-sm focus:outline-none focus:border-[#2864FF]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSuccess}
                className="w-full py-3 rounded-full cc-gradient-btn text-white font-semibold text-sm shadow-glow-blue flex items-center justify-center gap-2 mt-4"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Card Linked & Verified!
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Link Card & Start Earning 10%
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
