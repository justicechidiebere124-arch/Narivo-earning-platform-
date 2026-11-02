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
    isDemoAccount,
    showToast 
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshMembership();
    setTimeout(() => {
      setRefreshing(false);
      showToast('Membership status refreshed from database.');
    }, 600);
  };

  const planName = activeMembership?.membership_plans?.name || 'Premium Member';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              Platform Governance
            </span>
            <span>·</span>
            <span>Tier Classification & Database Status</span>
            {isDemoAccount && (
              <>
                <span>·</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  Demo Preview
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
            Membership & Tiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Subscription records evaluated live from <code className="text-emerald-300 font-mono text-xs">public.memberships</code> and <code className="text-emerald-300 font-mono text-xs">public.membership_plans</code>.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || membershipLoading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.1] text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          title="Query latest records from Supabase"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing || membershipLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{refreshing || membershipLoading ? 'Syncing DB...' : 'Refresh Database'}</span>
        </button>
      </div>

      {/* 2. Current User Membership Card (Live Database Snapshot) */}
      <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
        isMembershipActive 
          ? 'glass-panel-emerald border-emerald-500/40 shadow-[0_15px_40px_rgba(16,185,129,0.2)]' 
          : isMembershipExpired
            ? 'glass-panel border-amber-500/30 bg-amber-500/5'
            : 'glass-panel border-white/[0.09]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                isMembershipActive
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : isMembershipExpired
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/[0.06] text-slate-400 border border-white/[0.1]'
              }`}>
                {isMembershipActive ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : isMembershipExpired ? (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                    {isMembershipActive
                      ? planName
                      : isMembershipExpired
                        ? `${planName} (Expired)`
                        : 'Registered — No Active Membership'}
                  </h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                    isMembershipActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : isMembershipExpired
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/[0.08] text-slate-300 border-white/[0.12]'
                  }`}>
                    {isMembershipActive ? 'Active Subscription' : isMembershipExpired ? 'Expired' : 'No Active Membership'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Member UUID: <span className="font-mono text-slate-300">{user?.id}</span>
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isMembershipActive ? (
                'Your Premium membership is recognized as active in the database. You have priority task audit windows and premium campaign privileges.'
              ) : isMembershipExpired ? (
                'Your Premium subscription has expired. You remain a registered member in good standing with full access to your wallet, earned balances, and NUBAN bank payouts.'
              ) : (
                'You are registered with a verified profile. Registration on NARIVO creates a member profile only with complete access to tasks, referral rewards, and bank withdrawals. No paid membership is currently active.'
              )}
            </p>

            {/* Date Details */}
            {activeMembership && (
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                {activeMembership.starts_at && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Started: {new Date(activeMembership.starts_at).toLocaleDateString()}</span>
                  </div>
                )}
                {activeMembership.expires_at ? (
                  <div className={`flex items-center gap-1.5 ${isMembershipExpired ? 'text-amber-300' : 'text-emerald-300'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isMembershipExpired ? 'Expired on' : 'Expires'}: {new Date(activeMembership.expires_at).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <span className="text-emerald-400 font-semibold">Lifetime Access</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-center space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Settlement Status
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NUBAN Payouts Active</span>
              </span>
            </div>
            <button
              onClick={() => setCurrentScreen('wallet')}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold border border-white/[0.08] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wallet & Payouts</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Expired Member Financial Guarantee Notice */}
      <div className="glass-panel p-5 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 text-xs text-emerald-200 space-y-2">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white font-bold text-sm block font-heading">
              Financial Rights & Wallet Guarantee
            </strong>
            <p className="text-slate-300 leading-relaxed">
              Expired members retain <strong>100% full access</strong> to their wallet, earned balances, sponsored task earnings, and Nigerian NUBAN bank withdrawals. Platform rules ensure that membership tier status or expiration never alters or restricts previously earned funds.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Membership Plans Catalog (public.membership_plans) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              Platform Membership Catalog
            </h3>
            <p className="text-xs text-slate-400">
              Queried from <code className="text-emerald-300 font-mono">public.membership_plans</code>
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Premium-Only Model Active
          </span>
        </div>

        <div className="max-w-2xl mx-auto">
          {membershipPlans.map((plan) => {
            const isUnconfigured = !plan.is_active || plan.price_kobo === 0;

            return (
              <div 
                key={plan.id}
                className="glass-panel glass-specular rounded-3xl p-7 border border-white/[0.09] flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 flex items-center gap-1.5">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>{plan.name}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded border border-amber-500/25">
                      Inactive · Price Unconfigured
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-white font-heading">
                      {plan.name}
                    </h4>

                    <div className="flex items-baseline gap-2 mt-2">
                      {isUnconfigured ? (
                        <div className="space-y-1">
                          <span className="text-2xl font-black text-slate-400 font-mono">
                            Price Unconfigured
                          </span>
                          <p className="text-[11px] text-amber-300/90 font-medium">
                            Premium is currently inactive and unavailable for purchase because its price is not configured.
                          </p>
                        </div>
                      ) : (
                        <div className="text-2xl font-black font-mono text-emerald-400">
                          {formatNaira(Math.round(plan.price_kobo / 100))}
                          <span className="text-xs font-normal text-slate-400 ml-1">
                            / {plan.duration_days ? `${plan.duration_days} days` : 'lifetime'}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      {plan.description || 'Exclusive high-tier campaigns, premium sponsorship rates, priority task audit windows, and dedicated settlement pipelines.'}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Privileged reward rates on verified brand campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Expedited advertiser audit verification queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Dedicated batch NUBAN commercial bank settlement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Activation strictly via verified Paystack webhook</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Unavailable for Purchase (Price Not Configured)</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    Platform registration is 100% free. Never send payment to any party claiming to sell memberships.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Database Schema & RLS Architecture Reference */}
      <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Database Integrity & Security Policies</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            PostgreSQL RLS Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <strong className="text-white block font-semibold mb-0.5">Registration Trigger</strong>
            <span className="text-slate-400 text-[11px] leading-relaxed block">
              Creates only a profile in <code className="text-slate-300">public.profiles</code>. Never creates or assigns a membership.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <strong className="text-white block font-semibold mb-0.5">Active Expiry Check</strong>
            <span className="text-slate-400 text-[11px] leading-relaxed block">
              Memberships require <code className="text-slate-300">status = &apos;active&apos;</code> and an expiry date later than the current time.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <strong className="text-white block font-semibold mb-0.5">Payout Permanence</strong>
            <span className="text-slate-400 text-[11px] leading-relaxed block">
              Expired subscriptions never impact earned wallet balances or NUBAN withdrawal rights.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
