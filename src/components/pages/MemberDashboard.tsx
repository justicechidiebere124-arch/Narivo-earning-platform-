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
  Wallet, 
  ArrowUpRight, 
  CheckSquare, 
  Clock, 
  Users, 
  ArrowRight,
  RotateCw,
  FileText,
  CreditCard,
  User,
  ShieldCheck,
  Crown
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { 
    user, 
    activeMembership,
    isMembershipActive,
    isMembershipExpired,
    availableBalance, 
    pendingRewards, 
    reservedFunds,
    lifetimeEarned, 
    tasks, 
    submissions, 
    transactions, 
    referrals,
    setCurrentScreen,
    refreshAllData,
    showToast
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Time-aware greeting
  const firstName = user?.fullName?.split(' ')[0] || 'Member';
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Database-backed real metrics
  const completedTasksCount = submissions.filter(s => s.status === 'approved').length;
  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending_review').length;
  const referralsCount = referrals.length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Dashboard refreshed from database.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-semibold text-slate-400 block">
            {getGreeting()},
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            {user?.fullName || 'Member Account'}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <Badge variant={isMembershipActive ? 'success' : 'neutral'}>
              {isMembershipActive 
                ? 'Active Premium Member' 
                : 'Registered — No Active Membership'}
            </Badge>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Synchronize records with database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. WALLET OVERVIEW (PRIMARY BALANCE CARD) */}
      <Card variant="balance" padding="lg" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight tabular-nums text-white">
              {formatNaira(availableBalance)}
            </div>
            <p className="text-xs text-emerald-200/80">
              Approved funds available for bank withdrawal
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentScreen('wallet')}
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              Withdraw Funds
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setCurrentScreen('wallet')}
            >
              View Wallet
            </Button>
          </div>
        </div>

        {/* Balance Breakdown Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-emerald-500/20 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-emerald-300/80 block">Pending Audit</span>
            <span className="font-mono font-bold text-sm text-white">
              {formatNaira(pendingRewards)}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-emerald-300/80 block">Reserved for Payout</span>
            <span className="font-mono font-bold text-sm text-white">
              {formatNaira(reservedFunds)}
            </span>
          </div>

          <div className="space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-emerald-300/80 block">Lifetime Approved</span>
            <span className="font-mono font-bold text-sm text-white">
              {formatNaira(lifetimeEarned)}
            </span>
          </div>
        </div>
      </Card>

      {/* 3. PERFORMANCE OVERVIEW (STRICTLY SUPABASE DATA) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white font-heading">
          Account Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <StatCard
            label="Approved Tasks"
            value={completedTasksCount}
            subtext="Verified completions"
            icon={<CheckSquare className="w-4 h-4 text-emerald-400" />}
          />

          <StatCard
            label="Pending Review"
            value={pendingSubmissionsCount}
            subtext="In sponsor audit"
            icon={<Clock className="w-4 h-4 text-amber-400" />}
          />

          <StatCard
            label="Total Referrals"
            value={referralsCount}
            subtext="Direct invited users"
            icon={<Users className="w-4 h-4 text-emerald-400" />}
          />

          <StatCard
            label="Available Tasks"
            value={tasks.length}
            subtext="Active in marketplace"
            icon={<FileText className="w-4 h-4 text-emerald-400" />}
          />
        </div>
      </div>

      {/* 4. QUICK ACCESS */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white font-heading">
          Quick Access
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setCurrentScreen('tasks')}
            className="p-4 rounded-xl bg-[#0b1016] border border-white/[0.07] hover:border-emerald-500/30 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-emerald-300">Explore Tasks</span>
              <span className="text-[11px] text-slate-500 block">Browse brand campaigns</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('wallet')}
            className="p-4 rounded-xl bg-[#0b1016] border border-white/[0.07] hover:border-emerald-500/30 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-emerald-300">Wallet Ledger</span>
              <span className="text-[11px] text-slate-500 block">Withdrawals & balance</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('referrals')}
            className="p-4 rounded-xl bg-[#0b1016] border border-white/[0.07] hover:border-emerald-500/30 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-emerald-300">Invitations</span>
              <span className="text-[11px] text-slate-500 block">Share unique code</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('profile')}
            className="p-4 rounded-xl bg-[#0b1016] border border-white/[0.07] hover:border-emerald-500/30 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-emerald-300">Profile & Bank</span>
              <span className="text-[11px] text-slate-500 block">Manage NUBAN details</span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. RECENT WALLET LEDGER ACTIVITY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-heading">
            Recent Ledger Activity
          </h2>
          {transactions.length > 0 && (
            <button
              onClick={() => setCurrentScreen('wallet')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-5 h-5 text-slate-400" />}
            title="No recent activity yet."
            description="When tasks are approved or withdrawals are requested, ledger credits and debits will appear here."
            actionLabel="Browse Available Tasks"
            onAction={() => setCurrentScreen('tasks')}
          />
        ) : (
          <div className="rounded-2xl bg-[#0b1016] border border-white/[0.07] divide-y divide-white/[0.05] overflow-hidden">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="font-semibold text-white block truncate">
                    {tx.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{tx.date}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-500">{tx.reference}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold font-mono text-emerald-400 text-sm">
                    {formatNaira(tx.amountNaira)}
                  </span>
                  <Badge variant="success" className="block text-right mt-1 ml-auto">
                    Approved
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
