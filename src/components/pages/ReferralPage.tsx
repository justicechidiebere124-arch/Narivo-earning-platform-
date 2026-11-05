/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  RotateCw,
  Link as LinkIcon,
  Tag,
  Clock,
  CheckCircle2
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/20">
        <div>
          <span className="text-xs font-semibold text-emerald-300 block">
            Member Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Referrals & Network
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Invite fellow Nigerian digital earners using your personal invitation code or link.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || referralsLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-emerald-400/25 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh referrals from database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || referralsLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Mechanism & Commission Callout */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#064e3b]/70 via-[#043d2e]/80 to-[#022c22]/90 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_16px_40px_rgba(1,26,20,0.7)] space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Single-Tier Referral Model</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
            Zero Onboarding Fees
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          NARIVO operates a direct single-level referral structure without pyramid schemes. When members join through your referral link, approved referral commissions are credited directly to your financial ledger.
        </p>

        {/* Share Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Referral Code */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-400/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Your Referral Code</span>
              <span className="font-mono font-bold text-white text-sm">{referralStat.referralCode || 'NAR-XXXXXX'}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-emerald-300 transition-colors cursor-pointer"
              title="Copy referral code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Referral Link */}
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-400/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0 pr-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Invite Link</span>
              <span className="font-mono text-emerald-300 text-xs truncate block">
                {referralStat.referralLink || 'https://narivo.app/?ref=...'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-emerald-300 transition-colors cursor-pointer shrink-0"
              title="Copy referral link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Referral Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Registered Members</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            {referralStat.registeredCount}
          </div>
          <p className="text-[11px] text-slate-400">Total sign-ups via your invite</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Active Earners</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">
            {referralStat.activeEarnersCount}
          </div>
          <p className="text-[11px] text-slate-400">Members with approved tasks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
            <span>Referral Earnings</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 tabular-nums">
            {formatNaira(referralStat.totalEarnedNaira)}
          </div>
          <p className="text-[11px] text-slate-400">Approved commission total</p>
        </div>
      </div>

      {/* 4. Referral Roster Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/25 space-y-4 shadow-[0_12px_36px_rgba(1,26,20,0.5)]">
        <div className="flex items-center justify-between border-b border-emerald-400/15 pb-3">
          <h3 className="text-sm font-bold text-white font-heading">
            Invited Members ({referrals.length})
          </h3>
          <span className="text-[11px] text-slate-400">Real-time database sync</span>
        </div>

        {referrals.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Users className="w-8 h-8 text-emerald-400/50 mx-auto" />
            <p className="text-xs text-slate-300 font-semibold">No Referrals Registered Yet</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Share your referral code or link with friends. When they register, they will appear in your network.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-black/30 border border-emerald-400/15 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{r.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">Joined {r.joinedDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-300 font-semibold">
                    +{formatNaira(r.commissionEarnedNaira)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/25">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
