/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Tag, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  Inbox
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, setCurrentScreen, isSupabaseConfigured, resendVerificationEmail, showToast } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verification success screen state
  const [registrationSuccessEmail, setRegistrationSuccessEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name as it appears on your Nigerian bank account.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid Nigerian phone number.');
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
      setError('You must accept the terms of service and task anti-fraud policy.');
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
        setError(res.error || 'Failed to create account. Please check your credentials.');
      } else if (res.needsEmailVerification) {
        setRegistrationSuccessEmail(email);
        showToast('Account registered! Verification email sent.');
      } else {
        showToast('Welcome to NARIVO! Your member profile is active.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred during registration.');
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
        showToast('Confirmation email resent! Check your inbox.');
      } else {
        showToast(res.message);
      }
    } catch {
      showToast('Error requesting verification email.');
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
        {/* Left Column (5 cols): Atmospheric Value Showcase */}
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
                Join Nigeria's Premium Sponsored-Task Exchange
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect your Android smartphone or laptop directly to verified advertiser campaigns. Complete authentic tasks, earn in Naira, and withdraw to your bank.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% Free registration — zero fees to earn or browse tasks.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct Nigerian commercial bank settlements (NUBAN).</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Supabase Auth session persistence & cryptographic security.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1-Level direct referral bonuses on invited peers.</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] relative z-10 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Standard NUBAN Settlement (₦5,000 Min)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Minimum withdrawal threshold is ₦5,000. All member accounts start with clean ₦0.00 ledger balance.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Registration Form or Email Verification Screen */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 space-y-6 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          {registrationSuccessEmail ? (
            /* Email Verification Sent View */
            <div className="space-y-6 py-6 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <Inbox className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Verify Your Email Address
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We've sent an activation link to <strong className="text-white font-semibold">{registrationSuccessEmail}</strong>. 
                  Please check your inbox (and spam folder) and click the link to confirm your account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400 max-w-md mx-auto space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Why verify?</span>
                </div>
                <p className="text-[11px]">
                  Email verification confirms your identity and protects your NUBAN bank payouts against fraudulent submissions.
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('login')}
                  className="w-full py-3.5 rounded-2xl btn-emerald-primary text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 hover:text-white font-semibold text-xs border border-white/[0.08] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Resending Link...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Didn't receive email? Resend</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form View */
            <>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Create Your Free Member Account
                </h2>
                <p className="text-xs text-slate-400">
                  Enter your details below to establish your verified Supabase-backed member session.
                </p>
              </div>

              {!isSupabaseConfigured && (
                <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="block text-white font-semibold">Supabase Configuration Required for Real Auth</strong>
                    <span>
                      Add <code className="text-emerald-300 font-mono">VITE_SUPABASE_URL</code> and <code className="text-emerald-300 font-mono">VITE_SUPABASE_ANON_KEY</code> to your environment. You can also explore the sandbox via the Sign In screen.
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name (Must match bank recipient name)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Justice Chidiebere Okoye"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Phone Number (WhatsApp preferred)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0801 234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Referral Code */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. NAR-9428"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 h-4 w-4 shrink-0"
                    />
                    <span>
                      I agree to the NARIVO Platform Terms and Anti-Fraud Policy. I understand that submitted task proof is verified by advertisers before rewards unlock to Available Balance.
                    </span>
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
                      <span>Creating Account via Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account link */}
              <div className="text-center pt-2 border-t border-white/[0.06] text-xs text-slate-400">
                <span>Already have a member account? </span>
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Sign In Here
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
