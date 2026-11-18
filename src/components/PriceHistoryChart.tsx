'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingDown,
  ArrowDownRight,
  CheckCircle2,
  Bell,
  Clock,
  Sparkles,
  Smartphone,
  Mail,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../types';
import {
  analyzeProductPrice,
  filterHistoryByTimeframe,
} from '../lib/price-tracking/price-tracker';

interface PriceHistoryChartProps {
  product: Product;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ product }) => {
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '180D'>('180D');

  // Price Alert Subscription State
  const [targetPrice, setTargetPrice] = useState<number>(() => {
    const minP = Math.min(...product.listings.map((l) => l.listedPrice));
    return Math.round((minP * 0.95) / 500) * 500;
  });
  const [alertChannel, setAlertChannel] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [alertContact, setAlertContact] = useState<string>('+91 98201 44521');
  const [isAlertSaved, setIsAlertSaved] = useState(false);

  const analysis = analyzeProductPrice(product);
  const filteredPoints = filterHistoryByTimeframe(product.priceHistory, timeframe);

  const chartData = filteredPoints.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    fullDate: point.date,
    Flipkart: point.flipkartPrice,
    Amazon: point.amazonPrice,
    Croma: point.cromaPrice,
    event: point.event,
  }));

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertSaved(true);
    setTimeout(() => setIsAlertSaved(false), 4500);
  };

  return (
    <div className="bg-white dark:bg-[#1B1D27] rounded-3xl p-6 sm:p-7 space-y-6 border border-[#E8ECF4] dark:border-white/[0.08] shadow-sm text-[#101936] dark:text-[#F8FAFC]">
      {/* 1. Header with Title and Range Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8ECF4] dark:border-white/[0.08] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#101936] dark:text-white">
              Price Trend & Volatility Analysis
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {timeframe} Trajectory
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Real-time cross-store tracking calibrated against historical lows & moving averages
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#F8F9FC] dark:bg-[#101116] p-1.5 rounded-2xl border border-[#E8ECF4] dark:border-white/[0.08] text-xs">
          {(['30D', '90D', '180D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-xl font-semibold transition ${
                timeframe === t
                  ? 'bg-white dark:bg-[#252837] text-[#2864FF] dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#F8F9FC] dark:bg-[#252837]/50 border border-[#E8ECF4] dark:border-white/[0.08] rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Current Best
          </span>
          <p className="text-xl font-black text-[#101936] dark:text-white mt-1">
            ₹{analysis.currentBestPrice.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3 inline" />
            {analysis.verdict.percentFromHigh}% from peak
          </span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            All-Time Lowest
          </span>
          <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            ₹{analysis.allTimeLow.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            Record Benchmark
          </span>
        </div>

        <div className="bg-[#F8F9FC] dark:bg-[#252837]/50 border border-[#E8ECF4] dark:border-white/[0.08] rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            180-Day Average
          </span>
          <p className="text-xl font-black text-slate-700 dark:text-zinc-200 mt-1">
            ₹{analysis.movingAverage.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1 block">
            Baseline Mean
          </span>
        </div>

        <div className="bg-[#F8F9FC] dark:bg-[#252837]/50 border border-[#E8ECF4] dark:border-white/[0.08] rounded-2xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
            Recorded High
          </span>
          <p className="text-xl font-black text-slate-500 dark:text-zinc-400 mt-1">
            ₹{analysis.allTimeHigh.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
            Launch Ceiling
          </span>
        </div>
      </div>

      {/* 3. AI Buy Recommendation Capsule */}
      <div className="bg-[#F8F9FC] dark:bg-[#101116] border border-[#E8ECF4] dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2864FF]/10 text-[#2864FF] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#101936] dark:text-white">
                Price Intelligence Advice:
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${analysis.verdict.badgeClass}`}>
                {analysis.verdict.badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 leading-snug">
              {analysis.verdict.reason}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Professional Multi-Store Area Chart */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2864FF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2864FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="azGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9900" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.12)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(150, 150, 150, 0.15)' }}
            />
            <YAxis
              domain={['dataMin - 2000', 'dataMax + 1000']}
              stroke="#888888"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const event = payload[0]?.payload?.event;
                  return (
                    <div className="bg-white dark:bg-[#1B1D27] text-[#101936] dark:text-white text-xs p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 space-y-2 min-w-[170px]">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-1.5">
                        <span className="font-semibold text-slate-500 dark:text-zinc-400">{label}</span>
                        {event && <span className="text-amber-500 text-[10px] font-bold">★ {event}</span>}
                      </div>
                      {payload.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-[11px]">
                          <span style={{ color: item.color }} className="font-medium">
                            {item.name}
                          </span>
                          <span className="font-bold text-[#101936] dark:text-white">
                            ₹{item.value?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={analysis.allTimeLow}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: `Record Low: ₹${(analysis.allTimeLow / 1000).toFixed(0)}k`,
                fill: '#10b981',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="Flipkart"
              stroke="#2864FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fkGradient)"
            />
            <Area
              type="monotone"
              dataKey="Amazon"
              stroke="#FF9900"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#azGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 5. Chart Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500 pt-2 border-t border-[#E8ECF4] dark:border-white/[0.08]">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2864FF]" />
            <span className="text-slate-600 dark:text-zinc-300 font-medium">Flipkart</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" />
            <span className="text-slate-600 dark:text-zinc-300 font-medium">Amazon India</span>
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">Indexed daily</span>
      </div>

      {/* 6. Target Price Drop Alert Widget */}
      <div className="mt-4 pt-5 border-t border-[#E8ECF4] dark:border-white/[0.08]">
        <div className="bg-[#F8F9FC] dark:bg-[#101116] rounded-2xl p-5 border border-[#E8ECF4] dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7047F5]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#101936] dark:text-white">
                Set Instant Price Drop Alert
              </h4>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Free Alert Service
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
            We track Flipkart & Amazon every 15 minutes. We will notify you immediately when this drops below your target.
          </p>

          <form onSubmit={handleSetAlert} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block mb-1">
                Target Alert Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1B1D27] text-xs font-bold text-[#101936] dark:text-white focus:outline-none focus:border-[#2864FF]"
                  placeholder="70000"
                />
              </div>
            </div>

            <div className="sm:col-span-5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Notify Via {alertChannel}
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setAlertChannel('WHATSAPP')}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      alertChannel === 'WHATSAPP'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertChannel('EMAIL')}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      alertChannel === 'EMAIL'
                        ? 'bg-[#2864FF] text-white'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={alertContact}
                onChange={(e) => setAlertContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1B1D27] text-xs font-medium text-[#101936] dark:text-white focus:outline-none focus:border-[#2864FF]"
                placeholder={alertChannel === 'WHATSAPP' ? '+91 98201 44521' : 'shopper@example.com'}
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#2864FF] hover:bg-[#2052d9] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95"
              >
                {isAlertSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Alert Active!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Track Price</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {isAlertSaved && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                Price drop alert activated! You will receive a {alertChannel} message at {alertContact} as soon as this drops below ₹{targetPrice.toLocaleString('en-IN')}.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
