/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { Card, Input, Button, Modal, Badge } from '../ui';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2,
  ShieldCheck,
  Send
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentScreen, showToast, resetPassword, resendVerificationEmail } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  usePageSeo({
    title: 'Sign In – NARIVO',
    description: 'Sign in to access your NARIVO verified member dashboard, sponsored tasks and digital wallet.',
    canonicalPath: '/login',
  });

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
      <Card variant="elevated" className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white font-black text-lg flex items-center justify-center shadow-md">
              N
            </div>
            <Badge variant="emerald" size="sm">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Session</span>
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading pt-1">
            Sign In to NARIVO
          </h1>
          <p className="text-xs text-slate-400">
            Access your member dashboard, task opportunities, and Naira wallet.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 rounded-xl border border-rose-500/30 text-xs text-rose-300 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
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

          <div className="space-y-1">
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
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </Button>
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
      </Card>

      {/* Real Password Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Your Password"
        description="Enter your registered email address and we will send a secure password reset link."
        size="sm"
      >
        <div className="space-y-4">
          {resetStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              resetStatus.success 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {resetStatus.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
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
              leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
              autoFocus
            />

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowResetModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={resetSubmitting}
                className="flex-1"
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                {resetSubmitting ? 'Sending...' : 'Send Link'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
