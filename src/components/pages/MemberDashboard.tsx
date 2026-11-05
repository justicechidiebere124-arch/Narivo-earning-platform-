/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { Card, Modal, Input, Select, Button } from '../ui';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckSquare, 
  Clock, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Smartphone,
  Wifi,
  Send,
  ShieldCheck,
  Building2,
  Info,
  RotateCw,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const { 
    user, 
    isMembershipActive,
    availableBalance, 
    pendingRewards, 
    transactions,
    lifetimeEarned, 
    tasks, 
    submissions, 
    requestWithdrawal,
    setCurrentScreen,
    refreshAllData,
    showToast
  } = useApp();

  const [activeWalletIndex, setActiveWalletIndex] = useState<number>(0); // 0 = Main Wallet, 1 = Task Wallet
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    serviceName: string;
  }>({
    open: false,
    title: '',
    description: '',
    serviceName: '',
  });

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [bankName, setBankName] = useState<string>(user?.bankDetails?.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState<string>(user?.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState<string>(user?.bankDetails?.accountName || user?.fullName || '');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  // Carousel touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped left -> Next card
      setActiveWalletIndex(1);
    } else if (diff < -45) {
      // Swiped right -> Prev card
      setActiveWalletIndex(0);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Dashboard records synchronized with database.');
  };

  // Main Wallet balance: derived from ledger deposits if any, otherwise ₦0.00
  const mainWalletBalance = transactions
    .filter((t) => t.type === 'deposit' || t.type === 'membership_funding')
    .reduce((sum, t) => sum + t.amountNaira, 0);

  // Database-backed real metrics
  const completedTasksCount = submissions.filter((s) => s.status === 'approved').length;
  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending_review').length;

  const firstName = user?.fullName?.split(' ')[0] || 'Member';

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    if (withdrawAmount < 5000) {
      setWithdrawError('Minimum withdrawal amount is ₦5,000.00.');
      return;
    }
    if (withdrawAmount > availableBalance) {
      setWithdrawError(`Insufficient Task Wallet balance. You currently have ${formatNaira(availableBalance)} available.`);
      return;
    }
    if (!accountNumber || accountNumber.replace(/\D/g, '').length !== 10) {
      setWithdrawError('Please provide a valid 10-digit Nigerian NUBAN account number.');
      return;
    }
    if (!accountName.trim()) {
      setWithdrawError('Please enter the verified legal name of the account holder.');
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await requestWithdrawal(withdrawAmount, bankName, accountNumber, accountName);
      if (res.success) {
        setShowWithdrawModal(false);
        setWithdrawAmount(5000);
      } else {
        setWithdrawError(res.message);
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      
      {/* 1. TOP HEADER & GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/20">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-emerald-300 font-semibold">Member Portal</span>
            <span className="text-emerald-400/40">·</span>
            <span>{isMembershipActive ? 'Active Premium Member' : 'Registered Free Member'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Welcome back, {firstName}
          </h1>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-emerald-400/25 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Synchronize records with Supabase database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. WALLET CAROUSEL (EXACTLY TWO CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Your Wallets
          </span>

          {/* Navigation Controls & Pagination Dots */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-label="Wallet selection">
              <button
                type="button"
                onClick={() => setActiveWalletIndex(0)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeWalletIndex === 0 
                    ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                    : 'bg-emerald-400/30 hover:bg-emerald-400/50'
                }`}
                aria-label="Go to Main Wallet"
              />
              <button
                type="button"
                onClick={() => setActiveWalletIndex(1)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeWalletIndex === 1 
                    ? 'w-6 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                    : 'bg-emerald-400/30 hover:bg-emerald-400/50'
                }`}
                aria-label="Go to Task Wallet"
              />
            </div>

            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveWalletIndex(0)}
                disabled={activeWalletIndex === 0}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 border border-emerald-400/20 text-slate-200 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous wallet"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveWalletIndex(1)}
                disabled={activeWalletIndex === 1}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 border border-emerald-400/20 text-slate-200 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next wallet"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden rounded-3xl touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeWalletIndex * 100}%)` }}
          >
            {/* CARD 1: MAIN WALLET */}
            <div className="w-full shrink-0 p-0.5">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#064e3b]/85 via-[#043d2e]/90 to-[#022c22]/95 backdrop-blur-2xl border border-emerald-400/35 shadow-[0_20px_50px_rgba(1,26,20,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] p-6 sm:p-7 space-y-5 overflow-hidden">
                {/* Top specular sheen */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent pointer-events-none" 
                  aria-hidden="true" 
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                      <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                        Main Wallet
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight tabular-nums text-white">
                      {formatNaira(mainWalletBalance)}
                    </div>
                    <p className="text-xs text-slate-300 max-w-md pt-0.5">
                      Fund your wallet to purchase membership.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddFundsModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_10px_24px_rgba(16,185,129,0.35)] active:scale-[0.98] transition-all cursor-pointer shrink-0 min-h-[44px]"
                  >
                    <PlusCircle className="w-4 h-4 text-slate-950" />
                    <span>Add Funds</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-emerald-400/15 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Usage: Membership purchases only</span>
                  <span className="text-emerald-300">Deposit Protected</span>
                </div>
              </div>
            </div>

            {/* CARD 2: TASK WALLET */}
            <div className="w-full shrink-0 p-0.5">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#064e3b]/85 via-[#043d2e]/90 to-[#022c22]/95 backdrop-blur-2xl border border-emerald-400/35 shadow-[0_20px_50px_rgba(1,26,20,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] p-6 sm:p-7 space-y-5 overflow-hidden">
                {/* Top specular sheen */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent pointer-events-none" 
                  aria-hidden="true" 
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.9)]" />
                      <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">
                        Task Wallet
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight tabular-nums text-white">
                      {formatNaira(availableBalance)}
                    </div>
                    <p className="text-xs text-slate-300 max-w-md pt-0.5">
                      Your approved task earnings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm border border-white/80 shadow-[0_10px_24px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all cursor-pointer shrink-0 min-h-[44px]"
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-900" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-emerald-400/15 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Pending Review: <strong className="font-mono text-white font-semibold">{formatNaira(pendingRewards)}</strong></span>
                  </div>
                  <span className="text-emerald-300">Min. Withdrawal: ₦5,000.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
          Quick Actions
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Tasks */}
          <button
            type="button"
            onClick={() => setCurrentScreen('tasks')}
            className="p-4 rounded-2xl bg-[#064e3b]/35 hover:bg-[#064e3b]/55 backdrop-blur-xl border border-emerald-400/20 hover:border-emerald-400/40 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[105px]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">Tasks</span>
              <span className="text-[11px] text-slate-300">Browse & earn</span>
            </div>
          </button>

          {/* Action 2: Buy Airtime */}
          <button
            type="button"
            onClick={() =>
              setShowQuickActionModal({
                open: true,
                title: 'Airtime Top-Up',
                description: 'Instant mobile recharge for MTN, Airtel, Glo, and 9mobile.',
                serviceName: 'Buy Airtime',
              })
            }
            className="p-4 rounded-2xl bg-[#064e3b]/35 hover:bg-[#064e3b]/55 backdrop-blur-xl border border-emerald-400/20 hover:border-emerald-400/40 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[105px]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">Buy Airtime</span>
              <span className="text-[11px] text-emerald-300/80">Coming Soon</span>
            </div>
          </button>

          {/* Action 3: Buy Data */}
          <button
            type="button"
            onClick={() =>
              setShowQuickActionModal({
                open: true,
                title: 'Data Bundles',
                description: 'Direct data subscriptions for all Nigerian telecom networks.',
                serviceName: 'Buy Data',
              })
            }
            className="p-4 rounded-2xl bg-[#064e3b]/35 hover:bg-[#064e3b]/55 backdrop-blur-xl border border-emerald-400/20 hover:border-emerald-400/40 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[105px]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <Wifi className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">Buy Data</span>
              <span className="text-[11px] text-emerald-300/80">Coming Soon</span>
            </div>
          </button>

          {/* Action 4: Send to Someone */}
          <button
            type="button"
            onClick={() =>
              setShowQuickActionModal({
                open: true,
                title: 'Transfer to Member',
                description: 'Peer-to-peer balance transfer between registered NARIVO accounts.',
                serviceName: 'Send to Someone',
              })
            }
            className="p-4 rounded-2xl bg-[#064e3b]/35 hover:bg-[#064e3b]/55 backdrop-blur-xl border border-emerald-400/20 hover:border-emerald-400/40 text-left transition-all active:scale-[0.98] cursor-pointer group flex flex-col justify-between min-h-[105px]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">Send to Someone</span>
              <span className="text-[11px] text-emerald-300/80">Coming Soon</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. ACCOUNT OVERVIEW (EXACTLY 3 SUMMARY CARDS) */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
          Account Overview
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Approved Tasks */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-semibold">Approved Tasks</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white tabular-nums">
              {completedTasksCount}
            </div>
            <p className="text-[11px] text-slate-300">
              Verified sponsor tasks completed
            </p>
          </div>

          {/* Card 2: Pending Task Reviews */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-semibold">Pending Task Reviews</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white tabular-nums">
              {pendingSubmissionsCount}
            </div>
            <p className="text-[11px] text-slate-300">
              Submitted proofs awaiting review
            </p>
          </div>

          {/* Card 3: Total Approved Earnings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-semibold">Total Approved Earnings</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white tabular-nums">
              {formatNaira(lifetimeEarned)}
            </div>
            <p className="text-[11px] text-slate-300">
              Lifetime verified credits in ledger
            </p>
          </div>
        </div>
      </div>

      {/* 5. AVAILABLE SPONSORED TASKS PREVIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Available Campaigns
          </span>
          <button
            type="button"
            onClick={() => setCurrentScreen('tasks')}
            className="text-xs font-bold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#064e3b]/25 backdrop-blur-xl border border-emerald-400/20 text-center space-y-2">
            <p className="text-xs text-slate-300">
              There are currently no active sponsored tasks in the directory.
            </p>
            <p className="text-[11px] text-slate-400">
              Advertiser campaigns will appear here when new campaigns launch.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-[#064e3b]/35 hover:bg-[#064e3b]/50 backdrop-blur-xl border border-emerald-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-semibold">
                    <span>{task.sponsorName}</span>
                    <span className="text-emerald-400/30">·</span>
                    <span className="text-slate-300">Est. {task.estimatedMinutes} mins</span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">
                    {task.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-emerald-300 text-sm">
                    {formatNaira(task.rewardNaira)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('tasks')}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    View Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD FUNDS TO MAIN WALLET */}
      <Modal
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        title="Fund Main Wallet"
        description="Add funds to your Main Wallet for membership plan purchases."
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 text-xs text-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <Info className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Main Wallet Purpose</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Main Wallet funds are strictly allocated for membership purchases and platform subscription renewals. Funds in this wallet cannot be withdrawn as cash.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-white block">Official Payment Methods</span>
            
            <div className="p-4 rounded-2xl bg-black/35 border border-emerald-400/20 space-y-2">
              <span className="text-xs font-bold text-emerald-300 block">Bank Transfer (NUBAN)</span>
              <div className="text-xs space-y-1 text-slate-300">
                <p>Bank: <strong className="text-white">Providus Bank</strong></p>
                <p>Account Name: <strong className="text-white">NARIVO Digital Technologies</strong></p>
                <p>Account Number: <strong className="font-mono text-emerald-300 text-sm font-bold tracking-wider">9948210452</strong></p>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-white/10">
                Include your Member ID (<strong className="text-white font-mono">{user?.id ? user.id.slice(0, 8) : 'NARIVO'}</strong>) in transfer narrative for auto-reconciliation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>Debit Card Gateway (Paystack)</span>
              <span className="text-[11px] text-emerald-300 font-semibold">Active in Membership Checkout</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() => {
                setShowAddFundsModal(false);
                setCurrentScreen('membership');
              }}
            >
              Browse Membership Plans
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: WITHDRAW FROM TASK WALLET */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw from Task Wallet"
        description="Transfer your approved earnings to your verified Nigerian commercial bank."
        size="md"
      >
        <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
          {withdrawError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{withdrawError}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-black/30 border border-emerald-400/20 text-xs flex items-center justify-between">
            <span className="text-slate-300">Task Wallet Balance:</span>
            <span className="font-mono font-bold text-emerald-300 text-sm">{formatNaira(availableBalance)}</span>
          </div>

          <Input
            label="Withdrawal Amount (₦)"
            type="number"
            min={5000}
            step={500}
            required
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            helperText="Minimum payout standard: ₦5,000.00."
          />

          <Input
            label="10-Digit NUBAN Account Number"
            type="text"
            required
            maxLength={10}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="0123456789"
          />

          <Input
            label="Account Holder Legal Name"
            type="text"
            required
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Must match bank records"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Destination Commercial Bank</label>
            <input
              type="text"
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-emerald-400/25 text-xs text-white outline-none focus:border-emerald-400"
              placeholder="e.g. Access Bank, GTBank, Zenith Bank"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowWithdrawModal(false)}
              className="flex-1 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isWithdrawing || availableBalance < 5000}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isWithdrawing ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: COMING SOON QUICK ACTION MODAL */}
      <Modal
        isOpen={showQuickActionModal.open}
        onClose={() => setShowQuickActionModal({ open: false, title: '', description: '', serviceName: '' })}
        title={showQuickActionModal.title}
        description={showQuickActionModal.description}
        size="sm"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-bold text-white font-heading">
              {showQuickActionModal.serviceName} is Coming Soon
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Our direct telecom API integration is undergoing compliance testing with Nigerian providers. This feature will be enabled in an upcoming release.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              fullWidth
              size="sm"
              onClick={() => setShowQuickActionModal({ open: false, title: '', description: '', serviceName: '' })}
            >
              Close Notice
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
