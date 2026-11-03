/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Building2, 
  AlertCircle,
  RotateCw,
  Send,
  Lock,
  CheckCircle2,
  X
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const WalletPage: React.FC = () => {
  const { 
    user, 
    availableBalance, 
    pendingRewards, 
    reservedFunds,
    totalWithdrawn, 
    lifetimeEarned, 
    transactions, 
    withdrawalRequests,
    requestWithdrawal,
    walletLoading,
    walletError,
    refreshAllData,
    showToast 
  } = useApp();

  // Form State
  const [amount, setAmount] = useState<number>(5000);
  const [selectedBank, setSelectedBank] = useState<string>(user?.bankDetails.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState<string>(user?.bankDetails.accountNumber || '');
  const [accountName, setAccountName] = useState<string>(user?.bankDetails.accountName || user?.fullName || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Wallet records synchronized with Supabase.');
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (amount < 5000) {
      setFormError('Minimum withdrawal amount is ₦5,000.00.');
      return;
    }
    if (amount > availableBalance) {
      setFormError(`Insufficient available balance. You currently have ${formatNaira(availableBalance)} available.`);
      return;
    }
    if (!accountNumber || accountNumber.replace(/\D/g, '').length !== 10) {
      setFormError('Please enter a valid 10-digit Nigerian NUBAN account number.');
      return;
    }
    if (!accountName.trim()) {
      setFormError('Please enter the verified account holder name.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmedWithdrawal = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await requestWithdrawal(amount, selectedBank, accountNumber, accountName);
      if (!res.success) {
        setFormError(res.message);
      } else {
        setAmount(5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">Financial Ledger</span>
            <span>·</span>
            <span>Supabase Verified Source of Truth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Wallet & Withdrawals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Review your approved earnings, track pending campaign audits, and request bank settlements.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || walletLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Synchronize balances with Supabase"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || walletLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Sync Ledger</span>
        </button>
      </div>

      {walletError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Database query notice: {walletError}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Wallet Balances Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/40 shadow-lg space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold uppercase tracking-wider font-heading">
            <span>Available Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums text-white">
            {formatNaira(availableBalance)}
          </div>
          <p className="text-[10px] text-emerald-200/80">
            Available for bank transfer
          </p>
        </div>

        {/* Pending Rewards */}
        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider font-heading">
            <span>Pending Rewards</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums text-white">
            {formatNaira(pendingRewards)}
          </div>
          <p className="text-[10px] text-slate-500">
            Under sponsor audit window
          </p>
        </div>

        {/* Reserved Funds */}
        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider font-heading">
            <span>Reserved Funds</span>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums text-white">
            {formatNaira(reservedFunds)}
          </div>
          <p className="text-[10px] text-slate-500">
            Locked in pending payout requests
          </p>
        </div>

        {/* Total Earned */}
        <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider font-heading">
            <span>Cumulative Earned</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums text-white">
            {formatNaira(lifetimeEarned)}
          </div>
          <p className="text-[10px] text-slate-500">
            Total approved ledger rewards
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Withdrawal Request Form & Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Real Withdrawal Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 space-y-5 border border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Request Bank Settlement
              </h2>
              <p className="text-xs text-slate-400">
                Minimum ₦5,000.00. Processed via standard Nigerian interbank transfer.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Available</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400">
                {formatNaira(availableBalance)}
              </span>
            </div>
          </div>

          {formError && (
            <div className="p-3.5 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleOpenConfirm} className="space-y-4">
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Withdrawal Amount (₦)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={5000}
                  step={500}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-11 pl-4 pr-16 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white font-mono text-sm outline-none"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-slate-500 font-bold font-mono">
                  NGN
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Minimum withdrawal threshold is ₦5,000.00.
              </span>
            </div>

            {/* Bank Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Destination Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.name} className="bg-[#0b1016] text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                10-Digit NUBAN Account Number
              </label>
              <input
                type="text"
                maxLength={10}
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="0123456789"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white font-mono text-xs outline-none"
              />
            </div>

            {/* Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Verified Account Holder Name
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                placeholder="JUSTICE CHIDIEBERE"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs uppercase outline-none"
              />
              <span className="text-[10px] text-slate-500 block">
                Must match your registered full legal name.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || availableBalance < 5000}
              className="w-full h-12 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Bank Settlement ({formatNaira(amount)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Payout Batches from Database */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3.5 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Withdrawal Queue & History</span>
            </h3>

            {withdrawalRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-400">No withdrawal requests recorded yet.</p>
                <p className="text-[11px] text-slate-500">
                  When you submit a request, your payout status will track here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {withdrawalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-white">
                        {formatNaira(req.amountNaira)}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border ${
                        req.status === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : req.status === 'rejected' || req.status === 'failed'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">{req.bankName}</span>
                      <span className="font-mono text-slate-500">{req.accountNumber}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-white/[0.04]">
                      <span>{req.requestedAt}</span>
                      <span>Manual Admin Review</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Policy Disclosure */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Settlement Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Withdrawals reserve funds atomically from your available balance. Administrators review and transfer funds directly to your verified commercial bank account.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Complete Wallet Transaction Ledger (Financial Source of Truth) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4 border border-white/[0.08]">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Wallet Transaction Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Verified record of credits, debits, and reservations from <code className="text-emerald-300 font-mono text-[11px]">public.wallet_ledger</code>.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 text-[10px] uppercase tracking-wider font-heading">
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    <p className="font-semibold text-slate-400">No transactions yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Approved task earnings and settlement debits will be listed here.
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-white font-medium max-w-xs truncate">
                      {tx.title}
                    </td>
                    <td className="py-3 capitalize text-slate-400">
                      {tx.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 text-slate-400">
                      {tx.date}
                    </td>
                    <td className={`py-3 text-right font-mono font-bold ${
                      tx.type === 'withdrawal' ? 'text-slate-300' : 'text-emerald-400'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}
                      {formatNaira(tx.amountNaira)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Financial Action Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl max-w-sm w-full p-6 border border-white/[0.12] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white font-heading">
                Confirm Bank Settlement
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Transfer Amount</span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  {formatNaira(amount)}
                </span>
              </div>

              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-semibold text-white">{selectedBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="font-mono text-white">{accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Name:</span>
                  <span className="font-semibold text-white uppercase">{accountName}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Funds will be atomically reserved from your balance and queued for administrator batch processing.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmedWithdrawal}
                className="flex-1 py-2.5 rounded-xl btn-emerald-primary text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
