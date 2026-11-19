'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  KeyRound,
  User,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Mail,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useCompareCart } from '../../lib/store';
import {
  isFirebaseConfigured,
  initRecaptchaVerifier,
  sendCarrierPhoneOtp,
  verifyCarrierPhoneOtp
} from '../../lib/firebase';

interface ForgotPasswordTabProps {
  initialIdentifier?: string;
  onSwitchToSignIn: (prefilledIdentifier?: string, prefilledPassword?: string) => void;
}

export const ForgotPasswordTab: React.FC<ForgotPasswordTabProps> = ({
  initialIdentifier = '',
  onSwitchToSignIn,
}) => {
  const {
    requestPasswordResetOTP,
    verifyPasswordReset,
    notifications,
  } = useCompareCart();

  const [resetIdentifier, setResetIdentifier] = useState(initialIdentifier);
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'done'>('request');
  const [resetOtpDigits, setResetOtpDigits] = useState(['', '', '', '', '', '']);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [resetChannel, setResetChannel] = useState<'both' | 'sms' | 'email'>('both');
  const [resetConfirmationResult, setResetConfirmationResult] = useState<any | null>(null);
  const resetOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetIdentifier) {
      setResetError('Please enter your registered Email, Mobile Number, or User ID.');
      return;
    }

    setIsLoading(true);

    // If phone number entered and Firebase configured, dispatch carrier SMS
    const isPhoneLike = /^[0-9+\s-]{10,}$/.test(resetIdentifier.trim());
    if (isPhoneLike && (resetChannel === 'sms' || resetChannel === 'both') && isFirebaseConfigured) {
      try {
        const verifier = initRecaptchaVerifier('firebase-recaptcha-reset');
        if (verifier) {
          const fbRes = await sendCarrierPhoneOtp(resetIdentifier, verifier);
          if (fbRes.success && fbRes.confirmationResult) {
            setResetConfirmationResult(fbRes.confirmationResult);
          }
        }
      } catch (fbErr) {
        console.warn('[Firebase] Reset SMS fallback to simulated mode:', fbErr);
      }
    }

    setTimeout(() => {
      const res = requestPasswordResetOTP(resetIdentifier);
      setIsLoading(false);
      if (res.success) {
        setResetStep('verify');
        setResendCountdown(30);
        setTimeout(() => resetOtpInputRefs.current[0]?.focus(), 100);
      } else {
        setResetError(res.message);
      }
    }, 400);
  };

  const handleResetOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...resetOtpDigits];
    newDigits[index] = value.slice(-1);
    setResetOtpDigits(newDigits);
    if (value && index < 5) {
      resetOtpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleAutoFillResetOtp = () => {
    const latestOtp = notifications.find(n => n.type === 'otp' && n.otpCode);
    if (latestOtp && latestOtp.otpCode) {
      setResetOtpDigits(latestOtp.otpCode.split(''));
      resetOtpInputRefs.current[5]?.focus();
    }
  };

  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const code = resetOtpDigits.join('');
    if (code.length < 6) {
      setResetError('Please enter the 6-digit reset code received on your Email & Mobile.');
      return;
    }

    if (!resetNewPassword || resetNewPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('New passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);

    if (resetConfirmationResult) {
      try {
        const fbVerify = await verifyCarrierPhoneOtp(resetConfirmationResult, code);
        if (fbVerify.success) {
          const res = verifyPasswordReset(resetIdentifier, code, resetNewPassword);
          setIsLoading(false);
          if (res.success) {
            setResetStep('done');
            return;
          }
        }
      } catch (err) {
        console.warn('[Firebase] Verification fallback to store:', err);
      }
    }

    setTimeout(() => {
      const res = verifyPasswordReset(resetIdentifier, code, resetNewPassword);
      setIsLoading(false);
      if (res.success) {
        setResetStep('done');
      } else {
        setResetError(res.message);
      }
    }, 400);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
      <button
        onClick={() => onSwitchToSignIn()}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition mb-1 font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Sign In</span>
      </button>

      {resetStep === 'request' && (
        <form onSubmit={handleRequestPasswordReset} className="space-y-4">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-2 text-amber-600 dark:text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#101936] dark:text-white">Reset Account Password</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Enter your registered Email, Mobile Phone, or User ID. We'll send a 6-digit verification code to both channels.
            </p>
          </div>

          {resetError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1.5">
              Username / User ID, Mobile Number, or Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                required
                value={resetIdentifier}
                onChange={(e) => setResetIdentifier(e.target.value)}
                placeholder="e.g. shopper_rahul, 9820144521, or shopper@comparecart.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* FREE OTP CHANNEL SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                Free Delivery Method
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Zero Cost
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setResetChannel('both')}
                className={`p-2 rounded-xl border text-center transition ${
                  resetChannel === 'both'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-white font-bold ring-1 ring-amber-500'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-[11px] font-bold">Dual Delivery</p>
                <p className="text-[9px] text-slate-500 dark:text-zinc-400">SMS + Email</p>
              </button>

              <button
                type="button"
                onClick={() => setResetChannel('sms')}
                className={`p-2 rounded-xl border text-center transition ${
                  resetChannel === 'sms'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-white font-bold ring-1 ring-emerald-500'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[11px] font-bold">Carrier SMS</p>
                <p className="text-[9px] text-slate-500 dark:text-zinc-400">Firebase Free</p>
              </button>

              <button
                type="button"
                onClick={() => setResetChannel('email')}
                className={`p-2 rounded-xl border text-center transition ${
                  resetChannel === 'email'
                    ? 'bg-blue-500/15 border-blue-500 text-blue-900 dark:text-white font-bold ring-1 ring-blue-500'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5 mx-auto mb-0.5 text-blue-600 dark:text-blue-400" />
                <p className="text-[11px] font-bold">Email OTP</p>
                <p className="text-[9px] text-slate-500 dark:text-zinc-400">Resend Free</p>
              </button>
            </div>
          </div>

          {/* Invisible Recaptcha Container for Reset Flow */}
          <div id="firebase-recaptcha-reset" className="hidden"></div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/25 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Dispatching Free OTP Code...</span>
              </>
            ) : (
              <>
                <span>
                  {resetChannel === 'sms'
                    ? 'Send Free Carrier SMS OTP'
                    : resetChannel === 'email'
                    ? 'Send Free Email OTP'
                    : 'Send Free Reset OTP (Dual)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: VERIFY RESET OTP & ENTER NEW PASSWORD */}
      {resetStep === 'verify' && (
        <form onSubmit={handleCompletePasswordReset} className="space-y-4">
          <div className="text-center pb-1">
            <h3 className="text-base font-bold text-[#101936] dark:text-white">Enter OTP & Set New Password</h3>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-[11px]">
              {(resetChannel === 'sms' || resetChannel === 'both') && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <Smartphone className="w-3 h-3 text-emerald-500" />
                  <span>SMS: <span className="font-mono font-bold">{resetIdentifier}</span></span>
                </div>
              )}
              {(resetChannel === 'email' || resetChannel === 'both') && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                  <Mail className="w-3 h-3 text-blue-500" />
                  <span>Email: <span className="font-mono font-bold">{resetIdentifier}</span></span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
              Code expires in 5 minutes. Works seamlessly with zero charges.
            </p>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleAutoFillResetOtp}
              className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Autofill Reset OTP from Notification</span>
            </button>
          </div>

          {resetError && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{resetError}</span>
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2">
            {resetOtpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { resetOtpInputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleResetOtpChange(idx, e.target.value)}
                className="w-10 h-12 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white dark:bg-zinc-900 dark:border-white/20 dark:text-white dark:focus:border-amber-400 transition"
              />
            ))}
          </div>

          {/* New Password & Confirm Password */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">New Password</label>
            <input
              type="password"
              required
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={resetConfirmPassword}
              onChange={(e) => setResetConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs focus:outline-none focus:border-amber-500 focus:bg-white dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 dark:focus:border-amber-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Update Password & Return to Login</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 3: RESET DONE */}
      {resetStep === 'done' && (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#101936] dark:text-white">Password Updated Successfully!</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
              Your account password has been changed. You can now log into your permitted portal using your new credentials.
            </p>
          </div>
          <button
            onClick={() => onSwitchToSignIn(resetIdentifier, resetNewPassword)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition border border-amber-300/40 shadow-sm"
          >
            Proceed to Sign In
          </button>
        </div>
      )}
    </div>
  );
};
