/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { Input, Modal, GoogleLogo } from '../ui';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Send,
  Loader2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { 
    login, 
    signInWithGoogle, 
    isAuthenticated, 
    authLoading, 
    isPasswordRecovery,
    setCurrentScreen, 
    showToast, 
    resetPassword, 
    resendVerificationEmail 
  } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically redirect authenticated users to dashboard (unless in password recovery)
  useEffect(() => {
    if (isAuthenticated && !authLoading && !isPasswordRecovery) {
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, authLoading, isPasswordRecovery, setCurrentScreen]);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Email verification resend prompt state
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const [isResending, setIsResending] = useState(false);

  usePageSeo({
    title: 'Sign In – NARIVO',
    description: 'Sign in to access your NARIVO account.',
    canonicalPath: '/login',
  });

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || 'Failed to authenticate with Google. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during Google sign in.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[radial-gradient(ellipse_130%_90%_at_50%_-15%,#065f46_0%,#044e39_25%,#033a2b_50%,#022c22_75%,#011f18_100%)] selection:bg-emerald-400 selection:text-slate-950">
      
      {/* 1. Emerald Ambient Illumination */}
      <div 
        className="anim-ambient-1 absolute top-0 left-1/2 -translate-x-1/2 w-[720px] sm:w-[900px] h-[400px] bg-[radial-gradient(circle,rgba(52,211,153,0.25)_0%,rgba(16,185,129,0.12)_45%,transparent_75%)] blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="anim-ambient-2 absolute top-1/4 -right-20 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="anim-ambient-3 absolute bottom-10 -left-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Subtle glass contour grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,211,153,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,211,153,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_65%,transparent_100%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 2. Glassmorphic Sign-In Container */}
      <div className="relative w-full max-w-[420px] rounded-3xl sm:rounded-[32px] bg-[#064e3b]/55 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_24px_60px_rgba(1,26,20,0.85),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_30px_rgba(16,185,129,0.08)] p-6 sm:p-9 space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top specular sheen */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Brand Mark & Clear "Welcome Back" Heading */}
        <div className="flex flex-col items-center text-center space-y-3">
          <button
            type="button"
            onClick={() => setCurrentScreen('landing')}
            className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl p-1 cursor-pointer transition-transform active:scale-95"
            title="Return to NARIVO Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(52,211,153,0.5)] ring-1 ring-white/30 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-xl font-black tracking-[0.16em] text-white font-heading">
              NARIVO
            </span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Welcome Back
          </h1>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 bg-rose-500/15 rounded-xl border border-rose-500/35 text-xs text-rose-200 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
            {showResendPrompt && (
              <div className="pt-2 border-t border-rose-500/25 flex items-center justify-between text-[11px]">
                <span>Missing verification email?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-bold text-emerald-300 hover:text-emerald-200 underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend link now'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Google Authentication Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full h-12 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.25)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed select-none group"
            aria-label="Continue with Google"
          >
            {isGoogleSubmitting ? (
              <div className="flex items-center gap-2 text-slate-700">
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                <GoogleLogo className="w-5 h-5 shrink-0" />
                <span className="font-bold text-slate-800 tracking-tight">Continue with Google</span>
              </>
            )}
          </button>

          {/* Subtle OR Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-emerald-400/20" />
            <span className="absolute px-3 bg-[#064e3b] text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider rounded-full border border-emerald-400/20 select-none">
              or
            </span>
          </div>
        </div>

        {/* Essential Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            leftIcon={<Mail className="w-4 h-4 text-emerald-300/70" />}
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-200">
                Password
              </label>
              <button
                type="button"
                onClick={() => setCurrentScreen('forgot-password')}
                className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-emerald-300/70" />}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.48)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        {/* Small Register Link */}
        <p className="text-xs text-slate-300 text-center pt-2">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentScreen('register')}
            className="font-bold text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition-colors cursor-pointer ml-1"
          >
            Register
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Your Password"
        description="Enter your registered email address to receive a secure reset link."
        size="sm"
      >
        <div className="space-y-4">
          {resetStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              resetStatus.success 
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200' 
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
            }`}>
              {resetStatus.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
              )}
              <span className="leading-relaxed">{resetStatus.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="registered@email.com"
              leftIcon={<Mail className="w-4 h-4 text-emerald-300/70" />}
              autoFocus
            />

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetSubmitting}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {resetSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Link</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
