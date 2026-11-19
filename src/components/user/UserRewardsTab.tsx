'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { EscrowOrder } from '../../types';

interface UserRewardsTabProps {
  onNavigateHome: () => void;
  orders: EscrowOrder[];
  onOpenMyCards: () => void;
}

export const UserRewardsTab: React.FC<UserRewardsTabProps> = ({
  onNavigateHome,
  orders,
  onOpenMyCards,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNavigateHome}
          className="w-9 h-9 rounded-full bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight">My Savings</h2>
      </div>

      {/* Big Total Saved Card */}
      <div className="rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#1B1D27] dark:via-[#161821] dark:to-[#101116] border border-[#E8ECF4] dark:border-white/10 p-6 sm:p-8 shadow-soft relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Total Saved
            </span>
            <p className="text-4xl sm:text-5xl font-black text-[#101936] dark:text-white mt-1">
              ₹18,450
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-[#7047F5] flex items-center justify-center border border-purple-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* 3 Metrics Pill Row */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/5 text-center">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Orders</span>
            <p className="text-lg font-bold text-[#101936] dark:text-white mt-0.5">{orders.length || 12}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Avg. Savings</span>
            <p className="text-lg font-bold text-[#101936] dark:text-white mt-0.5">₹1,537</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Best Deal</span>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">24%</p>
          </div>
        </div>
      </div>

      {/* "Your Rewards" Card with Gold Coins */}
      <div
        onClick={onOpenMyCards}
        className="cursor-pointer rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-5 sm:p-6 shadow-soft hover:shadow-glow-purple hover:border-[#7047F5]/40 transition flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center text-2xl shadow-sm shrink-0">
            🪙
          </div>

          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your Earnings</span>
            <h4 className="text-2xl font-black text-[#101936] dark:text-white">₹1,845</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">10% share from card-linked purchases</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Escrow Orders Ledger */}
      <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-[#E8ECF4] dark:border-white/10 p-6 shadow-soft space-y-4">
        <h3 className="text-base font-bold tracking-tight">Recent Escrow Transactions</h3>
        {orders.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 text-center text-xs text-slate-500">
            No pending escrow transactions. Completed orders settle automatically within 24 hours of delivery.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{order.orderNumber}</p>
                  <p className="text-[11px] text-slate-500">{order.productTitle}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{order.totalSavings.toLocaleString('en-IN')} Saved</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{order.status.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
