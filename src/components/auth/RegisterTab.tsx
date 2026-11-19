'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  CreditCard,
  User,
  Mail,
  Phone,
  Building,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useCompareCart } from '../../lib/store';

interface RegisterTabProps {
  initialRole?: 'user' | 'partner';
  onClose: () => void;
  onSwitchToSignIn: (prefilledIdentifier?: string, prefilledPassword?: string) => void;
}

export const RegisterTab: React.FC<RegisterTabProps> = ({
  initialRole = 'user',
  onClose,
  onSwitchToSignIn,
}) => {
  const router = useRouter();
  const {
    requestRegistrationOTP,
    verifyRegistrationOTP,
    resendRegistrationOTP,
    notifications,
  } = useCompareCart();

  const [regRole, setRegRole] = useState<'user' | 'partner'>(initialRole);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regCity, setRegCity] = useState('Bengaluru');
  const [regBank, setRegBank] = useState('HDFC Bank');
  const [regCardName, setRegCardName] = useState('Regalia Gold Credit Card');
  const [regAgree, setRegAgree] = useState(true);

  const [registrationStep, setRegistrationStep] = useState<'form' | 'otp' | 'success'>('form');
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (registrationStep === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [registrationStep, resendCountdown]);

  const handleStartRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setOtpError('Please fill in all required registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setOtpError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setOtpError('Passwords do not match. Please verify.');
      return;
    }

    if (!regAgree) {
      setOtpError('Please accept the RBI-compliant terms to proceed.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = requestRegistrationOTP({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole,
        city: regCity,
        primaryBank: regRole === 'partner' ? regBank : undefined,
        cardName: regRole === 'partner' ? regCardName : undefined,
      });

      setIsLoading(false);
      if (res.success) {
        setRegistrationStep('otp');
        setResendCountdown(30);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else {
        setOtpError(res.message);
      }
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    const latestOtp = notifications.find(n => n.type === 'otp' && n.otpCode);
    if (latestOtp && latestOtp.otpCode) {
      const digits = latestOtp.otpCode.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setOtpError(null);

    setTimeout(() => {
      const res = verifyRegistrationOTP(code);
      setIsLoading(false);
      if (res.success) {
        setRegisteredUserId(res.userId || 'CC-MEMBER');
        setRegistrationStep('success');
      } else {
        setOtpError(res.message);
      }
    }, 500);
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    const res = resendRegistrationOTP();
    if (res.success) {
      setResendCountdown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      {registrationStep === 'form' && (
        <form onSubmit={handleStartRegistration} className="space-y-3.5">
          {/* Account Type Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">
              Select Account Role & Permitted Portal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRegRole('user')}
                className={`p-3 rounded-2xl border text-left transition ${
                  regRole === 'user'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-white font-semibold'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4 mb-1 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-bold">Shopper Account</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400">Unlock P2P discounts</p>
              </button>

              <button
                type="button"
                onClick={() => setRegRole('partner')}
                className={`p-3 rounded-2xl border text-left transition ${
                  regRole === 'partner'
                    ? 'bg-purple-500/15 border-purple-500 text-purple-900 dark:text-white font-semibold'
                    : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1 text-purple-600 dark:text-purple-400" />
                <p className="text-xs font-bold">Card Partner</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400">Monetize limit & earn 2.5%</p>
              </button>
            </div>
          </div>

          {otpError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Aditi Sengupta"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. aditi@gmail.com"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Mobile Phone & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">Mobile Phone (for OTP)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98201 44521"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">City</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Partner Card Tier if Cardholder */}
          {regRole === 'partner' && (
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2.5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">Registered Card Details</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-zinc-400 block mb-1">Primary Bank</label>
                  <select
                    value={regBank}
                    onChange={(e) => setRegBank(e.target.value)}
                    className="w-full py-1.5 px-2 bg-white dark:bg-black/60 border border-purple-500/30 rounded-lg text-xs text-slate-900 dark:text-white"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="SBI Card">SBI Card</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Bank">Kotak Bank</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 dark:text-zinc-400 block mb-1">Card Name / Tier</label>
                  <input
                    type="text"
                    value={regCardName}
                    onChange={(e) => setRegCardName(e.target.value)}
                    placeholder="e.g. Regalia Gold"
                    className="w-full py-1.5 px-2 bg-white dark:bg-black/60 border border-purple-500/30 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">Set Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl text-xs dark:bg-zinc-900 dark:border-white/15 dark:text-white dark:placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-zinc-400 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={regAgree}
              onChange={(e) => setRegAgree(e.target.checked)}
              className="w-3.5 h-3.5 mt-0.5 rounded bg-slate-100 border-slate-300 dark:bg-zinc-900 dark:border-white/20 text-amber-500 focus:ring-0 shrink-0"
            />
            <span>
              I accept CompareCart's RBI-compliant Escrow terms and acknowledge that transactions are settled via dual-signature custody accounts.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-[#101936] hover:bg-[#1B1D27] text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending OTP to Mobile & Email...</span>
              </>
            ) : (
              <>
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: DUAL-CHANNEL OTP VERIFICATION */}
      {registrationStep === 'otp' && (
        <div className="py-2 space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#101936] dark:text-white">Enter 6-Digit Verification Code</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              We sent a security OTP to both Mobile (<span className="font-mono font-medium text-slate-900 dark:text-white">{regPhone}</span>) and Email (<span className="font-mono font-medium text-slate-900 dark:text-white">{regEmail}</span>).
            </p>
          </div>

          {/* 1-Click Autofill Button */}
          <button
            type="button"
            onClick={handleAutoFillOtp}
            className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Click to Autofill Code from Notification Banner</span>
          </button>

          {otpError && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{otpError}</span>
            </div>
          )}

          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { otpInputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white dark:bg-zinc-900 dark:border-white/20 dark:text-white dark:focus:border-purple-400 dark:focus:bg-purple-500/10 transition"
              />
            ))}
          </div>

          {/* Resend & Action */}
          <div className="flex items-center justify-between text-xs px-4">
            <button
              type="button"
              onClick={() => setRegistrationStep('form')}
              className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white font-medium"
            >
              Change Details
            </button>

            <button
              type="button"
              disabled={resendCountdown > 0}
              onClick={handleResendOtp}
              className={`font-semibold ${
                resendCountdown > 0
                  ? 'text-slate-400 dark:text-zinc-600 cursor-not-allowed'
                  : 'text-purple-600 hover:underline dark:text-purple-400'
              }`}
            >
              {resendCountdown > 0 ? `Resend Code in ${resendCountdown}s` : 'Resend OTP to Mobile & Email'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Account & Assigning User ID...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Complete Sign Up</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 3: CELEBRATION & USER ID DISPLAY */}
      {registrationStep === 'success' && (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101936] dark:text-white">Registration Complete!</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1">
              Welcome to CompareCart, <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{regName}</span>.
            </p>
            
            {/* Assigned User ID Box */}
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 max-w-xs mx-auto">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider block font-semibold">
                Your Unique User ID
              </span>
              <span className="text-base font-mono font-bold text-amber-600 dark:text-amber-300 block mt-0.5">
                {registeredUserId}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1 block">
                You can log in anytime using this User ID, your Email, or Mobile Phone.
              </span>
            </div>
          </div>

          <div className="flex gap-2 max-w-xs mx-auto pt-2">
            <button
              onClick={() => {
                onClose();
                router.push(`/${regRole}`);
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition border border-amber-300/40 shadow-sm"
            >
              Enter Portal Now
            </button>
            <button
              onClick={() => {
                onSwitchToSignIn(registeredUserId || regEmail, regPassword);
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-white/10"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
