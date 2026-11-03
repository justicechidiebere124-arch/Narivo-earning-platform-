/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatCard } from '../ui/StatCard';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  RotateCw,
  Link as LinkIcon,
  Clock
} from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { referralStat, referrals, referralsLoading, refreshAllData, showToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyLink = () => {
    if (!referralStat.referralLink) return;
    navigator.clipboard.writeText(referralStat.referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    if (!referralStat.referralCode) return;
    navigator.clipboard.writeText(referralStat.referralCode);
    setCopiedCode(true);
    showToast('Referral code copied.');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Referral records refreshed from database.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-semibold text-emerald-400 block">
            Member Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Referrals & Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Invite fellow Nigerian users to NARIVO using your personal invitation code.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || referralsLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh referrals from database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || referralsLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Mechanism & Commission Status Callout */}
      <Card variant="standard" padding="lg" className="space-y-4">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Single-Tier Member Referral Model</span>
          </div>
          <Badge variant="warning">
            Commission Rate: Pending Configuration
          </Badge>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          NARIVO operates a direct single-level referral structure without pyramid schemes or hidden onboarding fees. Commission payout rates and eligibility thresholds are currently pending official platform configuration. Referral rewards will be published and governed by verified server-side task compliance.
        </p>

        {/* Share Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Referral Code */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.07] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Your Referral Code</span>
              <span className="text-base sm:text-lg font-black font-mono text-emerald-400 tracking-wider">
                {referralStat.referralCode || 'GENERATING...'}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyCode}
              icon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedCode ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* Referral Link */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.07] flex items-center justify-between gap-3">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Invitation Link</span>
              <span className="text-xs font-mono text-slate-300 truncate block">
                {referralStat.referralLink || 'Generating link...'}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Copied' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Referral Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <StatCard
          label="Total Invited Members"
          value={referralStat.registeredCount}
          subtext="Registered with your code"
          icon={<Users className="w-4 h-4 text-emerald-400" />}
        />

        <StatCard
          label="Active Earners"
          value={referralStat.activeEarnersCount}
          subtext="Participating in tasks"
          icon={<Clock className="w-4 h-4 text-emerald-400" />}
        />

        <StatCard
          label="Commissions Earned"
          value={formatNaira(referralStat.totalEarnedNaira)}
          subtext="Credited to wallet ledger"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* 4. Referral Roster (Strictly Supabase records) */}
      <Card variant="standard" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h2 className="text-base font-bold text-white font-heading">
            Invited Member Roster
          </h2>
          <span className="text-xs text-slate-400">
            {referrals.length} {referrals.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {referrals.length === 0 ? (
          <EmptyState
            icon={<Users className="w-5 h-5 text-slate-400" />}
            title="No invited members yet."
            description="Share your unique referral code or link with peers. When they register, they will appear in this roster."
            actionLabel="Copy Invitation Link"
            onAction={handleCopyLink}
          />
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-white block">
                    {ref.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Joined on {ref.joinedDate}
                  </span>
                </div>

                <div className="text-right">
                  <Badge variant={ref.status === 'active' ? 'success' : 'neutral'}>
                    {ref.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
