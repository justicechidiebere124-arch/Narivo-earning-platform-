/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { Input, GoogleLogo } from '../ui';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Tag, 
  AlertCircle, 
  CheckCircle2,
  Inbox,
  Loader2
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { 
    register, 
    signInWithGoogle, 
    isAuthenticated, 
    authLoading, 
    setCurrentScreen, 
    resendVerificationEmail, 
    showToast 
  } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setCurrentScreen('dashboard');
    }
  }, [isAuthenticated, authLoading, setCurrentScreen]);

  // Verification state for when email confirmation is needed
  const [registrationSuccessEmail, setRegistrationSuccessEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  usePageSeo({
    title: 'Create Your Account – NARIVO',
    description: 'Create your account to access authentic sponsored tasks and digital opportunities with NARIVO.',
    canonicalPath: '/register',
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

    if (!fullName.trim()) {
      setError('Please provide your full legal name matching your Nigerian bank account.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-to-11 digit Nigerian mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    const formattedPhone = phone.startsWith('+234') 
      ? phone 
      : `+234 ${phone.replace(/^0/, '')}`;

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName,
        email,
        phone: formattedPhone,
        password,
        referralCode: referralCode.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || 'Failed to complete registration.');
      } else if (res.needsEmailVerification) {
        setRegistrationSuccessEmail(email);
        showToast('Account created. Please verify your email inbox.');
      } else {
        showToast('Welcome to NARIVO! Your account is active.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network exception during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!registrationSuccessEmail) return;
    setIsResending(true);
    try {
      const res = await resendVerificationEmail(registrationSuccessEmail);
      if (res.success) {
        showToast('Confirmation email resent!');
      } else {
        showToast(res.message);
      }
    } catch {
      showToast('Failed to resend confirmation email.');
    } finally {
      setIsResending(false);
    }
  };

  // If email verification is required
  if (registrationSuccessEmail) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[radial-gradient(ellipse_130%_90%_at_50%_-15%,#065f46_0%,#044e39_25%,#033a2b_50%,#022c22_75%,#011f18_100%)] selection:bg-emerald-400 selection:text-slate-950">
        <div 
          className="anim-ambient-1 absolute top-0 left-1/2 -translate-x-1/2 w-[720px] sm:w-[900px] h-[400px] bg-[radial-gradient(circle,rgba(52,211,153,0.25)_0%,rgba(16,185,129,0.12)_45%,transparent_75%)] blur-3xl pointer-events-none -z-10" 
          aria-hidden="true" 
        />

        <div className="relative w-full max-w-[420px] rounded-3xl sm:rounded-[32px] bg-[#064e3b]/55 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_24px_60px_rgba(1,26,20,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] p-6 sm:p-9 text-center space-y-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div 
            className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <Inbox className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-white font-heading">
              Verify Your Email
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed">
              We sent an activation link to <strong className="text-white font-mono break-all">{registrationSuccessEmail}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/35 border border-emerald-400/20 text-xs text-slate-300 text-left space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Next Steps:</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-[11px] leading-relaxed">
              <li>Open your email inbox and click the verification link.</li>
              <li>Your profile will be verified and you can log in immediately.</li>
            </ol>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setCurrentScreen('login')}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-2.5 text-xs text-emerald-300 hover:text-emerald-200 font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {isResending ? 'Sending...' : "Didn't receive email? Resend link"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* 2. Glassmorphic Registration Container */}
      <div className="relative w-full max-w-[460px] rounded-3xl sm:rounded-[32px] bg-[#064e3b]/55 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_24px_60px_rgba(1,26,20,0.85),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_30px_rgba(16,185,129,0.08)] p-6 sm:p-9 space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top specular sheen */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Brand Mark & Clear "Create Your Account" Heading */}
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
            Create Your Account
          </h1>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 bg-rose-500/15 rounded-xl border border-rose-500/35 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
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

        {/* Essential Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Full Legal Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Justice Chidiebere"
            leftIcon={<User className="w-4 h-4 text-emerald-300/70" />}
            autoComplete="name"
          />

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

          <Input
            label="Mobile Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0801 234 5678"
            leftIcon={<Phone className="w-4 h-4 text-emerald-300/70" />}
            autoComplete="tel"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 chars"
              leftIcon={<Lock className="w-4 h-4 text-emerald-300/70" />}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              leftIcon={<Lock className="w-4 h-4 text-emerald-300/70" />}
              autoComplete="new-password"
            />
          </div>

          <Input
            label="Referral Code (Optional)"
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="e.g. NAR-8429"
            leftIcon={<Tag className="w-4 h-4 text-emerald-300/70" />}
            className="uppercase font-mono"
          />

          {/* Required Terms Acceptance Checkbox */}
          <div className="pt-1.5">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-200 select-none">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-emerald-400/30 bg-black/50 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500 shrink-0"
              />
              <span className="leading-relaxed">
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.48)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        {/* Small Sign In Link */}
        <p className="text-xs text-slate-300 text-center pt-2">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentScreen('login')}
            className="font-bold text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition-colors cursor-pointer ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
