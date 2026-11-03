/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  CreditCard, 
  TrendingUp, 
  Crown,
  Bell,
  Eye,
  EyeOff,
  History,
  CheckSquare,
  User,
  X,
  AlertTriangle,
  ArrowRight,
  RotateCw,
  AlertCircle,
  Lock
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

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
    tasksLoading,
    tasksError,
    submissions, 
    transactions, 
    walletLoading,
    walletError,
    referrals,
    setCurrentScreen,
    setSelectedTaskForSubmission,
    refreshAllData,
    showToast
  } = useApp();

  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Time-aware greeting
  const firstName = user?.fullName?.split(' ')[0] || 'Member';
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Database-backed metrics
  const completedTasksCount = submissions.filter(s => s.status === 'approved').length;
  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending_review').length;
  const referralsCount = referrals.length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Dashboard data refreshed from Supabase.');
  };

  const notifications = [
    {
      id: 'notif-1',
      title: 'Authenticated Session Active',
      message: 'Your member account is connected to Supabase PostgreSQL.',
      time: 'Live',
    },
    {
      id: 'notif-2',
      title: 'Settlement Threshold',
      message: 'Direct 10-digit NUBAN transfers require a minimum balance of ₦5,000.00.',
      time: 'Policy',
    },
    {
      id: 'notif-3',
      title: 'Task Evidence Audit',
      message: 'Advertisers review task proof submissions within 12–48 hours.',
      time: 'Notice',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7 relative">
      {/* 1. HEADER: GREETING, MEMBERSHIP BADGE & NOTIFICATION BELL */}
      <header className="flex items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white font-black text-xl flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.35)] border border-emerald-400/30">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#06090c]" />
          </div>

          <div className="min-w-0">
            <span className="text-[11px] font-medium text-slate-400 block tracking-tight">
              {getGreeting()},
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading truncate">
                {firstName}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 flex items-center gap-1 ${
                isMembershipActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : isMembershipExpired
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/[0.06] text-slate-300 border-white/[0.1]'
              }`}>
                {isMembershipActive ? (
                  <>
                    <Crown className="w-3 h-3 text-emerald-400" />
                    <span>Premium Member</span>
                  </>
                ) : isMembershipExpired ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>Premium (Expired)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Registered Member</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Refresh & Notification Bell */}
        <div className="flex items-center gap-2 shrink-0 relative">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || walletLoading}
            className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
            title="Refresh database records"
            aria-label="Refresh database records"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing || walletLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </button>

          {/* Notifications Popover */}
          {isNotificationsOpen && (
            <div 
              role="dialog"
              aria-modal="true"
              className="absolute right-0 top-12 z-50 w-80 sm:w-88 glass-panel rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/[0.12] p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-heading">Platform Notices</span>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1 hover:border-emerald-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-[11px]">{n.title}</span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{n.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsNotificationsOpen(false);
                  showToast('Notices marked as viewed.');
                }}
                className="w-full py-1.5 text-center text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Database Error Banner with Retry */}
      {(walletError || tasksError) && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Database query encountered an issue: {walletError || tasksError}</span>
          </div>
          <button
            onClick={handleManualRefresh}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. PROMINENT SIGNATURE WALLET CARD */}
      <div className="rounded-3xl p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/35 shadow-[0_20px_55px_rgba(2,44,30,0.65)] glass-specular space-y-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Top Header Row of Wallet Card */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest font-heading flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available Balance</span>
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 text-emerald-300/80 hover:text-white transition-colors cursor-pointer"
              title={showBalance ? 'Hide balance' : 'Show balance'}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300/90 bg-emerald-950/70 border border-emerald-400/30 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>10-Digit NUBAN Channel</span>
          </div>
        </div>

        {/* Available Balance In Naira */}
        <div className="relative z-10 space-y-1">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight tabular-nums drop-shadow-md">
            {showBalance ? formatNaira(availableBalance) : '₦ • • • • • •'}
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-200/80 pt-0.5">
            <span>Minimum withdrawal threshold:</span>
            <span className="font-mono font-bold text-white">₦5,000.00</span>
          </div>
        </div>

        {/* Pending Rewards & Reserved Funds Inset */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/45 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Pending Rewards
              </span>
              <span className="text-base font-black font-mono text-white tabular-nums">
                {showBalance ? formatNaira(pendingRewards) : '₦ • • •'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {pendingSubmissionsCount} task(s) awaiting verification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:border-white/[0.08] sm:pl-4">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-slate-300 shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Reserved For Payout
              </span>
              <span className="text-base font-black font-mono text-white tabular-nums">
                {showBalance ? formatNaira(reservedFunds) : '₦ • • •'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Locked in processing batches
              </span>
            </div>
          </div>
        </div>

        {/* Shortcuts: Withdraw, History, Wallet */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 relative z-10 pt-1">
          <button
            onClick={() => setCurrentScreen('wallet')}
            className="min-h-[46px] px-3 sm:px-4 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => setCurrentScreen('wallet')}
            className="min-h-[46px] px-3 sm:px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <History className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>History</span>
          </button>

          <button
            onClick={() => setCurrentScreen('wallet')}
            className="min-h-[46px] px-3 sm:px-4 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Wallet</span>
          </button>
        </div>
      </div>

      {/* 3. ACCOUNT OVERVIEW CARDS (TOTAL EARNED, TASKS COMPLETED, REFERRALS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Total Earned */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Total Earned
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight tabular-nums">
            {showBalance ? formatNaira(lifetimeEarned) : '₦ • • •'}
          </div>
          <p className="text-[10px] text-slate-500">
            Cumulative verified ledger credits
          </p>
        </div>

        {/* Card 2: Tasks Completed */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Tasks Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight tabular-nums">
            {completedTasksCount}
          </div>
          <p className="text-[10px] text-slate-500">
            {pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} pending audit` : 'Zero pending audit'}
          </p>
        </div>

        {/* Card 3: Referrals */}
        <div className="glass-panel rounded-2xl p-5 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Referred Members
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight tabular-nums">
            {referralsCount}
          </div>
          <p className="text-[10px] text-slate-500">
            Linked to your referral code
          </p>
        </div>
      </div>

      {/* 4. QUICK ACCESS SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-heading">
            Quick Access
          </h2>
          <span className="text-xs text-slate-400">
            Platform operations
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setCurrentScreen('tasks')}
            className="p-4 rounded-2xl glass-panel glass-card-interactive border border-white/[0.08] flex flex-col justify-between text-left cursor-pointer group space-y-3 min-h-[105px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Explore Tasks
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Browse campaigns
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('referrals')}
            className="p-4 rounded-2xl glass-panel glass-card-interactive border border-white/[0.08] flex flex-col justify-between text-left cursor-pointer group space-y-3 min-h-[105px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Referral Network
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Share code & link
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('membership')}
            className="p-4 rounded-2xl glass-panel glass-card-interactive border border-white/[0.08] flex flex-col justify-between text-left cursor-pointer group space-y-3 min-h-[105px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Crown className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Membership
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isMembershipActive ? 'Premium Active' : isMembershipExpired ? 'Expired' : 'Registered tier'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentScreen('profile')}
            className="p-4 rounded-2xl glass-panel glass-card-interactive border border-white/[0.08] flex flex-col justify-between text-left cursor-pointer group space-y-3 min-h-[105px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Profile & Bank
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                NUBAN settings
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* 5. AVAILABLE TASKS & WALLET ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Available Tasks from Supabase (7 cols) */}
        <section className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-6 space-y-4 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                Sponsored Opportunities
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified brand campaigns from Supabase database
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('tasks')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasksLoading ? (
              <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Checking active campaigns in database...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-8 text-center space-y-2 px-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center mx-auto">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">
                  No tasks available right now
                </div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Active campaigns will appear here once published by brand advertisers.
                </p>
              </div>
            ) : (
              tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {task.sponsorName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {task.instructions[0] || 'Complete task requirements'}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                      {formatNaira(task.rewardNaira)}
                    </span>
                    <button
                      onClick={() => setSelectedTaskForSubmission(task)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold transition-all cursor-pointer border border-white/[0.1] hover:border-emerald-500"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right: Real Wallet Activity Ledger from Supabase (5 cols) */}
        <section className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-6 space-y-4 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white font-heading">
                Recent Activity
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified wallet ledger entries
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('wallet')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {walletLoading ? (
              <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Loading ledger records...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center space-y-3 px-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center mx-auto">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">
                    No transactions yet
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Approved task earnings and bank payouts will be recorded in this ledger.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScreen('tasks')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-1 cursor-pointer"
                >
                  <span>Explore Available Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {tx.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {tx.date}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold font-mono ${
                      tx.type === 'withdrawal' ? 'text-slate-300' : 'text-emerald-400'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}
                      {formatNaira(tx.amountNaira)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
