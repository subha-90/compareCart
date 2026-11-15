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
  TrendingUp,
  FileText
} from 'lucide-react';
import { EscrowOrderStatus } from '../types';

export const EscrowLedger: React.FC = () => {
  const { orders, advanceOrderStatus, metrics } = useCompareCart();

  const getStatusBadge = (status: EscrowOrderStatus) => {
    switch (status) {
      case 'ESCROW_DEPOSITED':
        return <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">1. Escrow Deposited</span>;
      case 'ORDER_PLACING':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">2. Cardholder Placing</span>;
      case 'MERCHANT_CONFIRMED':
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">3. Retailer Confirmed</span>;
      case 'DISPATCHED':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">4. Courier In Transit</span>;
      case 'DELIVERED':
        return <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">5. Delivered to Buyer</span>;
      case 'RETURN_WINDOW_CLOSED':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">6. Return Closed</span>;
      case 'SETTLED':
        return <span className="bg-zinc-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">7. Escrow Disbursed</span>;
      default:
        return <span className="bg-zinc-100 text-zinc-700 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Escrow Reserve Pool</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1.5">₹{metrics.escrowPoolValue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-zinc-400 font-medium mt-1 block">100% RBI Nodal Escrow Backed</span>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Consumer Savings Delivered</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1.5">₹{metrics.totalSavingsDelivered.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-zinc-400 font-medium mt-1 block">{metrics.totalOrdersProcessed.toLocaleString()} orders verified</span>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Dispute Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1.5">0.00%</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Automated Return Lock Active</span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-950/60">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">
              Escrow Transaction & Settlement Ledger
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Multi-party cryptographic verification of buyer deposits, cardholder order placement, and payout release.
            </p>
          </div>

          <div className="text-xs text-zinc-400 font-mono">
            Click <strong className="text-white">&quot;Advance Status&quot;</strong> to simulate transactional transitions.
          </div>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {orders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-white/[0.02] transition duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Product & Order info */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-12 h-12 object-cover rounded-xl border border-white/10 shrink-0 bg-zinc-950"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-white">{order.orderNumber}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs font-bold text-zinc-200">{order.productTitle}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 mt-1">
                      <span>Buyer: <strong className="text-white">{order.buyerName}</strong> ({order.buyerAddress.city})</span>
                      <span className="text-zinc-600">•</span>
                      <span>Ref: <strong className="font-mono text-zinc-300">{order.merchantOrderRef}</strong></span>
                      <span className="text-zinc-600">•</span>
                      <span>AWB: <strong className="font-mono text-blue-400">{order.awbTrackingNumber}</strong></span>
                    </div>

                    {order.partnerName && (
                      <div className="text-[11px] text-zinc-400 font-medium mt-1">
                        💳 Cardholder: <strong className="text-zinc-200">{order.partnerName}</strong> ({order.partnerCardUsed})
                      </div>
                    )}
                  </div>
                </div>

                {/* Financials & Status Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between lg:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Escrow Deposited</span>
                    <span className="text-sm font-extrabold text-zinc-900">₹{order.effectivePricePaid.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Saved ₹{order.totalSavings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1.5">
                    {getStatusBadge(order.status)}

                    {order.status !== 'SETTLED' && (
                      <button
                        onClick={() => advanceOrderStatus(order.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg border border-zinc-200 transition"
                      >
                        <span>Advance Status</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-center font-mono">
                  {[
                    'Escrow Locked',
                    'Card Placed',
                    'Confirmed',
                    'Dispatched',
                    'Delivered',
                    'Return Closed',
                    'Disbursed',
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
                          className={`w-3 h-3 rounded-full mb-1 flex items-center justify-center text-[7px] font-bold transition ${
                            isPassed ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-400'
                          }`}
                        >
                          {isPassed ? '✓' : ''}
                        </div>
                        <span className={`text-[9px] ${isPassed ? 'font-bold text-zinc-800' : 'text-zinc-400'}`}>
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
