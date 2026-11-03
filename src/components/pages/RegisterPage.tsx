/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { Card, Input, Button, Badge } from '../ui';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verification success screen state
  const [registrationSuccessEmail, setRegistrationSuccessEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  usePageSeo({
    title: 'Create Free Account – NARIVO',
    description: 'Register a free NARIVO member account to access advertiser-funded campaigns and digital reward opportunities in Nigeria.',
    canonicalPath: '/register',
  });

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
        <Card variant="elevated" className="p-6 sm:p-8 text-center space-y-5">
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

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 text-left space-y-2">
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
            <Button
              onClick={() => setCurrentScreen('login')}
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Sign In
            </Button>

            <button
              onClick={handleResend}
              disabled={isResending}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {isResending ? 'Sending...' : "Didn't receive email? Resend link"}
            </button>
          </div>
        </Card>
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
      <Card variant="elevated" className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white font-black text-lg flex items-center justify-center shadow-md">
              N
            </div>
            <Badge variant="emerald" size="sm">
              <ShieldCheck className="w-3 h-3" />
              <span>Free Onboarding</span>
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading pt-1">
            Create Free Account
          </h1>
          <p className="text-xs text-slate-400">
            Registration creates your member profile without mandatory upfront fees.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Full Legal Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Justice Chidiebere"
            leftIcon={<User className="w-4 h-4 text-slate-500" />}
            helperText="Must match your Nigerian commercial bank account name."
            autoComplete="name"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@domain.com"
            leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
            autoComplete="email"
          />

          <Input
            label="Mobile Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0801 234 5678"
            leftIcon={<Phone className="w-4 h-4 text-slate-500" />}
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
              leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
              autoComplete="new-password"
            />
          </div>

          <Input
            label="Referral Code (Optional)"
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="e.g. NAR-8429"
            leftIcon={<Tag className="w-4 h-4 text-slate-500" />}
            className="uppercase font-mono"
          />

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500 shrink-0"
              />
              <span className="leading-relaxed">
                I agree to the NARIVO Terms of Service, anti-fraud audit policies, and verify that all information provided is accurate.
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Registering Profile...' : 'Create Free Account'}
          </Button>
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
      </Card>
    </div>
  );
};
