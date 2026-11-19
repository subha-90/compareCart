'use client';

import React from 'react';
import { Check, PackageCheck } from 'lucide-react';
import { EscrowOrder, PartnerCardholder } from '../../types';

interface EscrowConfirmedStepProps {
  createdOrder: EscrowOrder;
  matchedPartner: PartnerCardholder;
  onClose: () => void;
}

export const EscrowConfirmedStep: React.FC<EscrowConfirmedStepProps> = ({
  createdOrder,
  matchedPartner,
  onClose,
}) => {
  return (
    <div className="space-y-4 text-center py-2 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-[#30d158] flex items-center justify-center mx-auto border border-emerald-500/30">
        <Check className="w-7 h-7 stroke-[3]" />
      </div>

      <div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Order Locked in Escrow</h3>
        <p className="text-xs text-slate-500 dark:text-[#86868b] mt-0.5 font-mono">
          Order Ref: <strong className="text-slate-900 dark:text-white font-bold">{createdOrder.orderNumber}</strong>
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
        {createdOrder.razorpayPaymentId && (
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/10">
            <span className="text-slate-600 dark:text-[#86868b]">Razorpay Payment ID:</span>
            <span className="font-semibold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded text-[11px] dark:text-[#30d158]">
              {createdOrder.razorpayPaymentId}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-[#86868b]">Merchant Reference:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.merchantOrderRef}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-[#86868b]">Courier Tracking:</span>
          <span className="font-semibold text-[#2864FF] dark:text-[#2997ff]">{createdOrder.awbTrackingNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-[#86868b]">Estimated Delivery:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.estimatedDelivery}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-[#86868b]">Partner Cardholder:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.partnerName || matchedPartner.name}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-white/10 font-medium font-sans">
          <span className="text-slate-800 dark:text-zinc-300 font-bold">Amount in Escrow:</span>
          <span className="text-emerald-600 dark:text-[#30d158] font-extrabold text-sm">
            ₹{createdOrder.effectivePricePaid.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button
          onClick={onClose}
          className="cc-gradient-btn w-full py-3.5 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-glow-blue"
        >
          <PackageCheck className="w-4 h-4 text-white" />
          <span>Go to My Purchases & Escrow Tracking</span>
        </button>
        <p className="text-[11px] text-slate-500 dark:text-[#86868b] text-center font-medium">
          Redirecting to Orders in 3 seconds...
        </p>
      </div>
    </div>
  );
};
