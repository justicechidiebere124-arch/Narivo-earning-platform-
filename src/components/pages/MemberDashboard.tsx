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
  ArrowRight
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
    lifetimeEarned, 
    tasks, 
    submissions, 
    transactions, 
    setCurrentScreen,
    setSelectedTaskForSubmission,
    showToast
  } = useApp();

  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [txFilter, setTxFilter] = useState<'all' | 'task_reward' | 'withdrawal' | 'referral_bonus'>('all');

  // Personalized greeting based on local time
  const firstName = user?.fullName?.split(' ')[0] || 'Member';
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Accurate database statistics
  const completedTasksCount = submissions.filter(s => s.status === 'approved').length;
  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending_review').length;

  const filteredTransactions = transactions.filter(t => {
    if (txFilter === 'all') return true;
    return t.type === txFilter;
  });

  // Authentic system notifications for member operations
  const notifications = [
    {
      id: 'notif-1',
      title: 'Profile & Security Active',
      message: 'Your authenticated member profile is connected to Supabase.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Direct NUBAN Settlement',
      message: 'Payouts are batched to Nigerian commercial bank accounts (min ₦5,000.00).',
      time: 'Standard rule',
      unread: false,
    },
    {
      id: 'notif-3',
      title: 'Audit Verification Window',
      message: 'Advertisers review task proof submissions within 12–48 hours.',
      time: 'Policy',
      unread: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 relative">
      {/* 1. PREMIUM NARIVO HEADER: PERSONALIZED GREETING, AVATAR & NOTIFICATIONS */}
      <header className="flex items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
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

        {/* Right Action Icons: Notification Bell */}
        <div className="flex items-center gap-2 shrink-0 relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
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
                  <span className="text-xs font-bold text-white font-heading">Notifications</span>
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
                      <span className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{n.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsNotificationsOpen(false);
                  showToast('All notifications marked as read.');
                }}
                className="w-full py-1.5 text-center text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. PROMINENT SIGNATURE WALLET CARD */}
      <div className="rounded-3xl p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/35 shadow-[0_20px_55px_rgba(2,44,30,0.65)] glass-specular space-y-6">
        {/* Subtle background ambient mesh */}
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
            <span>NUBAN Settlement Ready</span>
          </div>
        </div>

        {/* Prominent Balance In Naira */}
        <div className="relative z-10 space-y-1">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight tabular-nums drop-shadow-md">
            {showBalance ? formatNaira(availableBalance) : '₦ • • • • • •'}
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-200/80 pt-0.5">
            <span>Minimum payout threshold:</span>
            <span className="font-mono font-bold text-white">₦5,000.00</span>
          </div>
        </div>

        {/* Pending Rewards Inset Strip (Clearly Separated) */}
        <div className="relative z-10 bg-black/45 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                Pending Rewards
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-white tabular-nums">
                {showBalance ? formatNaira(pendingRewards) : '₦ • • •'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300/90 sm:text-right">
            <span>{pendingSubmissionsCount} task proof(s) in advertiser review</span>
            <span className="block text-[10px] text-slate-400">Credited to available balance upon verification</span>
          </div>
        </div>

        {/* Three Shortcuts: Withdraw, History, Wallet */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 relative z-10 pt-1">
          {/* 1. Withdraw Button (Primary) */}
          <button
            onClick={() => setCurrentScreen('wallet')}
            className="py-3 px-3 sm:px-4 rounded-2xl btn-emerald-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <span>Withdraw</span>
          </button>

          {/* 2. History Shortcut */}
          <button
            onClick={() => setCurrentScreen('wallet')}
            className="py-3 px-3 sm:px-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <History className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>History</span>
          </button>

          {/* 3. Wallet Shortcut */}
          <button
            onClick={() => setCurrentScreen('wallet')}
            className="py-3 px-3 sm:px-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Wallet</span>
          </button>
        </div>
      </div>

      {/* 3. ACCOUNT OVERVIEW CARDS (TOTAL EARNED & TASKS COMPLETED) */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
        {/* Card 1: Total Earned */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/[0.08] flex flex-col justify-between space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Total Earned
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight tabular-nums">
              {showBalance ? formatNaira(lifetimeEarned) : '₦ • • •'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Cumulative verified payouts
            </p>
          </div>
        </div>

        {/* Card 2: Tasks Completed */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/[0.08] flex flex-col justify-between space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Tasks Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight tabular-nums">
              {completedTasksCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} pending audit` : 'Zero pending audit'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACCESS SECTION (EXPLORE TASKS, REFERRALS, MEMBERSHIP, PROFILE) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white font-heading">
            Quick Access
          </h2>
          <span className="text-xs text-slate-400">
            Platform actions
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Quick Access 1: Explore Tasks */}
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

          {/* Quick Access 2: Referrals */}
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
                Share & earn bonus
              </div>
            </div>
          </button>

          {/* Quick Access 3: Membership */}
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
                {isMembershipActive ? 'Premium Active' : isMembershipExpired ? 'Expired' : 'Tier details'}
              </div>
            </div>
          </button>

          {/* Quick Access 4: Profile */}
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
                NUBAN details
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* 5. AVAILABLE CAMPAIGNS & RECENT WALLET ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Available Sponsored Campaigns (7 cols) */}
        <section className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-6 space-y-5 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Sponsored Campaigns
              </h3>
              <p className="text-[11px] text-slate-400">
                Complete and submit proof to earn Naira rewards
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
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {task.category}
                    </span>
                    <span className="text-xs text-slate-400 truncate">
                      {task.sponsorName}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span>Est. {task.estimatedMinutes} mins</span>
                    <span>·</span>
                    <span>{task.remainingSlots} slots remaining</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0">
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
                    {formatNaira(task.rewardNaira)}
                  </span>
                  <button
                    onClick={() => setSelectedTaskForSubmission(task)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold transition-all cursor-pointer border border-white/[0.1] hover:border-emerald-500"
                  >
                    Start Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Real Wallet Activity Ledger (5 cols) */}
        <section className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-6 space-y-5 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                Recent Activity
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified wallet transactions
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

          {/* Filter Bar */}
          {transactions.length > 0 && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
              {(['all', 'task_reward', 'withdrawal'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTxFilter(type)}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    txFilter === type 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type === 'task_reward' ? 'Rewards' : type}
                </button>
              ))}
            </div>
          )}

          {/* Genuine Ledger Records or Authentic Empty State */}
          <div className="space-y-2.5">
            {filteredTransactions.length === 0 ? (
              <div className="py-8 text-center space-y-3 px-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-emerald-400/70 flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">
                    No transactions recorded yet
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                    Your approved task rewards, referral commissions, and bank withdrawals will appear here.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScreen('tasks')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-1 cursor-pointer"
                >
                  <span>Browse Available Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              filteredTransactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {tx.title}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{tx.date}</span>
                      <span>·</span>
                      <span className={`capitalize ${
                        tx.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
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
