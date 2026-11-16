'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCompareCart } from '../lib/store';
import { AppNotification } from '../types';

export const NotificationToastContainer: React.FC = () => {
  const { notifications, markNotificationAsRead } = useCompareCart();
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [copied, setCopied] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Listen for new notifications appearing in the store
  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];

    // Only toast notifications created within the last 15 seconds that haven't been shown
    const isRecent = Date.now() - new Date(latest.timestamp).getTime() < 15000;
    if (isRecent && !seenIds.has(latest.id)) {
      setActiveToast(latest);
      setSeenIds(prev => new Set(prev).add(latest.id));

      const timer = setTimeout(() => {
        setActiveToast(null);
      }, latest.type === 'otp' ? 12000 : 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, seenIds]);

  if (!activeToast) return null;

  const handleCopy = () => {
    if (activeToast.otpCode) {
      navigator.clipboard.writeText(activeToast.otpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDismiss = () => {
    markNotificationAsRead(activeToast.id);
    setActiveToast(null);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-[400px] w-full animate-fade-in pointer-events-auto">
      {activeToast.type === 'otp' ? (
        // Specialized Real-World SMS / Push Alert for OTP
        <div className="bg-[#1c1c1e]/95 backdrop-blur-2xl border border-purple-500/40 rounded-2xl p-4 shadow-[0_20px_60px_rgba(168,85,247,0.25)] text-white">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-purple-200">CompareCart Security SMS</span>
                <span className="text-[10px] text-zinc-400 block font-mono">Real-Time Verification</span>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-sans">
            {activeToast.message}
          </p>

          <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-300 font-semibold">
                OTP Code:
              </span>
              <span className="text-base font-mono font-bold tracking-widest text-white">
                {activeToast.otpCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-2 text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Valid for 5 minutes • Use to verify your account</span>
          </div>
        </div>
      ) : (
        // Standard Luxury Glass Notification Toast
        <div className="bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
            activeToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            activeToast.type === 'order' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            activeToast.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            activeToast.type === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {activeToast.type === 'success' && <ShieldCheck className="w-4 h-4" />}
            {activeToast.type === 'order' && <ShoppingBag className="w-4 h-4" />}
            {activeToast.type === 'warning' && <AlertCircle className="w-4 h-4" />}
            {activeToast.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {activeToast.type === 'info' && <Sparkles className="w-4 h-4" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-semibold text-white">{activeToast.title}</h4>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11.5px] text-zinc-300 mt-1 leading-snug">
              {activeToast.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
