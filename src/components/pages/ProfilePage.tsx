/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  Hash, 
  RotateCcw, 
  Bell, 
  KeyRound, 
  Check, 
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, dbProfile, updateProfile, resetDemoData, showToast, isDemoAccount } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [state, setState] = useState(user?.state || 'Lagos State');
  const [bankName, setBankName] = useState(user?.bankDetails.bankName || 'Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails.accountNumber || '0248819284');
  const [accountName, setAccountName] = useState(user?.bankDetails.accountName || 'JUSTICE CHIDIEBERE OKOYE');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if user or dbProfile updates
  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setState(user.state || 'Lagos State');
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
        state,
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

  const nigerianStates = [
    'Abia State', 'Adamawa State', 'Akwa Ibom State', 'Anambra State', 'Bauchi State',
    'Bayelsa State', 'Benue State', 'Borno State', 'Cross River State', 'Delta State',
    'Ebonyi State', 'Edo State', 'Ekiti State', 'Enugu State', 'Federal Capital Territory (FCT)',
    'Gombe State', 'Imo State', 'Jigawa State', 'Kaduna State', 'Kano State',
    'Katsina State', 'Kebbi State', 'Kogi State', 'Kwara State', 'Lagos State',
    'Nasarawa State', 'Niger State', 'Ogun State', 'Ondo State', 'Osun State',
    'Oyo State', 'Plateau State', 'Rivers State', 'Sokoto State', 'Taraba State',
    'Yobe State', 'Zamfara State'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span className="text-emerald-400 font-semibold">Account Governance</span>
          <span>·</span>
          <span>Security & Settlement Settings</span>
          {isDemoAccount && (
            <>
              <span>·</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                Demo Profile
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          Profile & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Maintain your verified contact information and 10-digit NUBAN Nigerian settlement account.
        </p>
      </div>

      {/* 2. Identity Glass Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white font-black text-2xl flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] shrink-0">
            {fullName ? fullName.charAt(0) : 'J'}
          </div>
          <div className="space-y-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white font-heading truncate">
              {fullName || user?.fullName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-bold">{user?.referralCode}</span>
              <span>·</span>
              <span>Member ID: {user?.id}</span>
              <span>·</span>
              <span>Joined {user?.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/25 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tier 1 KYC Verified</span>
          </span>
        </div>
      </div>

      {/* 3. Form Sections */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Policy Notice Box */}
        <div className="glass-panel p-5 rounded-3xl border border-white/[0.08] text-xs text-slate-300 space-y-1">
          <strong className="text-white block font-bold font-heading">
            Platform Registration & Membership Terms:
          </strong>
          <p className="text-slate-400 leading-relaxed">
            Member registration creates a profile row only with zero recurring fees. We have not configured pricing for the Premium tier; do not pay any party requesting subscription funds. The minimum withdrawal preference remains strictly ₦5,000.
          </p>
        </div>

        {/* Section A: Personal Information */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-white/[0.08]">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>Personal Identification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                Full Name (Must match bank recipient account name)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Email Address
                </label>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  readOnly
                  value={user?.email || ''}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-white/[0.06] text-slate-400 text-xs cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Phone Number (+234 format)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* State of Residence */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                State of Residence
              </label>
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs focus:outline-none focus:border-emerald-500 appearance-none transition-all cursor-pointer"
                >
                  {nigerianStates.map((st) => (
                    <option key={st} value={st} className="bg-[#0c131a] text-white">
                      {st}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Nigerian Bank Settlement Account */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-white/[0.08]">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Nigerian NUBAN Payout Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                Settlement Bank
              </label>
              <div className="relative">
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
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

            {/* Account Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                10-Digit NUBAN Account Number
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={10}
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white font-mono text-xs focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            </div>

            {/* Recipient Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Verified Recipient Account Name
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs uppercase focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section C: Notifications */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/[0.08]">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <span>Audit & Payout Notifications</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Email Task Audit Notifications</span>
                <span className="text-[11px] text-slate-400">Receive alerts when an advertiser approves or rejects task proof.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-pointer">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">SMS Payout Confirmation</span>
                <span className="text-[11px] text-slate-400">Receive simulated NIBSS transfer notification upon batch processing.</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
              />
            </label>
          </div>
        </div>

        {/* Save Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile & Bank Details Saved Successfully!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-emerald-primary text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-60"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving to Database...' : 'Save Profile & Settlement Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
