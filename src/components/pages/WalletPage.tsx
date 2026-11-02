/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { simulateAccountResolution } from '../../lib/paystack';
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Hash, 
  HelpCircle,
  Filter,
  Info,
  Check,
  Send,
  Lock
} from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const WalletPage: React.FC = () => {
  const { 
    user, 
    availableBalance, 
    pendingRewards, 
    totalWithdrawn, 
    lifetimeEarned, 
    transactions, 
    withdrawalRequests,
    requestWithdrawal,
    isDemoAccount,
    showToast 
  } = useApp();

  // Withdrawal Form State
  const [amount, setAmount] = useState<number>(5000);
  const [selectedBank, setSelectedBank] = useState<string>(user?.bankDetails.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState<string>(user?.bankDetails.accountNumber || '0248819284');
  const [accountName, setAccountName] = useState<string>(user?.bankDetails.accountName || 'JUSTICE CHIDIEBERE OKOYE');
  const [isResolvingName, setIsResolvingName] = useState<boolean>(false);
  const [resolvedSuccess, setResolvedSuccess] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // History Filter
  const [filterType, setFilterType] = useState<'all' | 'reward' | 'withdrawal' | 'referral_bonus'>('all');

  // Trigger simulated account resolution when 10 digits entered
  useEffect(() => {
    if (accountNumber.length === 10) {
      setIsResolvingName(true);
      simulateAccountResolution(accountNumber, selectedBank).then((res) => {
        setIsResolvingName(false);
        if (res.success && res.accountName) {
          setAccountName(res.accountName);
          setResolvedSuccess(true);
          setFormError(null);
        } else {
          setResolvedSuccess(false);
          setFormError(res.error || 'Failed to resolve account');
        }
      });
    } else {
      setResolvedSuccess(false);
    }
  }, [accountNumber, selectedBank]);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (amount < 5000) {
      setFormError('Minimum withdrawal preference is ₦5,000 as per platform policy.');
      return;
    }
    if (amount > availableBalance) {
      setFormError(`Insufficient available balance. You currently have ${formatNaira(availableBalance)} available.`);
      return;
    }
    if (!accountNumber || accountNumber.length !== 10) {
      setFormError('Please enter a valid 10-digit Nigerian NUBAN account number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = requestWithdrawal(amount, selectedBank, accountNumber, accountName);
      setIsSubmitting(false);
      if (!res.success) {
        setFormError(res.message);
      } else {
        setAmount(5000);
      }
    }, 450);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Page Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span className="text-emerald-400 font-semibold">Treasury & Settlement</span>
          <span>·</span>
          <span>Nigerian Bank NUBAN Settlement (Demo)</span>
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
          Wallet & Bank Withdrawals
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review verified earnings, track pending sponsor verifications, and simulate automated payouts to your Nigerian bank.
        </p>
      </div>

      {/* 2. Wallet Balances Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Available Balance (Signature Glow) */}
        <div className="glass-panel-emerald rounded-3xl p-6 glow-emerald space-y-3 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold uppercase tracking-wider font-heading">
            <span>Available For Withdrawal</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight tabular-nums text-white">
            {formatNaira(availableBalance)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-200/90 pt-1">
            <span>Minimum payout: ₦5,000</span>
            {isDemoAccount && (
              <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
                DEMO DATA
              </span>
            )}
          </div>
        </div>

        {/* Pending Rewards */}
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider font-heading">
            <span>Pending Advertiser Audit</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight tabular-nums">
            {formatNaira(pendingRewards)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Unlocks upon sponsor confirmation
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider font-heading">
            <span>Total Withdrawn (Simulated)</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight tabular-nums">
            {formatNaira(totalWithdrawn)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Simulated test payouts in sandbox
          </div>
        </div>

        {/* Total Approved Lifetime */}
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider font-heading">
            <span>Total Approved Earnings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight tabular-nums">
            {formatNaira(lifetimeEarned)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Cumulative verified ledger
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Withdrawal Form & Bank Settlement Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Withdrawal Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Request Bank Transfer
              </h2>
              <p className="text-xs text-slate-400">
                Simulated NUBAN payout interface. Minimum ₦5,000 threshold strictly enforced.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Available</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {formatNaira(availableBalance)}
              </span>
            </div>
          </div>

          {/* Min Withdrawal Threshold Pill */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">
                Minimum Withdrawal Preference: ₦5,000
              </strong>
              <span className="text-slate-400 leading-relaxed">
                Platform transfers start at ₦5,000. This threshold eliminates micro-deductions and ensures members receive their full approved task rewards.
              </span>
            </div>
          </div>

          {formError && (
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleWithdrawalSubmit} className="space-y-5">
            {/* Amount Input with Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Withdrawal Amount (₦)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAmount(5000)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] cursor-pointer font-medium"
                  >
                    ₦5,000 Min
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(10000)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] cursor-pointer font-medium"
                  >
                    ₦10,000
                  </button>
                  {availableBalance >= 5000 && (
                    <button
                      type="button"
                      onClick={() => setAmount(Math.floor(availableBalance))}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-pointer font-medium"
                    >
                      Max Available
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-base">
                  ₦
                </span>
                <input
                  type="number"
                  min="5000"
                  step="500"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                  placeholder="5000"
                  required
                />
              </div>
            </div>

            {/* Bank Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Settlement Bank
              </label>
              <div className="relative">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs focus:outline-none focus:border-emerald-500 appearance-none transition-all cursor-pointer"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b.code} value={b.name} className="bg-[#0c131a] text-white">
                      {b.name}
                    </option>
                  ))}
                </select>
                <Building2 className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Account Number with Verification */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  10-Digit NUBAN Account Number
                </label>
                {isResolvingName ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Resolving NUBAN...</span>
                  </span>
                ) : resolvedSuccess ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Name Verified</span>
                  </span>
                ) : null}
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="0123456789"
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white font-mono text-sm tracking-wider focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                  required
                />
              </div>
            </div>

            {/* Resolved Beneficiary Name */}
            {accountName && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">
                    Verified Recipient Name
                  </span>
                  <span className="font-bold text-white tracking-wide">
                    {accountName}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Submit Withdrawal Button */}
            <button
              type="submit"
              disabled={isSubmitting || amount > availableBalance || amount < 5000}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isSubmitting || amount > availableBalance || amount < 5000
                  ? 'bg-white/[0.06] text-slate-500 border border-white/[0.06] cursor-not-allowed'
                  : 'btn-emerald-primary text-white'
              }`}
            >
              {isSubmitting ? (
                <span>Simulating Settlement Pipeline...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Bank Transfer of {formatNaira(amount)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Settlement Standards & Pending Batches */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Payout Requests Queue */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Pending & Recent Withdrawal Batches</span>
            </h3>

            {withdrawalRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent withdrawal requests recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black font-mono text-white">
                        {formatNaira(req.amountNaira)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {req.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">{req.bankName}</span>
                      <span className="font-mono text-slate-500">{req.accountNumber}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-white/[0.05]">
                      <span>Ref: {req.reference}</span>
                      <span>{req.requestedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settlement Security Guarantee */}
          <div className="glass-panel rounded-3xl p-6 space-y-3 border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-heading">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Nigerian Interbank Settlement & NUBAN Standards</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All transfers are processed in Nigerian Naira via standard commercial interbank settlement channels. Withdrawals to valid personal checking and savings accounts require 10-digit NUBAN conformity.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Complete Wallet Transaction Ledger */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-lg font-bold text-white font-heading">
              Full Transaction History & Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Verified record of task approvals, referral bonuses, and payouts.
            </p>
          </div>

          {/* Ledger Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.07] text-xs shrink-0">
            {(['all', 'reward', 'withdrawal', 'referral_bonus'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`py-1 px-3 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 text-[10px] uppercase tracking-wider font-heading">
                <th className="pb-3 font-semibold">Transaction Reference</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions found in this category.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-mono text-slate-400 font-medium">
                      {tx.id}
                    </td>
                    <td className="py-3.5 text-white font-medium max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{tx.title}</span>
                        {(tx.isDemoData || isDemoAccount) && (
                          <span className="text-[9px] bg-amber-500/15 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/25 shrink-0">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 capitalize text-slate-400">
                      {tx.type.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {tx.date}
                    </td>
                    <td className={`py-3.5 text-right font-mono font-bold ${
                      tx.type === 'withdrawal' ? 'text-slate-300' : 'text-emerald-400'
                    }`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}
                      {formatNaira(tx.amountNaira)}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        tx.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
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
    </div>
  );
};
