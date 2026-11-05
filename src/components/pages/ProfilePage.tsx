/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { Input } from '../ui';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  LogOut, 
  CheckCircle2, 
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  Save,
  Tag
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    user, 
    dbProfile, 
    updateProfile, 
    logout, 
    resetPassword,
    isMembershipActive,
    showToast 
  } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails?.accountNumber || '');
  const [accountName, setAccountName] = useState(user?.bankDetails?.accountName || user?.fullName || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResettingPass, setIsResettingPass] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  usePageSeo({
    title: 'Profile Settings – NARIVO',
    description: 'Manage your verified NARIVO profile, Nigerian bank settlement details and security settings.',
    canonicalPath: '/profile',
  });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      if (user.bankDetails?.bankName) setBankName(user.bankDetails.bankName);
      if (user.bankDetails?.accountNumber) setAccountNumber(user.bankDetails.accountNumber);
      if (user.bankDetails?.accountName) setAccountName(user.bankDetails.accountName);
    }
  }, [user, dbProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile({
        fullName,
        phone,
        bankDetails: {
          bankName,
          bankCode: NIGERIAN_BANKS.find((b) => b.name === bankName)?.code || '058',
          accountNumber,
          accountName,
        },
      });
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsResettingPass(true);
    try {
      const res = await resetPassword(user.email);
      if (res.success) {
        showToast('Password recovery email sent! Check your inbox.');
      } else {
        showToast(res.error || 'Failed to dispatch password recovery link.');
      }
    } finally {
      setIsResettingPass(false);
    }
  };

  const handleCopyReferralCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopiedCode(true);
    showToast('Referral code copied to clipboard.');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'N';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/20">
        <div>
          <span className="text-xs font-semibold text-emerald-300 block">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Profile & Security
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Update personal legal identity, configure verified NUBAN settlement banking, and manage authentication.
          </p>
        </div>

        <button
          onClick={logout}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
          title="Sign out of your NARIVO account"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 2. PROFILE HERO OVERVIEW CARD */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#064e3b]/70 via-[#043d2e]/80 to-[#022c22]/90 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_16px_40px_rgba(1,26,20,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(52,211,153,0.5)] ring-2 ring-white/20">
            {initials}
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
              {user?.fullName || 'NARIVO Member'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="font-mono text-emerald-300">{user?.email || 'Registered Member'}</span>
              <span className="text-emerald-400/40">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{isMembershipActive ? 'Active Premium' : 'Free Member'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Referral Code Chip */}
        {user?.referralCode && (
          <div className="p-3 rounded-2xl bg-black/40 border border-emerald-400/20 flex items-center justify-between gap-3 shrink-0">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Your Referral Code</span>
              <span className="font-mono font-bold text-white text-xs">{user.referralCode}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyReferralCode}
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-emerald-300 transition-colors cursor-pointer"
              title="Copy referral code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 3. PROFILE SETTINGS & BANKING FORM */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section A: Personal Information */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/25 space-y-4 shadow-[0_12px_36px_rgba(1,26,20,0.5)]">
          <div className="flex items-center gap-2 border-b border-emerald-400/15 pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Legal Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Justice Chidiebere"
              helperText="Must match your Nigerian bank account legal name."
              leftIcon={<User className="w-4 h-4 text-emerald-300/70" />}
            />

            <Input
              label="Mobile Phone Number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 801 234 5678"
              leftIcon={<Phone className="w-4 h-4 text-emerald-300/70" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Registered Email</label>
              <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-black/40 border border-emerald-400/15 text-xs text-slate-300 font-mono">
                <Mail className="w-4 h-4 text-emerald-400/60 shrink-0" />
                <span className="truncate">{user?.email || 'No email provided'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Invited By (Referral Sponsor)</label>
              <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-black/40 border border-emerald-400/15 text-xs text-slate-300 font-mono">
                <Tag className="w-4 h-4 text-emerald-400/60 shrink-0" />
                <span>{user?.referredBy || 'Direct Platform Registration'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: NUBAN Settlement Bank */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/25 space-y-4 shadow-[0_12px_36px_rgba(1,26,20,0.5)]">
          <div className="flex items-center gap-2 border-b border-emerald-400/15 pb-3">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              Settlement Bank Account (NUBAN)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-300">Commercial Bank</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-emerald-400/25 text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.name} className="bg-[#032a20] text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="10-Digit NUBAN Account Number"
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="0123456789"
              className="sm:col-span-1"
            />

            <Input
              label="Account Holder Name"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="As registered in bank"
              className="sm:col-span-1"
            />
          </div>
        </div>

        {/* Action Button & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {savedSuccess && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings saved successfully to database!</span>
            </div>
          )}

          <div className="flex items-center gap-3 sm:ml-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* 4. SECURITY & AUTHENTICATION SETTINGS */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/25 space-y-4 shadow-[0_12px_36px_rgba(1,26,20,0.5)]">
        <div className="flex items-center gap-2 border-b border-emerald-400/15 pb-3">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-heading">
            Account Security & Password
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">Change Password</span>
            <p className="text-xs text-slate-300">
              Receive a secure recovery email from Supabase to set a new password.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isResettingPass}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isResettingPass ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
