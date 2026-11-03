/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Building2, 
  RotateCw, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Save,
  KeyRound,
  Crown,
  Wallet
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    user, 
    dbProfile, 
    updateProfile, 
    logout, 
    resetPassword,
    isMembershipActive,
    isMembershipExpired,
    setCurrentScreen,
    showToast 
  } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bankName, setBankName] = useState(user?.bankDetails.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails.accountNumber || '');
  const [accountName, setAccountName] = useState(user?.bankDetails.accountName || user?.fullName || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResettingPass, setIsResettingPass] = useState(false);

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
          bankCode: NIGERIAN_BANKS.find(b => b.name === bankName)?.code || '058',
          accountNumber,
          accountName,
        }
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
        showToast('Password reset email sent to your inbox.');
      } else {
        showToast(res.error || 'Failed to send reset link.');
      }
    } finally {
      setIsResettingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">Account Governance</span>
            <span>·</span>
            <span>Supabase Profile & NUBAN Details</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your personal credentials, contact information, and bank settlement preferences.
          </p>
        </div>

        <button
          onClick={logout}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* 2. Membership Status Callout */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white font-black text-xl flex items-center justify-center shadow-md">
            {user?.fullName?.charAt(0).toUpperCase() || 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {user?.fullName || 'NARIVO Member'}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                isMembershipActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : isMembershipExpired
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-white/[0.05] text-slate-400 border-white/[0.1]'
              }`}>
                {isMembershipActive ? 'Premium Member' : isMembershipExpired ? 'Premium (Expired)' : 'Registered Profile'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {user?.email}
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('membership')}
          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer self-start sm:self-auto"
        >
          View Tier Details
        </button>
      </div>

      {/* 3. Main Form: Profile & Bank Details */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none"
              />
              <span className="text-[10px] text-slate-500 block">
                Synchronized directly with <code className="text-emerald-300 font-mono">public.profiles.full_name</code>.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Email Address <span className="text-slate-500 font-normal">(Primary Auth)</span>
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full h-11 px-3.5 rounded-xl bg-black/20 border border-white/[0.05] text-slate-400 text-xs outline-none cursor-not-allowed font-mono"
              />
              <span className="text-[10px] text-slate-500 block">
                Primary auth identifier managed by Supabase Auth.
              </span>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Mobile Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none"
              />
              <span className="text-[10px] text-slate-500 block">
                Synchronized with <code className="text-emerald-300 font-mono">public.profiles.phone_number</code>.
              </span>
            </div>
          </div>
        </div>

        {/* Bank Settlement Details */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>NUBAN Settlement Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Destination Bank
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs outline-none"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.name} className="bg-[#0b1016] text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                10-Digit Account Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="0123456789"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white font-mono text-xs outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                placeholder="JUSTICE CHIDIEBERE"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white text-xs uppercase outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {savedSuccess && (
            <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings synchronized successfully.</span>
            </div>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md active:scale-98 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 4. Security & Authentication Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>Security & Password Management</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-white block">Account Password</span>
            <p className="text-slate-400 text-[11px]">
              Send a secure password reset link to your verified email address.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isResettingPass}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white font-semibold text-xs border border-white/[0.08] transition-all cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            {isResettingPass ? 'Sending...' : 'Request Password Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
