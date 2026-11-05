/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { supabase } from '../../lib/supabase';
import { Input } from '../ui';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { setCurrentScreen, showToast } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  usePageSeo({
    title: 'Create New Password – NARIVO',
    description: 'Set a new password for your NARIVO account.',
    canonicalPath: '/reset-password',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setIsSuccess(true);
        showToast('Password updated successfully! You can now sign in.');
        setTimeout(() => {
          setCurrentScreen('login');
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update password.');
    } finally {
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
      <div className="relative w-full max-w-[420px] rounded-3xl sm:rounded-[32px] bg-[#064e3b]/55 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_24px_60px_rgba(1,26,20,0.85),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_30px_rgba(16,185,129,0.08)] p-6 sm:p-9 space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Set New Password
          </h1>
          <p className="text-xs text-slate-200 leading-relaxed max-w-xs">
            Create a secure new password for your NARIVO member account.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 bg-rose-500/15 rounded-xl border border-rose-500/35 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Success Confirmation Box */}
        {isSuccess ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7 text-emerald-300" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-white font-heading">
                Password Updated!
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed">
                Your password has been changed successfully. Redirecting you to sign in...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              leftIcon={<Lock className="w-4 h-4 text-emerald-300/70" />}
              autoComplete="new-password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              leftIcon={<Lock className="w-4 h-4 text-emerald-300/70" />}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.48)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
