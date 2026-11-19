'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Plus, UserCheck, X } from 'lucide-react';
import { PartnerCardholder } from '../../types';

interface PartnerCardsPortfolioProps {
  currentPartner: PartnerCardholder;
  onAddCard: (card: {
    bank: string;
    cardName: string;
    last4: string;
    network: 'VISA' | 'MASTERCARD' | 'RUPAY';
    monthlyLimit: number;
  }) => void;
  onUpdateLimit: (cardId: string, newLimit: number) => void;
}

export const PartnerCardsPortfolio: React.FC<PartnerCardsPortfolioProps> = ({
  currentPartner,
  onAddCard,
  onUpdateLimit,
}) => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newLimitInput, setNewLimitInput] = useState<number>(250000);
  const [bank, setBank] = useState('HDFC Bank');
  const [cardName, setCardName] = useState('HDFC Millennia Credit Card');
  const [last4, setLast4] = useState('8832');
  const [network, setNetwork] = useState<'VISA' | 'MASTERCARD' | 'RUPAY'>('VISA');
  const [monthlyLimit, setMonthlyLimit] = useState(250000);

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCard({
      bank,
      cardName,
      last4,
      network,
      monthlyLimit: Number(monthlyLimit),
    });
    setIsAddCardOpen(false);
  };

  const handleUpdateLimitSubmit = (cardId: string) => {
    onUpdateLimit(cardId, newLimitInput);
    setEditingCardId(null);
  };

  return (
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
                className="realistic-card keep-white p-5 sm:p-6 text-white flex flex-col justify-between border border-white/20 relative"
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
                    <h4 className="text-xs font-bold text-white !text-white card-name mt-0.5 tracking-wide" style={{ color: '#ffffff' }}>
                      {card.cardName}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20" style={{ color: '#ffffff' }}>
                    {card.network}
                  </span>
                </div>

                {/* EMV Chip & Contactless Wave */}
                <div className="flex items-center gap-3 my-2 relative z-10">
                  <div className="realistic-emv-chip" />
                  <svg className="w-4 h-4 text-amber-200/80 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.343 9.343c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  <span className="text-[10px] font-mono text-white/90 ml-auto tracking-wider card-cycle" style={{ color: '#ffffff' }}>
                    Cycle: {card.billingCycleDate}th
                  </span>
                </div>

                {/* Card Number & Available Limit */}
                <div className="relative z-10">
                  <p className="font-mono text-xs sm:text-sm font-bold text-white tracking-[0.25em] drop-shadow-md" style={{ color: '#ffffff' }}>
                    •••• •••• •••• {card.last4}
                  </p>

                  {isEditing ? (
                    <div className="mt-2 space-y-1.5 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/20">
                      <label className="text-[10px] text-white block font-semibold" style={{ color: '#ffffff' }}>New Monthly Limit (₹):</label>
                      <input
                        type="number"
                        step="10000"
                        value={newLimitInput}
                        onChange={(e) => setNewLimitInput(Number(e.target.value))}
                        className="w-full bg-zinc-900 text-white text-xs p-1 rounded border border-white/20 font-mono"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateLimitSubmit(card.id)}
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
                        <span className="text-white/90 font-medium" style={{ color: '#ffffff' }}>
                          Available: <strong className="text-white !text-white card-limit font-bold" style={{ color: '#ffffff' }}>₹{card.availableLimit.toLocaleString('en-IN')}</strong>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/80 card-limit-max" style={{ color: '#ffffff' }}>Max: ₹{(card.monthlyLimit / 100000).toFixed(1)}L</span>
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

      {/* Add Card Modal */}
      {isAddCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1c1c1e] text-[#f5f5f7] rounded-[28px] max-w-md w-full p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h3 className="font-semibold text-white text-sm">Add New Card to Partner Pool</h3>
              <button onClick={() => setIsAddCardOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Bank Name</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white"
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="SBI Card">SBI Card</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Bank">Kotak Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Card Product Name</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white"
                  placeholder="e.g. ICICI Emeralde Private Metal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={last4}
                    onChange={(e) => setLast4(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono"
                    placeholder="9942"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Payment Network</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white"
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="RUPAY">RUPAY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Allocated Monthly Limit (₹)</label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono"
                  placeholder="300000"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCardOpen(false)}
                  className="apple-pill-btn-secondary w-1/3 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-pill-btn w-2/3 py-2.5"
                >
                  Confirm Card Addition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
