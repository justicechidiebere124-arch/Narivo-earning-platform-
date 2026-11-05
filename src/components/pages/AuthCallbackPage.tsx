/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { supabase } from '../../lib/supabase';
import { GoogleLogo } from '../ui';
import { AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const { setCurrentScreen, ensureUserProfile, showToast } = useApp();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  usePageSeo({
    title: 'Authenticating with Google – NARIVO',
    description: 'Completing secure Google authentication for your NARIVO account.',
    canonicalPath: '/auth/callback',
  });

  useEffect(() => {
    let isCancelled = false;

    const processAuthCallback = async () => {
      try {
        if (typeof window === 'undefined') return;

        const currentUrl = new URL(window.location.href);
        const code = currentUrl.searchParams.get('code');
        const error = currentUrl.searchParams.get('error');
        const errorDescription = currentUrl.searchParams.get('error_description');

        // 1. Check if OAuth provider returned an explicit error (e.g. user cancelled)
        if (error || errorDescription) {
          if (!isCancelled) {
            setStatus('error');
            setErrorMessage(
              errorDescription || error || 'Google sign-in was cancelled or access was denied.'
            );
          }
          return;
        }

        // 2. Exchange PKCE code for authenticated session if code parameter is present
        let authenticatedUser = null;

        if (code) {
          try {
            const { data, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeErr && data?.session?.user) {
              authenticatedUser = data.session.user;
            } else if (exchangeErr) {
              console.warn('PKCE code exchange notice:', exchangeErr.message);
            }
          } catch (codeErr) {
            console.warn('exchangeCodeForSession exception:', codeErr);
          }
        }

        // 3. If session wasn't retrieved via exchangeCode, verify via getSession() (e.g. auto-detected by client)
        if (!authenticatedUser) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
          if (!sessionErr && sessionData?.session?.user) {
            authenticatedUser = sessionData.session.user;
          }
        }

        // 4. Fallback verification via getUser()
        if (!authenticatedUser) {
          const { data: userData, error: userErr } = await supabase.auth.getUser();
          if (!userErr && userData?.user) {
            authenticatedUser = userData.user;
          }
        }

        if (!authenticatedUser) {
          if (!isCancelled) {
            setStatus('error');
            setErrorMessage('Unable to verify Google authentication session. Please try signing in again.');
          }
          return;
        }

        // 5. Ensure profile exists in public.profiles table (creates it if new user)
        await ensureUserProfile(authenticatedUser);

        if (!isCancelled) {
          setStatus('success');
          showToast('Google authentication verified successfully!');

          // 6. If opened inside a popup from the AI Studio preview iframe, notify opener and close
          if (window.opener && window.opener !== window) {
            try {
              window.opener.postMessage({ type: 'NARIVO_OAUTH_SUCCESS', userId: authenticatedUser.id }, '*');
              setTimeout(() => {
                window.close();
              }, 600);
              return;
            } catch (postErr) {
              console.warn('Failed to postMessage to opener:', postErr);
            }
          }

          // 7. Otherwise, redirect directly to dashboard
          setTimeout(() => {
            if (!isCancelled) {
              setCurrentScreen('dashboard');
              if (typeof window !== 'undefined') {
                window.history.replaceState(null, '', '/dashboard');
              }
            }
          }, 800);
        }
      } catch (err: any) {
        console.error('Unexpected error in auth callback:', err);
        if (!isCancelled) {
          setStatus('error');
          setErrorMessage(err?.message || 'An unexpected error occurred during Google authentication.');
        }
      }
    };

    processAuthCallback();

    return () => {
      isCancelled = true;
    };
  }, [ensureUserProfile, setCurrentScreen, showToast]);

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
                Establishing your authenticated session and synchronizing your member profile...
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('login')}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
