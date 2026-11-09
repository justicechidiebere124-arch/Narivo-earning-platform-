/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { supabase } from '../../lib/supabase';
import { 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  RotateCw, 
  Check, 
  Circle,
  ArrowLeft
} from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { setCurrentScreen, showToast, setIsPasswordRecovery } = useApp();

  const [status, setStatus] = useState<'verifying' | 'ready' | 'expired' | 'success'>('verifying');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  usePageSeo({
    title: 'Set New Password – NARIVO',
    description: 'Create a new secure password for your NARIVO account.',
    canonicalPath: '/reset-password',
  });

  // 1. Password validation criteria
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = hasMinLength && hasNumberOrSymbol && passwordsMatch;

  // 2. Establish and verify the recovery session on mount
  useEffect(() => {
    let isMounted = true;
    setIsPasswordRecovery(true);

    const verifyRecoveryState = async () => {
      if (typeof window === 'undefined') return;

      // Check for error parameters in search query or URL hash (e.g., otp_expired)
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
      const hashParams = new URLSearchParams(hash);

      const errorParam = searchParams.get('error') || hashParams.get('error');
      const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

      if (errorParam || errorDescription) {
        if (isMounted) {
          setStatus('expired');
          setErrorNotice(
            errorDescription?.replace(/\+/g, ' ') ||
            'This password recovery link has expired or is invalid. Please request a new link.'
          );
        }
        return;
      }

      // Check for PKCE exchange code in URL search parameters
      const code = searchParams.get('code');
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!isMounted) return;

          if (error) {
            console.warn('Recovery code exchange note:', error.message);
            setStatus('expired');
            setErrorNotice('This password reset link has expired or has already been used. Please request a new link.');
            return;
          }

          if (data?.session) {
            // Clean up URL parameters to prevent re-exchange on browser refresh
            window.history.replaceState(null, '', '/reset-password');
            setStatus('ready');
            return;
          }
        } catch (err: any) {
          if (isMounted) {
            setStatus('expired');
            setErrorNotice(err?.message || 'Failed to establish recovery session.');
          }
          return;
        }
      }

      // Check if a session is already established (e.g. implicit grant hash parsed by client)
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (session) {
        setStatus('ready');
        if (window.location.hash) {
          window.history.replaceState(null, '', '/reset-password');
        }
        return;
      }

      // Listen for incoming auth event (e.g. PASSWORD_RECOVERY emitted by Supabase)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, eventSession) => {
        if (!isMounted) return;
        if (event === 'PASSWORD_RECOVERY' || (eventSession && event === 'SIGNED_IN')) {
          setStatus('ready');
          subscription.unsubscribe();
        }
      });

      // Safety fallback: If after 2 seconds no recovery session was detected, show expired state
      const timer = setTimeout(async () => {
        if (!isMounted) return;
        const { data: { session: recheck } } = await supabase.auth.getSession();
        if (recheck) {
          setStatus('ready');
        } else {
          setStatus('expired');
          setErrorNotice('No active password recovery session found. Reset links are single-use and expire after a short time.');
        }
      }, 2000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    };

    verifyRecoveryState();

    return () => {
      isMounted = false;
    };
  }, [setIsPasswordRecovery]);

  // 3. Handle password update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (newPassword.length < 8) {
      setSubmitError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      setSubmitError('Password must contain at least one number or special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError('Passwords do not match. Please verify both inputs.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setSubmitError(error.message);
        setIsSubmitting(false);
        return;
      }

      // Deactivate recovery flag
      setIsPasswordRecovery(false);

      // Cleanly sign out temporary recovery session so member signs in fresh with new password
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignored
      }

      setStatus('success');
      showToast('Password updated successfully! Please sign in with your new credentials.');
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred while updating your password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[radial-gradient(ellipse_130%_90%_at_50%_-15%,#065f46_0%,#044e39_25%,#033a2b_50%,#022c22_75%,#011f18_100%)] selection:bg-emerald-400 selection:text-slate-950">
      
      {/* Emerald Ambient Illumination */}
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

      {/* Glassmorphic Container */}
      <div className="relative w-full max-w-[440px] rounded-3xl sm:rounded-[32px] bg-[#064e3b]/55 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_24px_60px_rgba(1,26,20,0.85),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_30px_rgba(16,185,129,0.08)] p-6 sm:p-9 space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top specular sheen */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Brand Mark */}
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
        </div>

        {/* STATE 1: VERIFYING RECOVERY SESSION */}
        {status === 'verifying' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mx-auto">
              <RotateCw className="w-7 h-7 text-emerald-400 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-white font-heading">
                Verifying Reset Link
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Validating your cryptographic recovery session with Supabase Auth...
              </p>
            </div>
          </div>
        )}

        {/* STATE 2: LINK EXPIRED OR INVALID */}
        {status === 'expired' && (
          <div className="text-center py-3 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-8 h-8 text-rose-300" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-heading">
                Reset Link Expired or Invalid
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                {errorNotice || 'This password reset link is invalid or has already expired. Password reset links are single-use and expire after 1 hour.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('forgot-password')}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request New Reset Link</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('login')}
                className="w-full h-11 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: READY TO SET NEW PASSWORD */}
        {status === 'ready' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
                Create New Password
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed">
                Enter your new password below to regain access to your NARIVO account.
              </p>
            </div>

            {submitError && (
              <div className="p-3.5 bg-rose-500/15 rounded-xl border border-rose-500/35 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-300/70 flex items-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    autoFocus
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-emerald-300/70 flex items-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-black/40 border border-white/[0.1] text-xs text-white placeholder:text-slate-500 transition-all outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Requirements Card */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/[0.08] space-y-1.5 text-[11px]">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                  Password Requirements
                </span>
                
                <div className="flex items-center gap-2">
                  {hasMinLength ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-slate-500 shrink-0 ml-0.5 mr-0.5" />
                  )}
                  <span className={hasMinLength ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    At least 8 characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasNumberOrSymbol ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-slate-500 shrink-0 ml-0.5 mr-0.5" />
                  )}
                  <span className={hasNumberOrSymbol ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Contains at least one number or special symbol
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {passwordsMatch ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-slate-500 shrink-0 ml-0.5 mr-0.5" />
                  )}
                  <span className={passwordsMatch ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    Passwords match
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.48)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Updating Password...</span>
                  </span>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel and Return to Sign In</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STATE 4: SUCCESS CONFIRMATION */}
        {status === 'success' && (
          <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 text-emerald-300" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white font-heading">
                Password Reset Complete!
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed max-w-xs mx-auto">
                Your NARIVO account password has been updated successfully. You can now sign in using your new password.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('login')}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In with New Password</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
