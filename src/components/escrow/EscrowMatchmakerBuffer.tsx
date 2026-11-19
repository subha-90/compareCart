'use client';

import React from 'react';
import { Radio, Check, CreditCard, Clock, Zap } from 'lucide-react';
import { PartnerCardholder } from '../../types';

interface EscrowMatchmakerBufferProps {
  matchedPartner: PartnerCardholder;
  matchStatus: 'searching' | 'accepted';
  matchProgress: number;
  bankName: string;
  onInstantAccept: () => void;
}

export const EscrowMatchmakerBuffer: React.FC<EscrowMatchmakerBufferProps> = ({
  matchedPartner,
  matchStatus,
  matchProgress,
  bankName,
  onInstantAccept,
}) => {
  const matchedCard = matchedPartner?.cardsHeld[0];

  return (
    <div className="py-4 space-y-6 text-center animate-fade-in">
      {/* Radar Pulse Animation */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping duration-1000" />
        <span className="absolute inset-2 rounded-full bg-[#7047F5]/20 animate-pulse duration-700" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#2864FF] to-[#7047F5] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          {matchStatus === 'accepted' ? (
            <Check className="w-8 h-8 text-white stroke-[3] animate-scale-in" />
          ) : (
            <Radio className="w-8 h-8 text-white animate-spin duration-3000" />
          )}
        </div>
      </div>

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-mono uppercase tracking-wider font-bold mb-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{matchStatus === 'accepted' ? 'CARDHOLDER CLAIM CONFIRMED' : 'ACTIVE POOL MATCHMAKING'}</span>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {matchStatus === 'accepted'
            ? 'Cardholder Accepted Your Swipe Request!'
            : 'Searching for Cardholders in Liquidity Pool...'}
        </h3>
        <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 max-w-sm mx-auto font-medium">
          {matchStatus === 'accepted'
            ? `${matchedPartner.name} locked ${matchedCard?.bank} card limit. Order moving to confirmed state...`
            : `In-app notification broadcast to verified ${bankName} cardholders across Mumbai, Bengaluru & Delhi.`}
        </p>
      </div>

      {/* Dynamic Progress Bar */}
      <div className="w-full max-w-sm mx-auto bg-slate-100 dark:bg-black/50 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
        <div
          className="bg-gradient-to-r from-[#2864FF] to-[#7047F5] h-full transition-all duration-700 rounded-full"
          style={{ width: `${matchProgress}%` }}
        />
      </div>

      {/* Cardholder Candidate Spotlight */}
      <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 max-w-md mx-auto text-left shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 tracking-wider">
            Priority Network Match
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            Trust Score {matchedPartner.trustScore}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <img
            src={matchedPartner.avatar}
            alt={matchedPartner.name}
            className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-white/10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{matchedPartner.name}</p>
            <p className="text-[11px] text-[#2864FF] font-semibold truncate flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-[#2864FF]" />
              {matchedCard?.bank} {matchedCard?.cardName} (..{matchedCard?.last4})
            </p>
            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
              Location: {matchedPartner.city} • Available Limit: ₹{matchedCard?.availableLimit.toLocaleString('en-IN')}
            </p>
          </div>

          {matchStatus === 'accepted' ? (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
              <Check className="w-3 h-3" /> Claimed
            </span>
          ) : (
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" /> Pinging...
            </span>
          )}
        </div>
      </div>

      {matchStatus !== 'accepted' && (
        <div className="pt-1">
          <button
            onClick={onInstantAccept}
            className="text-xs py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-white/10 dark:text-zinc-300 dark:hover:text-white transition font-semibold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Instant Cardholder Acceptance</span>
          </button>
        </div>
      )}
    </div>
  );
};
