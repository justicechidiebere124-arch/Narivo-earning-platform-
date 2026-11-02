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
  MessageCircle, 
  QrCode, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Link,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { referralStat, referrals, showToast, isDemoAccount } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralStat.referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralStat.referralCode);
    setCopiedCode(true);
    showToast('Referral code copied!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const shareText = encodeURIComponent(
    `Join me on NARIVO to earn verified rewards in Naira (₦) by completing genuine brand tasks. Registration is 100% free! Use my link: ${referralStat.referralLink}`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Page Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span className="text-emerald-400 font-semibold">Community Growth</span>
          <span>·</span>
          <span>1-Level Direct Protocol</span>
          {isDemoAccount && (
            <>
              <span>·</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                Demo Data Active
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          1-Level Referral Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Invite friends, colleagues, and followers to NARIVO. Earn approved referral bonuses when they register free and complete verified tasks.
        </p>
      </div>

      {/* 2. Mechanism Callout Banner */}
      <div className="glass-panel-emerald rounded-3xl p-8 sm:p-10 border border-emerald-500/30 glow-emerald relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct 1-Tier Architecture · Zero Multi-Level Complexity</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            How the 1-Level Referral Protocol Works
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NARIVO operates a transparent, single-tier referral mechanism. No multi-level pyramids, no fees. When a member registers using your unique code and completes their first audited sponsored task, you receive a direct reward bonus of ₦500 credited to your available wallet balance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/[0.08] space-y-1">
              <strong className="text-white block font-bold font-heading">1. Share Your Link</strong>
              <span className="text-slate-400 text-[11px] leading-relaxed">Friends register for free with your link or unique referral code.</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/[0.08] space-y-1">
              <strong className="text-white block font-bold font-heading">2. They Complete A Task</strong>
              <span className="text-slate-400 text-[11px] leading-relaxed">They browse the marketplace and complete their first verified brand task.</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/[0.08] space-y-1">
              <strong className="text-white block font-bold font-heading">3. Instant Wallet Credit</strong>
              <span className="text-slate-400 text-[11px] leading-relaxed">You receive your referral bonus once their first task audit is approved.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Link Tools & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Link Sharing & Action Cards */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white font-heading">
            Your Unique Referral Link & Code
          </h2>

          {/* Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Personal Invitation Link
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={referralStat.referralLink}
                  className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white font-mono text-xs focus:outline-none select-all"
                />
                <Link className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={handleCopyLink}
                className="px-5 py-3 rounded-2xl btn-emerald-primary text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Code Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Referral Code
            </label>
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white font-mono text-base font-bold tracking-widest flex-1 text-center sm:text-left">
                {referralStat.referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.09] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Fast Social Channels */}
          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <span className="text-xs font-semibold text-slate-400 block">
              Share directly via social channels
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Twitter / X</span>
              </a>

              <button
                onClick={() => setShowQrModal(!showQrModal)}
                className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>QR Code</span>
              </button>
            </div>

            {showQrModal && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/[0.1] text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                  <div className="text-black text-center font-mono text-[10px] font-bold">
                    [QR CODE]<br />
                    {referralStat.referralCode}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Scan to register directly with code {referralStat.referralCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Referral Performance Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Stat 1: Total Clicks */}
            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                Link Impressions
              </span>
              <div className="text-3xl font-black font-mono text-white tracking-tight">
                {referralStat.totalClicks}
              </div>
              <span className="text-[10px] text-slate-500">Tracked visitor clicks</span>
            </div>

            {/* Stat 2: Registered */}
            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                Total Signups
              </span>
              <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                {referralStat.registeredCount}
              </div>
              <span className="text-[10px] text-slate-500">Free registered peers</span>
            </div>

            {/* Stat 3: Active Earners */}
            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                Active Earners
              </span>
              <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                {referralStat.activeEarnersCount}
              </div>
              <span className="text-[10px] text-slate-500">Completed 1+ verified task</span>
            </div>

            {/* Stat 4: Bonus Earned */}
            <div className="glass-panel p-5 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                Referral Bonuses
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                {formatNaira(referralStat.totalEarnedNaira)}
              </div>
              <span className="text-[10px] text-slate-500">Credited to wallet balance</span>
            </div>
          </div>

          {/* Referral Integrity Policy */}
          <div className="glass-panel p-5 rounded-3xl space-y-2.5 border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-Sybil & Account Integrity</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Referral bonuses require legitimate first task completion. Self-referrals, proxy rings, and duplicate accounts are automatically detected and blocked to protect platform advertisers.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Referred Members Ledger Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-lg font-bold text-white font-heading">
              Referred Members Network
            </h2>
            <p className="text-xs text-slate-400">
              Members registered under your direct 1-level referral link.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {referrals.length} Members Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 text-[10px] uppercase tracking-wider font-heading">
                <th className="pb-3 font-semibold">Member Name</th>
                <th className="pb-3 font-semibold">Join Date</th>
                <th className="pb-3 font-semibold">Activity Status</th>
                <th className="pb-3 font-semibold text-right">Commission Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No referred members yet. Share your invitation link above to get started!
                  </td>
                </tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 text-white font-bold">
                      {ref.name}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {ref.joinedDate}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        ref.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-emerald-400">
                      +{formatNaira(ref.commissionEarnedNaira)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
