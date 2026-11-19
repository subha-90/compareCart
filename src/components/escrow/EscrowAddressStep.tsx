'use client';

import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface EscrowAddressStepProps {
  merchantName: string;
  buyerName: string;
  setBuyerName: (name: string) => void;
  buyerPhone: string;
  setBuyerPhone: (phone: string) => void;
  addressLine: string;
  setAddressLine: (line: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  pincode: string;
  setPincode: (pin: string) => void;
  onBack: () => void;
  onProceed: () => void;
}

export const EscrowAddressStep: React.FC<EscrowAddressStepProps> = ({
  merchantName,
  buyerName,
  setBuyerName,
  buyerPhone,
  setBuyerPhone,
  addressLine,
  setAddressLine,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  onBack,
  onProceed,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] rounded-2xl p-3.5 text-xs text-slate-700 dark:text-zinc-300 flex items-start gap-2.5">
        <MapPin className="w-4 h-4 text-[#2864FF] shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900 dark:text-white font-bold">Direct Delivery to Your Address:</strong>
          The order is booked directly in your name on {merchantName} with original GST tax invoice.
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Full Name</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Mobile Number (For Delivery OTP)</label>
          <input
            type="text"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="w-full text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-mono font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Address</label>
          <input
            type="text"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            className="w-full text-xs p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-medium"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Pincode</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 dark:bg-black/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-[#2864FF] focus:ring-1 focus:ring-[#2864FF]/30 font-mono font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onBack}
          className="w-1/3 text-xs py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-white/[0.06] dark:text-[#86868b] dark:border-transparent dark:hover:text-white font-semibold transition"
        >
          Back
        </button>
        <button
          onClick={onProceed}
          className="cc-gradient-btn w-2/3 text-xs py-3 rounded-full flex items-center justify-center gap-1.5 font-bold text-white shadow-glow-blue"
        >
          <span>Proceed to Escrow Deposit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
