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
    <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs">
      {/* Header with Title and Range Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Price Trend & Volatility Analysis</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
              180-Day History
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cross-merchant pricing history tracking lowest ever recorded price drops
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-xs">
          {(['30D', '90D', '180D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                timeframe === t
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-zinc-50/70 border border-zinc-200/70 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Current Best Price</span>
          <p className="text-base font-extrabold text-zinc-900 mt-0.5">₹{currentBestListed.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-3 h-3 inline" /> {product.priceDropPercentage}% below MRP
          </span>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">All-Time Lowest Ever</span>
          <p className="text-base font-extrabold text-emerald-800 mt-0.5">₹{lowestPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            Record Low
          </span>
        </div>

        <div className="bg-zinc-50/70 border border-zinc-200/70 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">180-Day Moving Avg</span>
          <p className="text-base font-extrabold text-zinc-700 mt-0.5">₹{product.averageHistoricalPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Baseline Mean</span>
        </div>

        <div className="bg-zinc-50/70 border border-zinc-200/70 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Launch MSRP</span>
          <p className="text-base font-extrabold text-zinc-600 mt-0.5">₹{product.highestHistoricalPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Reference Ceiling</span>
        </div>
      </div>

      {/* Deal Intelligence Verdict */}
      <div className="bg-zinc-900 text-zinc-200 rounded-xl p-3 mb-4 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <strong className="text-white">Price Intelligence Verdict:</strong>
          <span className="text-zinc-300">{product.buyRecommendationReason}</span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
          STRONG BUY
        </span>
      </div>

      {/* Professional Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="azGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e4e4e7' }}
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
                    <div className="bg-zinc-950 text-white text-xs p-3 rounded-xl shadow-xl border border-zinc-800 space-y-1.5 min-w-[160px]">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                        <span className="font-semibold text-zinc-400">{label}</span>
                        {event && <span className="text-amber-400 text-[10px] font-bold">★ {event}</span>}
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
              stroke="#059669"
              strokeDasharray="3 3"
              label={{
                value: `Record Low: ₹${(lowestPrice / 1000).toFixed(0)}k`,
                fill: '#059669',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="Flipkart"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#fkGradient)"
            />
            <Area
              type="monotone"
              dataKey="Amazon"
              stroke="#ea580c"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#azGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Flipkart Live
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> Amazon India
          </span>
        </div>
        <span>Data verified daily via automated merchant feeds</span>
      </div>
    </div>
  );
};
