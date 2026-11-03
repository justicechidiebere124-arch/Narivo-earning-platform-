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
  Eye,
  EyeOff,
  RefreshCw,
  Inbox
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, setCurrentScreen, resendVerificationEmail, showToast } = useApp();
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
      setError('You must accept the terms of service and anti-fraud verification policy.');
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
        showToast('Registration received. Please check your email inbox.');
      } else {
        showToast('Welcome to NARIVO! Your member profile is active.');
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

  // If email confirmation is required by Supabase Auth:
  if (registrationSuccessEmail) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <Inbox className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Verify Your Email
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We sent an activation link to <strong className="text-white font-mono">{registrationSuccessEmail}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 text-left space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
              className="w-full h-11 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {isResending ? 'Sending...' : "Didn't receive email? Resend link"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
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

      {/* Main Registration Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] space-y-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white font-black text-lg flex items-center justify-center mx-auto sm:mx-0 shadow-md">
            N
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading pt-2">
            Create Free Account
          </h1>
          <p className="text-xs text-slate-400">
            Registration creates your member profile without upfront fees.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Full Legal Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Justice Chidiebere"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            <span className="text-[10px] text-slate-500 block">
              Must match your Nigerian commercial bank account name.
            </span>
          </div>

          {/* Email */}
          <div className="space-y-1">
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

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Mobile Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0801 234 5678"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full h-11 pl-9 pr-8 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 block">
              Referral Code <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g. NAR-8429"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none transition-colors uppercase"
              />
              <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Terms & Anti-Fraud Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500"
              />
              <span className="leading-relaxed">
                I agree to the NARIVO Terms of Service, anti-fraud audit policies, and verify that all information provided is accurate.
              </span>
            </label>
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
                <span>Registering Profile...</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/[0.06]">
          <span>Already registered? </span>
          <button
            onClick={() => setCurrentScreen('login')}
            className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer ml-1"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
