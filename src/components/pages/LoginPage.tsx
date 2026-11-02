/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentScreen, showToast, loadDemoAccount, isSupabaseConfigured, resendVerificationEmail } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowResendPrompt(false);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to authenticate. Please check your credentials.');
        if (res.error?.toLowerCase().includes('confirm') || res.error?.toLowerCase().includes('verified')) {
          setShowResendPrompt(true);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred during sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    loadDemoAccount();
    setCurrentScreen('dashboard');
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const res = await resendVerificationEmail(email);
      if (res.success) {
        showToast('Activation link resent! Please check your email.');
      } else {
        showToast(res.message);
      }
    } catch {
      showToast('Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Back to Home Link */}
      <div className="mb-6">
        <button
          onClick={() => setCurrentScreen('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Platform Overview</span>
        </button>
      </div>

      {/* Split-Screen Luxury Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (5 cols): Atmospheric Brand Pillar */}
        <div className="lg:col-span-5 glass-panel-emerald rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                N
              </div>
              <span className="font-extrabold text-white text-2xl tracking-tight font-heading">
                NARIVO
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading leading-tight">
                Welcome Back to Your Member Terminal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Log in to check pending task approvals, browse fresh advertiser campaigns, and initiate NUBAN bank payouts.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Audited reward ledger with real-time balance tracking.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated NUBAN settlement to all Nigerian banks.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Supabase Auth token refresh & session restore.</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] relative z-10 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Bank-Grade Encryption</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Session tokens are secured with end-to-end encryption. Your NUBAN bank details are verified via secure channels.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Glassmorphism Login Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 space-y-6 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Member Sign In
            </h2>
            <p className="text-xs text-slate-400">
              Enter your registered Supabase email address and password to continue.
            </p>
          </div>

          {/* Quick Sandbox Demo Login Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sandbox Demo Instant Access</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase border border-amber-500/30">
                Demo Account
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore the member command center and wallet interface immediately using pre-configured sandbox demonstration data.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <span>Explore Member Terminal via Sandbox Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!isSupabaseConfigured && (
            <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="block text-white font-semibold">Supabase Environment Configuration</strong>
                <span>
                  To use live accounts, configure <code className="text-emerald-300 font-mono">VITE_SUPABASE_URL</code> and <code className="text-emerald-300 font-mono">VITE_SUPABASE_ANON_KEY</code>. You can also explore the UI using the Sandbox Demo button above.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 space-y-2">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              {showResendPrompt && (
                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-[11px]">
                  <span>Need an activation email?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend link now'}
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset: Supabase Auth will send a reset password email to your inbox.')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 h-4 w-4 shrink-0"
                />
                <span>Remember this device (Supabase Session)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl btn-emerald-primary text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Member Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="text-center pt-2 border-t border-white/[0.06] text-xs text-slate-400">
            <span>Don't have a member account yet? </span>
            <button
              onClick={() => setCurrentScreen('register')}
              className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
