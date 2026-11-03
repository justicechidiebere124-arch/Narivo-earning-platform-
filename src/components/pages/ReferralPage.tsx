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
  AlertCircle,
  Link,
  Info
} from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { referralStat, referrals, referralsLoading, refreshAllData, showToast } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralStat.referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">Direct 1-Tier Program</span>
            <span>·</span>
            <span>Member Invitations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Referrals & Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Share your unique invite code with fellow Nigerian earners.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || referralsLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh referrals from Supabase"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || referralsLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Mechanism & Commission Status Callout */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#090f15] border border-white/[0.08] space-y-4">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Transparent 1-Level Referral Protocol</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full">
            Commission Rate: Pending Configuration
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          NARIVO operates a direct, single-tier referral mechanism. No multi-level networks or hidden registration charges. Commission payouts are currently pending administrator configuration (database default is currently ₦0.00). Referral rewards will be governed strictly through verified server-side payment and task audit workflows.
        </p>

        {/* Share Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Referral Code */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase">Your Referral Code</span>
              <span className="text-base sm:text-lg font-black font-mono text-emerald-400 tracking-wider">
                {referralStat.referralCode || 'GENERATING...'}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
              title="Copy Referral Code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Referral Link */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block uppercase">Direct Referral Link</span>
              <span className="text-xs font-mono text-slate-300 truncate block">
                {referralStat.referralLink || 'Generating link...'}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl btn-emerald-primary text-white transition-all cursor-pointer shrink-0"
              title="Copy Full Referral Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Referral Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Referrals</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-white">
            {referralStat.registeredCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Registered accounts</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Eligible Members</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-white">
            {referralStat.activeEarnersCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Active platform status</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Pending Rewards</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-white">
            ₦0.00
          </div>
          <span className="text-[10px] text-slate-500 block">Awaiting audit</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.08] space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Credited Rewards</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
            {formatNaira(referralStat.totalEarnedNaira)}
          </div>
          <span className="text-[10px] text-slate-500 block">Transferred to balance</span>
        </div>
      </div>

      {/* 4. Referred Members Table from public.referrals */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4 border border-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Referred Members List
            </h2>
            <p className="text-xs text-slate-400">
              Accounts linked to your referral code in <code className="text-emerald-300 font-mono text-[11px]">public.referrals</code>.
            </p>
          </div>
        </div>

        {referralsLoading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Querying referral database...</span>
          </div>
        ) : referrals.length === 0 ? (
          <div className="py-12 text-center space-y-2 px-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">
              No referrals yet
            </h3>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              When members register using your code or link, their records will appear in this table.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 text-[10px] uppercase tracking-wider font-heading">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Registered Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-white font-medium">
                      {ref.name}
                    </td>
                    <td className="py-3 text-slate-400">
                      {ref.joinedDate}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">
                      {formatNaira(ref.commissionEarnedNaira)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
