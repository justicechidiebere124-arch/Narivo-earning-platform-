/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { supabase } from '../../lib/supabase';
import { GoogleLogo } from '../ui';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

export const AuthCallbackPage: React.FC = () => {
  const { setCurrentScreen, ensureUserProfile, showToast, isAuthenticated } = useApp();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingManual, setIsCheckingManual] = useState(false);

  const hasProcessedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  usePageSeo({
    title: 'Authenticating with Google – NARIVO',
    description: 'Completing secure Google authentication for your NARIVO account.',
    canonicalPath: '/auth/callback',
  });

  const completeSuccess = useCallback(
    (authUser: SupabaseAuthUser) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setStatus('success');
      showToast('Signed in with Google successfully!');

      // 1. Immediately clean up the URL to prevent duplicate PKCE exchange or stale code on refresh
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/dashboard');
      }

      // 2. Dispatch profile synchronization safely in background (NEVER blocks navigation)
      ensureUserProfile(authUser).catch((err) => {
        console.warn('Background profile sync notice in callback:', err);
      });

      // 3. Handle popup opener if opened from within an iframe
      if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
        try {
          window.opener.postMessage({ type: 'NARIVO_OAUTH_SUCCESS', userId: authUser.id }, '*');
          setTimeout(() => {
            window.close();
          }, 400);
          return;
        } catch (postErr) {
          console.warn('Failed to notify popup opener:', postErr);
        }
      }

      // 4. Redirect immediately to member dashboard
      setCurrentScreen('dashboard');
    },
    [ensureUserProfile, setCurrentScreen, showToast]
  );

  useEffect(() => {
    // If the user is already authenticated when this component mounts, redirect immediately
    if (isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/dashboard');
      }
      setStatus('success');
      setCurrentScreen('dashboard');
      return;
    }

    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    let isSubscribed = true;

    // Safety timeout: Never allow indefinite spinning. Cap at 6 seconds maximum.
    timeoutRef.current = setTimeout(async () => {
      if (!isSubscribed) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          completeSuccess(session.user);
          return;
        }
      } catch {
        // Fall through to error
      }

      if (isSubscribed) {
        setStatus('error');
        setErrorMessage(
          'Google authentication took longer than expected. If your sign-in was approved, you can proceed directly to your dashboard.'
        );
      }
    }, 6000);

    const processAuth = async () => {
      try {
        if (typeof window === 'undefined') return;

        const currentUrl = new URL(window.location.href);
        const code = currentUrl.searchParams.get('code');
        const error = currentUrl.searchParams.get('error');
        const errorDescription = currentUrl.searchParams.get('error_description');

        // Check for error parameters from OAuth provider
        if (error || errorDescription) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (isSubscribed) {
            setStatus('error');
            setErrorMessage(
              errorDescription || error || 'Google sign-in was cancelled or access was denied.'
            );
          }
          return;
        }

        // Strategy A: Check if a valid session already exists (e.g. detectSessionInUrl already processed it)
        const { data: initialSession } = await supabase.auth.getSession();
        if (initialSession?.session?.user && isSubscribed) {
          completeSuccess(initialSession.session.user);
          return;
        }

        // Strategy B: If PKCE code exists in URL search params, exchange it
        let authUser: SupabaseAuthUser | null = null;

        if (code) {
          try {
            const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeErr && data?.session?.user) {
              authUser = data.session.user;
            } else if (exchangeErr) {
              console.warn('PKCE exchange notice (may have been handled by client):', exchangeErr.message);
            }
          } catch (codeErr) {
            console.warn('PKCE exchange exception:', codeErr);
          }
        }

        // Strategy C: If code exchange didn't yield user, re-check session (detectSessionInUrl may have just finished)
        if (!authUser) {
          const { data: postExchangeSession } = await supabase.auth.getSession();
          if (postExchangeSession?.session?.user) {
            authUser = postExchangeSession.session.user;
          }
        }

        // Strategy D: Verify with getUser() as fallback
        if (!authUser) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            authUser = userData.user;
          }
        }

        if (authUser && isSubscribed) {
          completeSuccess(authUser);
          return;
        }

        // Strategy E: Listen for incoming SIGNED_IN event from Supabase internal state machine
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isSubscribed) return;
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
            subscription.unsubscribe();
            completeSuccess(session.user);
          }
        });
      } catch (err: any) {
        console.error('Unexpected error in auth callback:', err);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (isSubscribed) {
          setStatus('error');
          setErrorMessage(err?.message || 'An unexpected error occurred during Google authentication.');
        }
      }
    };

    processAuth();

    return () => {
      isSubscribed = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [completeSuccess, isAuthenticated, setCurrentScreen]);

  const handleManualCheck = async () => {
    setIsCheckingManual(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        completeSuccess(session.user);
        return;
      }
      showToast('No active session found. Please sign in again.');
      setCurrentScreen('login');
    } catch {
      showToast('Unable to verify session.');
      setCurrentScreen('login');
    } finally {
      setIsCheckingManual(false);
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

      {/* Glassmorphic Status Container */}
      <div className="relative w-full max-w-[420px] rounded-3xl sm:rounded-[32px] bg-[#064e3b]/55 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_24px_60px_rgba(1,26,20,0.85),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_30px_rgba(16,185,129,0.08)] p-6 sm:p-9 text-center space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top specular sheen */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Brand Mark */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-[0_0_24px_rgba(52,211,153,0.5)] ring-1 ring-white/30">
            N
          </div>
          <span className="text-xl font-black tracking-[0.16em] text-white font-heading">
            NARIVO
          </span>
        </div>

        {/* Dynamic Verification State */}
        {status === 'verifying' && (
          <div className="space-y-4 py-2">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <GoogleLogo className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-white font-heading">
                Verifying Google Account
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed max-w-xs mx-auto">
                Establishing your authenticated session and preparing your member dashboard...
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-in zoom-in-50 duration-200" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-white font-heading">
                Sign-In Complete
              </h1>
              <p className="text-xs text-slate-200 leading-relaxed">
                Welcome to NARIVO! Redirecting to your member dashboard...
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center mx-auto shadow-md">
              <AlertCircle className="w-8 h-8 text-rose-300" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white font-heading">
                Authentication Incomplete
              </h1>
              <div className="p-3 bg-rose-500/15 rounded-xl border border-rose-500/30 text-xs text-rose-200 text-left">
                <p className="leading-relaxed font-medium">
                  {errorMessage || 'Google authentication could not be completed.'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleManualCheck}
                disabled={isCheckingManual}
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-[0_10px_24px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isCheckingManual ? 'Checking Session...' : 'Proceed to Dashboard'}</span>
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
      </div>
    </div>
  );
};
