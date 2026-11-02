/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export const EmailVerificationBanner: React.FC = () => {
  const { user, isAuthenticated, isDemoAccount, resendVerificationEmail, showToast } = useApp();
  const [isResending, setIsResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  // Only show for real authenticated accounts that have not verified their email
  if (!isAuthenticated || isDemoAccount || !user || user.isEmailVerified) {
    return null;
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await resendVerificationEmail(user.email);
      if (res.success) {
        setResendSent(true);
        showToast('Verification email resent! Please check your inbox and spam folder.');
      } else {
        showToast(res.message || 'Unable to resend email. Please try again shortly.');
      }
    } catch {
      showToast('Error requesting verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-3 text-xs text-amber-200 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white mr-1.5">Email Verification Required:</span>
            <span className="text-amber-200/90">
              A verification link was sent to <strong className="text-white font-semibold">{user.email}</strong>. 
              Please click the link in your email to unlock sponsored task submissions and NUBAN bank payouts.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleResend}
            disabled={isResending || resendSent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Resending...</span>
              </>
            ) : resendSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Sent!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Verification Email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
