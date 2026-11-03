/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Crown, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  RotateCw, 
  Clock, 
  CreditCard, 
  Sparkles, 
  Database,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const MembershipPage: React.FC = () => {
  const { 
    user, 
    activeMembership, 
    isMembershipActive,
    isMembershipExpired,
    membershipPlans, 
    membershipLoading, 
    refreshMembership, 
    setCurrentScreen, 
    showToast 
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMembership();
    setRefreshing(false);
    showToast('Membership tier refreshed from Supabase.');
  };

  const planName = activeMembership?.membership_plans?.name || 'Premium Member';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              Platform Tiers
            </span>
            <span>·</span>
            <span>Database Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Membership Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time subscription evaluation from <code className="text-emerald-300 font-mono text-[11px]">public.memberships</code>.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || membershipLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh database records"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing || membershipLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Current User Membership Card */}
      <div className={`rounded-3xl p-6 sm:p-7 border transition-all ${
        isMembershipActive 
          ? 'bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border-emerald-500/40 shadow-lg' 
          : isMembershipExpired
            ? 'glass-panel border-amber-500/30 bg-amber-500/5'
            : 'glass-panel border-white/[0.08]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
                isMembershipActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : isMembershipExpired
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/[0.05] text-slate-400 border-white/[0.1]'
              }`}>
                {isMembershipActive ? (
                  <>
                    <Crown className="w-3 h-3 text-emerald-400" />
                    <span>Active Premium</span>
                  </>
                ) : isMembershipExpired ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Subscription Expired</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Registered Profile</span>
                  </>
                )}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              {isMembershipActive ? planName : isMembershipExpired ? `${planName} (Expired)` : 'Registered — No Active Membership'}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {isMembershipActive ? (
                <>Your Premium membership is active. You have full access to submit task evidence and priority audits.</>
              ) : isMembershipExpired ? (
                <>Your previous subscription has expired. Your earned wallet balances and withdrawal privileges remain 100% active and accessible.</>
              ) : (
                <>Your account is registered on NARIVO. Registration creates a free profile without an automatic membership assignment.</>
              )}
            </p>

            {/* Expiry / Dates */}
            {activeMembership?.expires_at && (
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isMembershipActive ? 'Expires on: ' : 'Expired on: '}
                  <strong className="text-white font-mono">
                    {new Date(activeMembership.expires_at).toLocaleDateString('en-NG', { dateStyle: 'long' })}
                  </strong>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setCurrentScreen('wallet')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold border border-white/[0.1] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Access Wallet</span>
            </button>
            <button
              onClick={() => setCurrentScreen('tasks')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Premium Plan Card (Strictly Reflecting Inactive / Unpriced Status) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white font-heading">
            Platform Membership Tiers
          </h2>
          <p className="text-xs text-slate-400">
            Official configuration from <code className="text-emerald-300 font-mono text-[11px]">public.membership_plans</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Premium Plan (Inactive & Unpriced) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] space-y-5 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Premium Member
                    </h3>
                    <span className="text-[10px] text-slate-400">30-Day Period</span>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  Plan Inactive
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Official NARIVO Premium tier. Grants priority access to high-value sponsored campaigns, expedited 12-hour audit verification, and direct partner campaign unlocks.
              </p>

              {/* Price Row: Unconfigured Notice */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Subscription Fee</span>
                <div className="text-xl font-black font-mono text-white flex items-center gap-2">
                  <span>Price Unconfigured</span>
                </div>
                <p className="text-[10px] text-amber-300/90 leading-relaxed">
                  Price is not currently configured in the database. In accordance with platform governance, purchases are disabled.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 text-xs text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Access to all verified sponsored campaigns</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Expedited sponsor audit windows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct 10-digit NUBAN commercial bank transfers</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                disabled
                className="w-full h-11 rounded-xl bg-white/[0.05] text-slate-500 font-bold text-xs border border-white/[0.06] flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Registration Currently Unavailable</span>
              </button>
            </div>
          </div>

          {/* Right Card: Financial Rights Preservation Guarantee */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Financial Balance Rights Guarantee</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                NARIVO enforces strict financial separation between subscription validity and earned funds:
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <strong className="text-white block font-semibold">1. Wallet Balances Never Expire</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Any Naira balances approved and credited to your wallet remain your property permanently.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <strong className="text-white block font-semibold">2. Unrestricted Withdrawal Access</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Expired members retain full access to withdraw earned funds to their Nigerian bank once the ₦5,000 threshold is met.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('wallet')}
              className="w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white font-bold text-xs border border-white/[0.08] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Go to Member Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
