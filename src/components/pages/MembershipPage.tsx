/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { Card, Badge, Button } from '../ui';
import { 
  ShieldCheck, 
  Crown, 
  CheckCircle2, 
  Lock, 
  RotateCw, 
  Clock, 
  Wallet,
  AlertTriangle,
  ArrowRight,
  Shield
} from 'lucide-react';

export const MembershipPage: React.FC = () => {
  const { 
    user, 
    activeMembership, 
    isMembershipActive,
    isMembershipExpired,
    membershipLoading, 
    refreshMembership, 
    setCurrentScreen, 
    showToast 
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);

  usePageSeo({
    title: 'Membership Status – NARIVO',
    description: 'Review your NARIVO subscription tier, status evaluated directly from public.memberships and financial rights guarantee.',
    canonicalPath: '/membership',
  });

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

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          isLoading={refreshing || membershipLoading}
          leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto"
        >
          Refresh Status
        </Button>
      </div>

      {/* 2. Current User Membership Card */}
      <Card 
        variant={isMembershipActive ? 'balance' : 'default'}
        className="p-6 sm:p-7"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={isMembershipActive ? 'emerald' : isMembershipExpired ? 'warning' : 'neutral'}
                size="sm"
              >
                {isMembershipActive ? (
                  <>
                    <Crown className="w-3 h-3" />
                    <span>Active Premium</span>
                  </>
                ) : isMembershipExpired ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Subscription Expired</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>Registered Profile</span>
                  </>
                )}
              </Badge>
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
            <Button
              onClick={() => setCurrentScreen('wallet')}
              variant="primary"
              size="sm"
              leftIcon={<Wallet className="w-3.5 h-3.5" />}
            >
              Access Wallet
            </Button>
            <Button
              onClick={() => setCurrentScreen('tasks')}
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Browse Tasks
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Platform Membership Tiers */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white font-heading">
            Platform Membership Tiers
          </h2>
          <p className="text-xs text-slate-400">
            Official tier configuration from <code className="text-emerald-300 font-mono text-[11px]">public.membership_plans</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Premium Plan (Inactive & Unpriced) */}
          <Card variant="elevated" className="p-6 sm:p-7 space-y-5 flex flex-col justify-between">
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

                <Badge variant="warning" size="sm">
                  Plan Inactive
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Official NARIVO Premium tier. Grants priority access to high-value sponsored campaigns, expedited 12-hour audit verification, and direct partner campaign unlocks.
              </p>

              {/* Price Row: Unconfigured Notice */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Subscription Fee</span>
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
              <Button
                disabled
                variant="outline"
                size="md"
                className="w-full opacity-60 cursor-not-allowed"
                leftIcon={<Lock className="w-3.5 h-3.5" />}
              >
                Registration Currently Unavailable
              </Button>
            </div>
          </Card>

          {/* Right Card: Financial Rights Preservation Guarantee */}
          <Card variant="elevated" className="p-6 sm:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
                <Shield className="w-4 h-4 text-emerald-400" />
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

            <Button
              onClick={() => setCurrentScreen('wallet')}
              variant="secondary"
              size="md"
              className="w-full"
              leftIcon={<Wallet className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Go to Member Wallet
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
