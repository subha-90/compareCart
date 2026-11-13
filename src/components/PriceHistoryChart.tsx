'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TrendingDown, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface PriceHistoryChartProps {
  product: Product;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ product }) => {
  const [activeRange, setActiveRange] = useState<'3M' | '6M' | 'ALL'>('ALL');

  // Format data for chart
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      {/* Header with Price Radar Insight Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Price Radar Engine
            </span>
            <h3 className="text-base font-bold text-slate-900">Historical Price Intelligence</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time price tracker across Flipkart, Amazon, and Croma over 180 days
          </p>
        </div>

        {/* Price Recommendation Pill */}
        <div className="flex items-center gap-2">
          {product.buyRecommendation === 'STRONG_BUY' ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold">
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>GOOD TIME TO BUY</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>FAIR PRICE</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <span className="text-[11px] text-slate-500 font-medium">Current Best Listed</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">₹{currentBestListed.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3 inline" /> {product.priceDropPercentage}% lower
          </span>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
          <span className="text-[11px] text-emerald-700 font-medium">All-Time Lowest Ever</span>
          <p className="text-base font-bold text-emerald-800 mt-0.5">₹{lowestPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-700 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> Festival Record
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <span className="text-[11px] text-slate-500 font-medium">Average Market Price</span>
          <p className="text-base font-bold text-slate-700 mt-0.5">₹{product.averageHistoricalPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">180-day baseline</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <span className="text-[11px] text-slate-500 font-medium">Highest Recorded</span>
          <p className="text-base font-bold text-slate-600 mt-0.5">₹{product.highestHistoricalPrice.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400">Launch MSRP</span>
        </div>
      </div>

      {/* Recommendation Explanation */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-xl p-3 mb-4 text-xs text-slate-700 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-emerald-900">Deal Verdict: </strong>
          <span>{product.buyRecommendationReason}</span>
        </div>
      </div>

      {/* Interactive Line Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 2000', 'dataMax + 2000']}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const eventPoint = payload[0]?.payload?.event;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
                      <div className="font-semibold text-slate-300 border-b border-slate-700 pb-1 flex justify-between gap-4">
                        <span>{label}</span>
                        {eventPoint && <span className="text-amber-400 font-bold">★ {eventPoint}</span>}
                      </div>
                      {payload.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between gap-4 items-center">
                          <span style={{ color: item.color }} className="font-medium">
                            {item.name}:
                          </span>
                          <span className="font-bold text-white">₹{item.value?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
            />
            <ReferenceLine
              y={lowestPrice}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: `Lowest: ₹${(lowestPrice / 1000).toFixed(0)}k`,
                fill: '#059669',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />
            <Line
              type="monotone"
              dataKey="Flipkart"
              stroke="#2874f0"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#2874f0' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Amazon"
              stroke="#ff9900"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ff9900' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Croma"
              stroke="#00e5d4"
              strokeWidth={2}
              dot={{ r: 2, fill: '#00e5d4' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
