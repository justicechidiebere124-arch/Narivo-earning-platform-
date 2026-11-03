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
  AlertCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentScreen, showToast, resetPassword, resendVerificationEmail } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Email verification resend state
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowResendPrompt(false);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered email address.');
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

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);

    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setResetStatus({ success: false, message: 'Please enter a valid email address.' });
      return;
    }

    setResetSubmitting(true);
    try {
      const res = await resetPassword(resetEmail);
      if (res.success) {
        setResetStatus({ 
          success: true, 
          message: 'Password reset link sent! Please check your email inbox.' 
        });
        showToast('Password reset email sent successfully.');
      } else {
        setResetStatus({ 
          success: false, 
          message: res.error || 'Unable to send reset email. Verify your email address.' 
        });
      }
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const res = await resendVerificationEmail(email);
      if (res.success) {
        showToast('Verification link resent. Please check your email inbox.');
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
    <div className="max-w-md mx-auto px-4 py-8 sm:py-14 space-y-6">
      {/* Back to Home Link */}
      <div>
        <button
          onClick={() => setCurrentScreen('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Overview</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white font-black text-lg flex items-center justify-center mx-auto sm:mx-0 shadow-md">
            N
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading pt-2">
            Sign In to NARIVO
          </h1>
          <p className="text-xs text-slate-400">
            Access your verified member terminal and wallet.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            {showResendPrompt && (
              <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-[11px]">
                <span>Missing verification email?</span>
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetStatus(null);
                  setShowResetModal(true);
                }}
                className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/[0.06]">
          <span>New to NARIVO? </span>
          <button
            onClick={() => setCurrentScreen('register')}
            className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer ml-1"
          >
            Create free account
          </button>
        </div>
      </div>

      {/* Real Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-6 border border-white/[0.12] space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-heading">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your registered email address and we'll send a secure password reset link via Supabase Auth.
            </p>

            {resetStatus && (
              <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                resetStatus.success 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
                {resetStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />}
                <span>{resetStatus.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="registered@email.com"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="flex-1 py-2.5 rounded-xl btn-emerald-primary text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {resetSubmitting ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
