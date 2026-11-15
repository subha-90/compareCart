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
import { TrendingDown, ArrowDownRight, CheckCircle2, Info, Calendar } from 'lucide-react';
import { Product } from '../types';

interface PriceHistoryChartProps {
  product: Product;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ product }) => {
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '180D'>('180D');

  const chartData = product.priceHistory.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    fullDate: point.date,
    Flipkart: point.flipkartPrice,
    Amazon: point.amazonPrice,
    Croma: point.cromaPrice,
    event: point.event,
  }));

  const lowestPrice = product.lowestHistoricalPrice;
  const currentBestListed = Math.min(...product.listings.map(l => l.listedPrice));

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-6 border border-white/[0.08] shadow-2xl">
      {/* Header with Title and Range Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.08] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
              Price Trend & Volatility Analysis
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full gold-foil-badge text-amber-300">
              180-Day History
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Multi-store cross-pricing trends tracking lowest ever recorded price drops
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/[0.08] text-xs">
          {(['30D', '90D', '180D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-xl font-semibold transition ${
                timeframe === t
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-zinc-950/60 border border-white/[0.08] rounded-2xl p-4 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Best Price</span>
          <p className="text-lg font-black text-white mt-1">₹{currentBestListed.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3 inline" /> {product.priceDropPercentage}% below MRP
          </span>
        </div>

        <div className="emerald-foil-badge rounded-2xl p-4 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">All-Time Lowest Ever</span>
          <p className="text-lg font-black text-emerald-200 mt-1">₹{lowestPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
            Record Low
          </span>
        </div>

        <div className="bg-zinc-950/60 border border-white/[0.08] rounded-2xl p-4 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">180-Day Moving Avg</span>
          <p className="text-lg font-black text-zinc-300 mt-1">₹{product.averageHistoricalPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Baseline Mean</span>
        </div>

        <div className="bg-zinc-950/60 border border-white/[0.08] rounded-2xl p-4 shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Launch MSRP</span>
          <p className="text-lg font-black text-zinc-400 mt-1">₹{product.highestHistoricalPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-zinc-600 mt-1 block">Reference Ceiling</span>
        </div>
      </div>

      {/* Deal Intelligence Verdict */}
      <div className="bg-zinc-950/90 border border-white/10 text-zinc-200 rounded-2xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <strong className="text-white">Price Intelligence Verdict:</strong>
          <span className="text-zinc-400">{product.buyRecommendationReason}</span>
        </div>
        <span className="emerald-foil-badge text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full shrink-0 tracking-wider">
          STRONG BUY
        </span>
      </div>

      {/* Professional Chart */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="azGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
            />
            <YAxis
              domain={['dataMin - 2000', 'dataMax + 1000']}
              stroke="#71717a"
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
                    <div className="bg-zinc-950/95 backdrop-blur-xl text-white text-xs p-3.5 rounded-2xl shadow-2xl border border-white/10 space-y-2 min-w-[170px]">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                        <span className="font-semibold text-zinc-400">{label}</span>
                        {event && <span className="text-amber-300 text-[10px] font-bold">★ {event}</span>}
                      </div>
                      {payload.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-[11px]">
                          <span style={{ color: item.color }} className="font-medium">{item.name}</span>
                          <span className="font-bold text-white">₹{item.value?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={lowestPrice}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: `Record Low: ₹${(lowestPrice / 1000).toFixed(0)}k`,
                fill: '#34d399',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="Flipkart"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fkGradient)"
            />
            <Area
              type="monotone"
              dataKey="Amazon"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#azGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
            <span className="text-zinc-400 font-medium">Flipkart Live</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
            <span className="text-zinc-400 font-medium">Amazon India</span>
          </span>
        </div>
        <span className="text-zinc-600 font-mono">Calibrated daily via real-time feeds</span>
      </div>
    </div>
  );
};
