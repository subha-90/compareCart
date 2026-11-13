'use client';

import React from 'react';
import { useCompareCart } from '../lib/store';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Package,
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { EscrowOrderStatus } from '../types';

export const EscrowLedger: React.FC = () => {
  const { orders, advanceOrderStatus, metrics } = useCompareCart();

  const getStatusBadge = (status: EscrowOrderStatus) => {
    switch (status) {
      case 'ESCROW_DEPOSITED':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">1. Escrow Deposited</span>;
      case 'ORDER_PLACING':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">2. Order In Placing</span>;
      case 'MERCHANT_CONFIRMED':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">3. Merchant Confirmed</span>;
      case 'DISPATCHED':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">4. Dispatched / In Transit</span>;
      case 'DELIVERED':
        return <span className="bg-teal-100 text-teal-800 border border-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full">5. Delivered to Buyer</span>;
      case 'RETURN_WINDOW_CLOSED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">6. Return Window Closed</span>;
      case 'SETTLED':
        return <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">7. Escrow Settled & Disbursed</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Escrow Pool Value</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{metrics.escrowPoolValue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Nodal Escrow Backed</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Buyer Savings</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{metrics.totalSavingsDelivered.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500">Across {metrics.totalOrdersProcessed.toLocaleString()} orders</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>State Machine Integrity</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">0 Disputes</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Automated Return Window Lock</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Escrow & Settlement Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks buyer deposits, cardholder order placement, delivery verification, and automated payouts.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Click <strong>"Advance Status"</strong> to simulate step-by-step transaction fulfillment.
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {orders.map((order) => (
            <div key={order.id} className="p-5 hover:bg-slate-50/60 transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Product & Order info */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-700">{order.productTitle}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Buyer: <strong className="text-slate-800">{order.buyerName}</strong> ({order.buyerAddress.city})</span>
                      <span>•</span>
                      <span>Merchant Ref: <strong className="font-mono text-slate-700">{order.merchantOrderRef}</strong></span>
                      <span>•</span>
                      <span>AWB: <strong className="font-mono text-blue-700">{order.awbTrackingNumber}</strong></span>
                    </div>

                    {order.partnerName && (
                      <div className="text-xs text-blue-800 font-medium mt-1">
                        💳 Fulfilled via Partner: <strong>{order.partnerName}</strong> ({order.partnerCardUsed})
                      </div>
                    )}
                  </div>
                </div>

                {/* Financials & Status Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between lg:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Escrow Deposited</span>
                    <span className="text-base font-black text-slate-900">₹{order.effectivePricePaid.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      Saved ₹{order.totalSavings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1.5">
                    {getStatusBadge(order.status)}

                    {order.status !== 'SETTLED' && (
                      <button
                        onClick={() => advanceOrderStatus(order.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-center">
                  {[
                    'Escrow Locked',
                    'Card Placed',
                    'Confirmed',
                    'Dispatched',
                    'Delivered',
                    'Window Closed',
                    'Settled',
                  ].map((stepName, idx) => {
                    const statusSequence: EscrowOrderStatus[] = [
                      'ESCROW_DEPOSITED',
                      'ORDER_PLACING',
                      'MERCHANT_CONFIRMED',
                      'DISPATCHED',
                      'DELIVERED',
                      'RETURN_WINDOW_CLOSED',
                      'SETTLED'
                    ];
                    const currentIdx = statusSequence.indexOf(order.status);
                    const isPassed = currentIdx >= idx;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-3.5 h-3.5 rounded-full mb-1 flex items-center justify-center text-[8px] font-bold transition ${
                            isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] ${isPassed ? 'font-bold text-emerald-800' : 'text-slate-400'}`}>
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
