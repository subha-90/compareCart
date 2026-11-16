'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  CreditCard,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
  Smartphone,
  AtSign,
  ArrowLeft
} from 'lucide-react';
import { useCompareCart } from '../lib/store';
import { PortalRole, UserRegistrationData } from '../types';

export interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultRole?: 'user' | 'partner' | 'admin';
  defaultTab?: 'signin' | 'register' | 'forgot_password';
  onSuccess?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  defaultRole: propDefaultRole,
  defaultTab: propDefaultTab,
  onSuccess: propOnSuccess,
}) => {
  const router = useRouter();
  const {
    authModal,
    closeAuthModal,
    portalCredentials,
    registeredUsers,
    loginWithIdentifier,
    requestRegistrationOTP,
    verifyRegistrationOTP,
    resendRegistrationOTP,
    requestPasswordResetOTP,
    verifyPasswordReset,
    notifications,
  } = useCompareCart();

  const isModalOpen = propIsOpen !== undefined ? propIsOpen : authModal.isOpen;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    closeAuthModal();
  };

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot_password'>(
    propDefaultTab || authModal.tab || 'signin'
  );
  const [selectedPortal, setSelectedPortal] = useState<PortalRole>(
    propDefaultRole || authModal.portal || 'user'
  );

  // Sign In State (Flipkart-style Universal Identifier: Email, Mobile or User ID)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState<string>('');

  // Prefetch portal routes for instantaneous transitions
  useEffect(() => {
    router.prefetch('/user');
    router.prefetch('/partner');
    router.prefetch('/admin');
  }, [router]);

  // Registration State
  const [regRole, setRegRole] = useState<'user' | 'partner'>('user');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCity, setRegCity] = useState('Bengaluru');
  const [regBank, setRegBank] = useState('HDFC Bank');
  const [regCardName, setRegCardName] = useState('Regalia Gold Credit Card');
  const [regAgree, setRegAgree] = useState(true);

  // Registration OTP State
  const [registrationStep, setRegistrationStep] = useState<'form' | 'otp' | 'success'>('form');
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(30);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Forgot Password State
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'done'>('request');
  const [resetOtpDigits, setResetOtpDigits] = useState(['', '', '', '', '', '']);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const resetOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync selected portal and tab when authModal opens
  useEffect(() => {
    if (authModal.isOpen) {
      if (authModal.portal) {
        setSelectedPortal(authModal.portal);
        setRegRole(authModal.portal === 'partner' ? 'partner' : 'user');
      }
      if (authModal.tab) {
        setActiveTab(authModal.tab);
        setRegistrationStep('form');
      }
      setLoginError(null);
    }
  }, [authModal.isOpen, authModal.portal, authModal.tab]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Handle countdown for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((registrationStep === 'otp' || resetStep === 'verify') && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [registrationStep, resetStep, resendCountdown]);

  if (!isModalOpen) return null;

  // 1-Click demo autofill for testing
  const handleAutofill = (portal: PortalRole) => {
    setSelectedPortal(portal);
    const cred = portalCredentials[portal];
    setIdentifier(cred.email);
    setPassword(cred.password);
    setLoginError(null);
  };

  // Sign In Submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    const result = loginWithIdentifier(identifier, password, selectedPortal);
    if (result.success) {
      const target = result.targetPortal || selectedPortal;
      const targetName = target === 'admin' ? 'Super Admin Vault' : target === 'partner' ? 'Card Partner Terminal' : 'Consumer Portal';
      setIsRedirecting(true);
      setRedirectTarget(targetName);
      if (propOnSuccess) propOnSuccess(target);

      // Immediately navigate to destination portal
      router.push(`/${target}`);

      // Smoothly dismiss modal after portal transition begins so user never sees main page flash
      setTimeout(() => {
        handleClose();
        setIsLoading(false);
        setIsRedirecting(false);
      }, 700);
    } else {
      setIsLoading(false);
      setLoginError(result.message);
    }
  };

  // Start Registration Flow (OTP to Mobile & Email)
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
      setOtpError('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (!regAgree) {
      setOtpError('Please accept CompareCart’s RBI-compliant Escrow & Terms agreement.');
      return;
    }

    const data: UserRegistrationData = {
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      city: regCity,
      primaryBank: regBank,
      cardName: regCardName,
    };

    setIsLoading(true);
    setTimeout(() => {
      const res = requestRegistrationOTP(data);
      setIsLoading(false);
      if (res.success) {
        setRegistrationStep('otp');
        setResendCountdown(30);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else {
        setOtpError(res.message);
      }
    }, 500);
  };

  // OTP Digits Handling for Registration
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

  // Verify Registration OTP
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

  // -------------------------------------------------------------
  // FORGOT PASSWORD FLOW
  // -------------------------------------------------------------
  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetIdentifier) {
      setResetError('Please enter your registered Email, Mobile Number, or User ID.');
      return;
    }

    setIsLoading(true);
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
    }, 500);
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

  const handleCompletePasswordReset = (e: React.FormEvent) => {
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
    setTimeout(() => {
      const res = verifyPasswordReset(resetIdentifier, code, resetNewPassword);
      setIsLoading(false);
      if (res.success) {
        setResetStep('done');
      } else {
        setResetError(res.message);
      }
    }, 500);
  };

  const currentCred = portalCredentials[selectedPortal];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto cursor-pointer"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#141416]/95 border border-white/15 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden text-white my-8 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-5 pb-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4a017]/15 border border-[#d4a017]/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#d4a017]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                CompareCart Authentication
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  256-Bit SSL
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Universal Access for Shoppers, Card Partners & Vault Ops</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        {activeTab !== 'forgot_password' && (
          <div className="p-2 bg-black/40 border-b border-white/[0.08] flex gap-1">
            <button
              onClick={() => { setActiveTab('signin'); setRegistrationStep('form'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'signin'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In (Email / Mobile / User ID)
            </button>
            <button
              onClick={() => { setActiveTab('register'); setRegistrationStep('form'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4a017]" />
              <span>Sign Up (New User)</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: SIGN IN (FLIPKART/AMAZON STYLE MULTI-IDENTIFIER) */}
        {/* ========================================================= */}
        {activeTab === 'signin' && (
          <div className="p-6 space-y-5">
            {/* Target Portal Filter Pills */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Destination Portal Clearance
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedPortal('user'); setLoginError(null); }}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    selectedPortal === 'user'
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 mb-1 ${selectedPortal === 'user' ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <p className="text-xs font-bold leading-tight">Shopper</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Price & Deals</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedPortal('partner'); setLoginError(null); }}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    selectedPortal === 'partner'
                      ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className={`w-4 h-4 mb-1 ${selectedPortal === 'partner' ? 'text-purple-400' : 'text-zinc-500'}`} />
                  <p className="text-xs font-bold leading-tight">Card Partner</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Monetize Swipes</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedPortal('admin'); setLoginError(null); }}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    selectedPortal === 'admin'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 mb-1 ${selectedPortal === 'admin' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <p className="text-xs font-bold leading-tight">Admin Vault</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Treasury & Risk</p>
                </button>
              </div>
            </div>

            {/* 1-Click Demo Credential Banner */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                  <KeyRound className="w-3.5 h-3.5 text-[#d4a017]" />
                  <span>Demo Credentials for {currentCred.portalName}</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5 truncate">
                  {currentCred.email} • {currentCred.password}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAutofill(selectedPortal)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold shrink-0 transition"
              >
                Autofill
              </button>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Universal Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                  Username / User ID, Mobile Number, or Email
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. Username (shopper_rahul), Mobile (+91 98201 44521), or Email"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetIdentifier(identifier);
                      setActiveTab('forgot_password');
                      setResetStep('request');
                      setResetError(null);
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
                  />
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-80 ${
                  isRedirecting
                    ? 'bg-emerald-400 text-black shadow-emerald-400/25'
                    : 'bg-gradient-to-r from-[#d4a017] to-[#b38312] hover:from-[#e5b329] hover:to-[#c69415] text-black shadow-[#d4a017]/25'
                }`}
              >
                {isRedirecting ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Access Granted! Opening {redirectTarget}...</span>
                  </>
                ) : isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Access Rights...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {currentCred.portalName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center text-xs text-zinc-400">
              New to CompareCart?{' '}
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setRegistrationStep('form'); }}
                className="text-amber-400 font-semibold hover:underline"
              >
                Sign Up as Shopper or Card Partner
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: SIGN UP (NEW USER REGISTRATION WITH DUAL OTP)     */}
        {/* ========================================================= */}
        {activeTab === 'register' && (
          <div className="p-6">
            {registrationStep === 'form' && (
              <form onSubmit={handleStartRegistration} className="space-y-4">
                {/* Account Type Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                    Select Account Role & Permitted Portal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('user')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        regRole === 'user'
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 mb-1 text-amber-400" />
                      <p className="text-xs font-bold">Shopper Account</p>
                      <p className="text-[10px] text-zinc-400">Unlock P2P discounts</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegRole('partner')}
                      className={`p-3 rounded-2xl border text-left transition ${
                        regRole === 'partner'
                          ? 'bg-purple-500/15 border-purple-500 text-white'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mb-1 text-purple-400" />
                      <p className="text-xs font-bold">Card Partner</p>
                      <p className="text-[10px] text-zinc-400">Monetize limit & earn 2.5%</p>
                    </button>
                  </div>
                </div>

                {otpError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Aditi Sengupta"
                        className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. aditi@gmail.com"
                        className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Phone & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Mobile Phone (for OTP)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98201 44521"
                        className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">City</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Partner Card Tier if Cardholder */}
                {regRole === 'partner' && (
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold text-purple-200">Registered Card Details</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Primary Bank</label>
                        <select
                          value={regBank}
                          onChange={(e) => setRegBank(e.target.value)}
                          className="w-full py-1.5 px-2 bg-black/60 border border-purple-500/30 rounded-lg text-xs text-white"
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="SBI Card">SBI Card</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Bank">Kotak Bank</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Card Name / Tier</label>
                        <input
                          type="text"
                          value={regCardName}
                          onChange={(e) => setRegCardName(e.target.value)}
                          placeholder="e.g. Regalia Gold"
                          className="w-full py-1.5 px-2 bg-black/60 border border-purple-500/30 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Set Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <label className="flex items-start gap-2 text-[11px] text-zinc-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={regAgree}
                    onChange={(e) => setRegAgree(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0 shrink-0"
                  />
                  <span>
                    I accept CompareCart's RBI-compliant Escrow terms and acknowledge that transactions are settled via dual-signature custody accounts.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
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
                  <KeyRound className="w-6 h-6 text-purple-400" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">Enter 6-Digit Verification Code</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    We sent a security OTP to both Mobile (<span className="font-mono text-white">{regPhone}</span>) and Email (<span className="font-mono text-white">{regEmail}</span>).
                  </p>
                </div>

                {/* 1-Click Autofill Button */}
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Click to Autofill Code from Notification Banner</span>
                </button>

                {otpError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-1.5">
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
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono bg-black/50 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-purple-500/10 transition text-white"
                    />
                  ))}
                </div>

                {/* Resend & Action */}
                <div className="flex items-center justify-between text-xs px-4">
                  <button
                    type="button"
                    onClick={() => setRegistrationStep('form')}
                    className="text-zinc-400 hover:text-white"
                  >
                    Change Details
                  </button>

                  <button
                    type="button"
                    disabled={resendCountdown > 0}
                    onClick={handleResendOtp}
                    className={`font-semibold ${
                      resendCountdown > 0
                        ? 'text-zinc-600 cursor-not-allowed'
                        : 'text-purple-400 hover:underline'
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
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Registration Complete!</h3>
                  <p className="text-xs text-zinc-300 mt-1">
                    Welcome to CompareCart, <span className="text-emerald-400 font-semibold">{regName}</span>.
                  </p>
                  
                  {/* Assigned User ID Box */}
                  <div className="mt-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 max-w-xs mx-auto">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                      Your Unique User ID
                    </span>
                    <span className="text-base font-mono font-bold text-amber-300 block mt-0.5">
                      {registeredUserId}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      You can log in anytime using this User ID, your Email, or Mobile Phone.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 max-w-xs mx-auto pt-2">
                  <button
                    onClick={() => {
                      handleClose();
                      router.push(`/${regRole}`);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a017] to-[#b38312] text-black font-bold text-xs transition"
                  >
                    Enter Portal Now
                  </button>
                  <button
                    onClick={() => {
                      setIdentifier(registeredUserId || regEmail);
                      setPassword(regPassword);
                      setActiveTab('signin');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
                  >
                    Go to Login Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: FORGOT PASSWORD FLOW (OTP TO EMAIL & MOBILE)      */}
        {/* ========================================================= */}
        {activeTab === 'forgot_password' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setActiveTab('signin')}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>

            {resetStep === 'request' && (
              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div className="text-center pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-2 text-amber-400">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Reset Account Password</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    Enter your registered Email, Mobile Phone, or User ID. We'll send a 6-digit verification code to both channels.
                  </p>
                </div>

                {resetError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                    Username / User ID, Mobile Number, or Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. shopper_rahul, 9820144521, or shopper@comparecart.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset OTP to Email & Mobile</span>
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
                  <h3 className="text-base font-bold text-white">Enter OTP & Set New Password</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                    Verification code sent to your registered Email & Mobile.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleAutoFillResetOtp}
                    className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Autofill Reset OTP from Notification</span>
                  </button>
                </div>

                {resetError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-1.5">
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
                      className="w-10 h-12 text-center text-lg font-bold font-mono bg-black/50 border border-white/20 rounded-xl focus:outline-none focus:border-amber-400 transition text-white"
                    />
                  ))}
                </div>

                {/* New Password & Confirm Password */}
                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-300 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition"
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
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Password Updated Successfully!</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your account password has been changed. You can now log into your permitted portal using your new credentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIdentifier(resetIdentifier);
                    setPassword(resetNewPassword);
                    setActiveTab('signin');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a017] to-[#b38312] text-black font-bold text-xs transition"
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Note */}
        <div className="p-3 bg-black/60 border-t border-white/[0.08] text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4a017]" />
          <span>CompareCart Dual-Key Authentication • Multi-Channel Mobile & Email Security</span>
        </div>
      </div>
    </div>
  );
};
