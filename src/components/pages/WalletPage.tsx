/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { formatNaira } from '../../utils/formatters';
import { Card, Input, Modal, Button } from '../ui';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  RotateCw,
  Building2,
  CheckCircle2,
  PlusCircle,
  ArrowDownLeft,
  Info
} from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { 
    user, 
    availableBalance, 
    pendingRewards, 
    totalWithdrawn, 
    transactions, 
    withdrawalRequests,
    requestWithdrawal,
    walletLoading,
    walletError,
    refreshAllData,
    showToast,
    setCurrentScreen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'withdrawals' | 'ledger'>('withdrawals');

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [selectedBank, setSelectedBank] = useState<string>(user?.bankDetails.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState<string>(user?.bankDetails.accountNumber || '');
  const [accountName, setAccountName] = useState<string>(user?.bankDetails.accountName || user?.fullName || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Main Wallet balance from deposits
  const mainWalletBalance = transactions
    .filter((t) => t.type === 'deposit' || t.type === 'membership_funding')
    .reduce((sum, t) => sum + t.amountNaira, 0);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Wallet records synchronized with database.');
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (withdrawAmount < 5000) {
      setFormError('Minimum withdrawal amount is ₦5,000.00.');
      return;
    }
    if (withdrawAmount > availableBalance) {
      setFormError(`Insufficient Task Wallet balance. You currently have ${formatNaira(availableBalance)} available.`);
      return;
    }
    if (!accountNumber || accountNumber.replace(/\D/g, '').length !== 10) {
      setFormError('Please enter a valid 10-digit Nigerian NUBAN account number.');
      return;
    }
    if (!accountName.trim()) {
      setFormError('Please enter the verified account holder legal name.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmedWithdrawal = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await requestWithdrawal(withdrawAmount, selectedBank, accountNumber, accountName);
      if (!res.success) {
        setFormError(res.message);
      } else {
        setWithdrawAmount(5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/20">
        <div>
          <span className="text-xs font-semibold text-emerald-300 block">
            Financial Balance & Settlements
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Wallet & Withdrawals
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Separate balances for membership funding and verified task earnings, with NUBAN bank disbursements.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || walletLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-emerald-400/25 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Synchronize balances with database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || walletLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Sync Wallet</span>
        </button>
      </div>

      {walletError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Database query notice: {walletError}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. DUAL WALLET CARDS: CLEAR SEPARATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: MAIN WALLET */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#064e3b]/80 via-[#043d2e]/85 to-[#022c22]/90 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_16px_40px_rgba(1,26,20,0.7)] p-6 space-y-4 overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  Main Wallet
                </span>
              </div>
              <div className="text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                {formatNaira(mainWalletBalance)}
              </div>
              <p className="text-[11px] text-slate-300">
                Fund your wallet to purchase membership.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddFundsModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
              <span>Add Funds</span>
            </button>
          </div>

          <div className="pt-3 border-t border-emerald-400/15 flex items-center justify-between text-[11px] text-slate-300">
            <span>Non-withdrawable</span>
            <span className="text-emerald-300">Membership purchases only</span>
          </div>
        </div>

        {/* CARD 2: TASK WALLET */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#064e3b]/80 via-[#043d2e]/85 to-[#022c22]/90 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_16px_40px_rgba(1,26,20,0.7)] p-6 space-y-4 overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.9)]" />
                <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">
                  Task Wallet
                </span>
              </div>
              <div className="text-3xl font-black font-mono text-white tabular-nums tracking-tight">
                {formatNaira(availableBalance)}
              </div>
              <p className="text-[11px] text-slate-300">
                Your approved task earnings.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-300 block font-semibold">Min. Payout</span>
              <span className="font-mono text-xs font-bold text-white">₦5,000.00</span>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-400/15 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-300 shrink-0" />
              <span>Pending Review: <strong className="font-mono text-white">{formatNaira(pendingRewards)}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              <span>NUBAN Settlement</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. WITHDRAWAL REQUEST FORM (TASK WALLET ONLY) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/25 space-y-5 shadow-[0_12px_36px_rgba(1,26,20,0.5)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Bank Withdrawal Request
            </span>
            <span className="text-emerald-400/30">·</span>
            <span className="text-xs text-slate-300">From Task Wallet</span>
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            Request Commercial Bank Transfer
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Withdrawals are processed directly from your verified Task Wallet balance to your registered Nigerian NUBAN bank account. Requests are reviewed and disbursed manually.
          </p>
        </div>

        <form onSubmit={handleOpenConfirm} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
              <span className="text-xs">{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Withdrawal Amount (₦)"
              type="number"
              min={5000}
              max={availableBalance > 0 ? availableBalance : 5000}
              step={500}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              helperText={`Available: ${formatNaira(availableBalance)} (Minimum ₦5,000.00)`}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Destination Commercial Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-emerald-400/25 text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.name} className="bg-[#032a20] text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="10-Digit NUBAN Account Number"
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="0123456789"
              required
            />

            <Input
              label="Account Holder Legal Name"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="As registered with your bank"
              required
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>NUBAN transfers processed via manual audit.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || availableBalance < 5000}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              <ArrowUpRight className="w-4 h-4 text-slate-950" />
              <span>Request Withdrawal</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. TRANSACTION HISTORY & WITHDRAWAL REQUESTS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Activity History
          </span>

          {/* Segmented Controls */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-emerald-400/20 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('withdrawals')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'withdrawals'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Withdrawals ({withdrawalRequests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Ledger Transactions ({transactions.length})
            </button>
          </div>
        </div>

        {activeTab === 'withdrawals' ? (
          withdrawalRequests.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#064e3b]/25 backdrop-blur-xl border border-emerald-400/20 text-center space-y-2">
              <Building2 className="w-8 h-8 text-emerald-400/60 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Withdrawal Requests Yet</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                When you request a bank payout from your Task Wallet, the request history and review status will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {withdrawalRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{req.bankName}</span>
                      <span className="text-emerald-400/40">·</span>
                      <span className="text-[11px] text-slate-300 font-mono">{req.accountNumber}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{req.requestedAt}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-mono font-bold text-white text-sm">
                      {formatNaira(req.amountNaira)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      req.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : req.status === 'rejected' || req.status === 'failed'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          transactions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#064e3b]/25 backdrop-blur-xl border border-emerald-400/20 text-center space-y-2">
              <Wallet className="w-8 h-8 text-emerald-400/60 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Ledger Entries Yet</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Completed task rewards and referral bonuses will be recorded in your permanent financial ledger.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">{tx.title}</h4>
                    <p className="text-[11px] text-slate-400">{tx.date}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-mono font-bold text-emerald-300 text-sm">
                      +{formatNaira(tx.amountNaira)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Credited
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* MODAL 1: ADD FUNDS TO MAIN WALLET */}
      <Modal
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        title="Fund Main Wallet"
        description="Transfer funds to your Main Wallet for membership purchases."
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/25 text-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Main Wallet Purpose</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Main Wallet funds are used exclusively for purchasing membership tiers and platform renewals. Funds in this wallet cannot be cashed out or withdrawn.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-400/20 space-y-2">
            <span className="font-bold text-emerald-300 block">Bank Transfer (NUBAN)</span>
            <div className="space-y-1 text-slate-300">
              <p>Bank: <strong className="text-white">Providus Bank</strong></p>
              <p>Account Name: <strong className="text-white">NARIVO Digital Technologies</strong></p>
              <p>Account Number: <strong className="font-mono text-emerald-300 text-sm font-bold tracking-wider">9948210452</strong></p>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-white/10">
              Include your member reference (<strong className="text-white font-mono">{user?.id ? user.id.slice(0, 8) : 'NARIVO'}</strong>) in the payment narration.
            </p>
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

      {/* MODAL 2: CONFIRM WITHDRAWAL */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Bank Withdrawal"
        description="Verify destination account details before confirming transfer."
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-400/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Amount:</span>
              <span className="font-mono font-bold text-emerald-300 text-sm">{formatNaira(withdrawAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Bank:</span>
              <span className="font-bold text-white">{selectedBank}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Account:</span>
              <span className="font-mono text-white">{accountNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Name:</span>
              <span className="font-bold text-white">{accountName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Edit Details
            </button>
            <button
              type="button"
              onClick={handleConfirmedWithdrawal}
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Request'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
