/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { formatNaira } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  RotateCw,
  Send,
  Building2,
  FileText,
  CheckCircle2
} from 'lucide-react';

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
    showToast('Wallet records synchronized with database.');
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

  const bankOptions = NIGERIAN_BANKS.map((b) => ({
    label: b.name,
    value: b.name,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-semibold text-emerald-400 block">
            Financial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Wallet & Withdrawals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track approved rewards, manage your Naira balance, and request bank transfers to verified Nigerian accounts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || walletLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Synchronize balances with database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || walletLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Sync Ledger</span>
        </button>
      </div>

      {walletError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Database query notice: {walletError}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Wallet Balances Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance (Primary) */}
        <Card variant="balance" padding="md" className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <span>Available Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums text-white">
            {formatNaira(availableBalance)}
          </div>
          <p className="text-[11px] text-emerald-200/80">
            Available for bank transfer
          </p>
        </Card>

        {/* Pending Rewards */}
        <StatCard
          label="Pending Rewards"
          value={formatNaira(pendingRewards)}
          subtext="Under sponsor audit"
          icon={<Clock className="w-4 h-4 text-amber-400" />}
        />

        {/* Reserved Withdrawals */}
        <StatCard
          label="Reserved for Payout"
          value={formatNaira(reservedFunds)}
          subtext="In review queue"
          icon={<Building2 className="w-4 h-4 text-slate-400" />}
        />

        {/* Lifetime Approved */}
        <StatCard
          label="Total Withdrawn"
          value={formatNaira(totalWithdrawn)}
          subtext="Confirmed disbursements"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        />
      </div>

      {/* 3. Main Action Grid: Withdrawal Form & Payout Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Request Withdrawal Form */}
        <Card variant="standard" padding="lg" className="lg:col-span-7 space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Payout Request
              </span>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[11px] text-slate-400">Min: ₦5,000.00</span>
            </div>
            <h2 className="text-base font-bold text-white font-heading">
              Request Bank Transfer
            </h2>
            <p className="text-xs text-slate-400">
              Funds are reserved from your available balance and manually reviewed before commercial bank disbursement.
            </p>
          </div>

          <form onSubmit={handleOpenConfirm} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs">{formError}</span>
              </div>
            )}

            {/* Amount input */}
            <Input
              label="Withdrawal Amount (₦)"
              type="number"
              min={5000}
              max={availableBalance > 0 ? availableBalance : 5000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              helperText={`Available: ${formatNaira(availableBalance)} (Minimum ₦5,000.00)`}
              required
            />

            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              {[5000, 10000, 20000].map((quickAmt) => (
                <button
                  key={quickAmt}
                  type="button"
                  onClick={() => setAmount(quickAmt)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                    amount === quickAmt
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white'
                  }`}
                >
                  ₦{quickAmt.toLocaleString()}
                </button>
              ))}
              {availableBalance >= 5000 && (
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/[0.03] text-emerald-400 border border-white/[0.06] hover:border-emerald-500/30 cursor-pointer"
                >
                  Max All
                </button>
              )}
            </div>

            {/* Bank Select */}
            <Select
              label="Destination Nigerian Bank"
              options={bankOptions}
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              required
            />

            {/* 10-digit NUBAN */}
            <Input
              label="10-Digit NUBAN Account Number"
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="0123456789"
              helperText="Must be a valid 10-digit Nigerian commercial bank account."
              required
            />

            {/* Account Name */}
            <Input
              label="Account Holder Full Name"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Chinedu Okafor"
              helperText="Must match the registered legal name on your bank account."
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={isSubmitting || availableBalance < 5000}
              icon={<Send className="w-4 h-4" />}
            >
              Request Bank Transfer ({formatNaira(amount)})
            </Button>
          </form>
        </Card>

        {/* Right Column (5 cols): Payout Queue & Policies */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="standard" padding="md" className="space-y-3.5">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Withdrawal Queue & History</span>
            </h3>

            {withdrawalRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-400">No withdrawal requests recorded yet.</p>
                <p className="text-[11px] text-slate-500">
                  When you submit a payout request, tracking will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {withdrawalRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white">
                        {formatNaira(req.amountNaira)}
                      </span>
                      <Badge
                        variant={
                          req.status === 'paid' 
                            ? 'success' 
                            : req.status === 'rejected' || req.status === 'failed' 
                              ? 'danger' 
                              : 'warning'
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">{req.bankName}</span>
                      <span className="font-mono text-slate-500">{req.accountNumber}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-white/[0.04]">
                      <span>{req.requestedAt}</span>
                      <span>Manual Review</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Policy Disclosure */}
          <Card variant="standard" padding="md" className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Settlement Policy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Withdrawals reserve funds atomically from your available balance. Administrators review and transfer funds directly to your verified commercial bank account. Payment is confirmed only upon successful transfer.
            </p>
          </Card>
        </div>
      </div>

      {/* 4. Complete Wallet Transaction Ledger */}
      <Card variant="standard" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Wallet Transaction Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Verified record of credits, debits, and reservations from the database ledger.
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-5 h-5 text-slate-400" />}
            title="No transactions yet."
            description="Approved task rewards and settlement debits will be listed here chronologically."
          />
        ) : (
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
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-white">
                      {tx.title}
                    </td>
                    <td className="py-3 pr-4 text-slate-400 capitalize">
                      {tx.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                      {formatNaira(tx.amountNaira)}
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="success">
                        Approved
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Bank Withdrawal"
        subtitle="Review your disbursement details carefully"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmedWithdrawal}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Confirm & Submit
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.07] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Withdrawal Amount:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {formatNaira(amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Destination Bank:</span>
              <span className="text-white font-medium">{selectedBank}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Number:</span>
              <span className="font-mono text-white font-medium">{accountNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Holder:</span>
              <span className="text-white font-medium">{accountName}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            By confirming, {formatNaira(amount)} will be deducted from your Available Balance and placed into the administrative review queue.
          </p>
        </div>
      </Modal>
    </div>
  );
};
