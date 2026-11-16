'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { Mail, Lock, User, ShoppingBag, CreditCard, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'user' | 'partner';
  onSuccess?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'user',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'user' | 'partner'>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              city: city,
            },
          },
        });

        if (error) throw error;

        // Create or update profile in database
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: fullName,
            email: email,
            role: role,
            city: city,
            kyc_verified: role === 'user',
          });
        }

        setSuccessMessage('Account created successfully! Logging you in...');
        setTimeout(() => {
          onSuccess?.(role);
          onClose();
        }, 1200);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Fetch user profile to get their registered role
        let assignedRole = role;
        if (data.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileData?.role) {
            assignedRole = profileData.role;
          }
        }

        setSuccessMessage('Welcome back! Loading your workspace...');
        setTimeout(() => {
          onSuccess?.(assignedRole);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#161617] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Logo size="md" />
          <h2 className="text-xl font-bold tracking-tight text-white mt-4">
            {mode === 'signin' ? 'Sign in to CompareCart' : 'Create an Account'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {mode === 'signin'
              ? 'Enter your credentials to access your isolated workspace'
              : 'Join the premier Indian multi-store price & card discount network'}
          </p>
        </div>

        {/* Role Selector (on Sign Up) */}
        {mode === 'signup' && (
          <div className="mb-5 grid grid-cols-2 gap-2 bg-[#232326] p-1 rounded-2xl border border-white/5">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
                role === 'user'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shopper</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition ${
                role === 'partner'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card Partner</span>
            </button>
          </div>
        )}

        {/* Status Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#232326] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#232326] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-[#232326] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs transition duration-200 bg-white text-black hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-5 text-center text-xs text-zinc-400">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
