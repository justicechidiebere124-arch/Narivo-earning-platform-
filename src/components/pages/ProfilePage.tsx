/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { NIGERIAN_BANKS } from '../../data/sampleData';
import { Card, Input, Select, Button, Badge } from '../ui';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Building2, 
  LogOut, 
  CheckCircle2, 
  Save,
  KeyRound,
  Crown,
  CreditCard,
  AlertTriangle,
  ChevronRight
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

  usePageSeo({
    title: 'Account Settings – NARIVO',
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

  const bankOptions = NIGERIAN_BANKS.map(b => ({
    value: b.name,
    label: b.name,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">Account Governance</span>
            <span>·</span>
            <span>Profile & NUBAN Details</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your personal credentials, contact information, and bank settlement preferences.
          </p>
        </div>

        <Button
          onClick={logout}
          variant="danger"
          size="sm"
          className="self-start sm:self-auto"
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          Sign Out
        </Button>
      </div>

      {/* 2. Membership Status Overview Card */}
      <Card variant="default" className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
            {user?.fullName?.charAt(0).toUpperCase() || 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                {user?.fullName || 'NARIVO Member'}
              </h2>
              <Badge 
                variant={isMembershipActive ? 'emerald' : isMembershipExpired ? 'warning' : 'neutral'}
                size="sm"
              >
                {isMembershipActive ? (
                  <>
                    <Crown className="w-3 h-3" />
                    <span>Premium Member</span>
                  </>
                ) : isMembershipExpired ? (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>Premium (Expired)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3" />
                    <span>Registered Profile</span>
                  </>
                )}
              </Badge>
            </div>
            <span className="text-xs text-slate-400 font-mono block mt-0.5">
              {user?.email}
            </span>
          </div>
        </div>

        <Button
          onClick={() => setCurrentScreen('membership')}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto"
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          View Tier Details
        </Button>
      </Card>

      {/* 3. Main Form: Profile & Bank Details */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <Card variant="elevated" className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
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
              helperText="Synchronized directly with public.profiles.full_name."
            />

            <Input
              label="Email Address (Primary Auth)"
              type="email"
              disabled
              value={user?.email || ''}
              helperText="Managed by Supabase Auth security."
              className="font-mono cursor-not-allowed opacity-70"
            />

            <div className="sm:col-span-2">
              <Input
                label="Mobile Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                helperText="Synchronized with public.profiles.phone_number."
              />
            </div>
          </div>
        </Card>

        {/* Bank Settlement Details */}
        <Card variant="elevated" className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-heading">
              NUBAN Settlement Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Destination Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              options={bankOptions}
            />

            <Input
              label="10-Digit Account Number"
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="0123456789"
              className="font-mono"
            />

            <Input
              label="Account Holder Name"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value.toUpperCase())}
              placeholder="JUSTICE CHIDIEBERE"
              className="uppercase"
            />
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {savedSuccess ? (
            <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings synchronized successfully.</span>
            </div>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>

      {/* 4. Security & Authentication Section */}
      <Card variant="elevated" className="p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-heading">
            Security & Password Management
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-white block">Account Password</span>
            <p className="text-slate-400 text-[11px]">
              Send a secure password reset link to your registered email address.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePasswordReset}
            isLoading={isResettingPass}
            className="self-start sm:self-auto shrink-0"
          >
            {isResettingPass ? 'Sending...' : 'Request Password Reset'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
