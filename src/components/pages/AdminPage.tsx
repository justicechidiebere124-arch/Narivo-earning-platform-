/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { supabase } from '../../lib/supabase';
import { formatNaira } from '../../utils/formatters';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Wallet, 
  CheckSquare, 
  Crown, 
  CreditCard, 
  Share2, 
  BookOpen, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
  Building,
  Key
} from 'lucide-react';

type AdminTab = 
  | 'overview' 
  | 'withdrawals' 
  | 'submissions' 
  | 'members' 
  | 'memberships' 
  | 'payments' 
  | 'tasks' 
  | 'referrals' 
  | 'ledger'
  | 'security';

export const AdminPage: React.FC = () => {
  const { 
    isAuthenticated, 
    authLoading, 
    isAdmin, 
    supabaseUser, 
    setCurrentScreen, 
    showToast 
  } = useApp();

  usePageSeo({
    title: 'Admin Console – NARIVO',
    description: 'Restricted NARIVO administration console for platform oversight and operations.',
    canonicalPath: '/admin',
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Live Database States
  const [profiles, setProfiles] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCodes, setReferralCodes] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);

  // Search & Filters
  const [memberSearch, setMemberSearch] = useState<string>('');
  const [withdrawalFilter, setWithdrawalFilter] = useState<string>('all');
  const [submissionFilter, setSubmissionFilter] = useState<string>('all');
  const [processingActionId, setProcessingActionId] = useState<string | null>(null);

  // Authorization check guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setCurrentScreen('login');
    }
  }, [authLoading, isAuthenticated, setCurrentScreen]);

  // Load Admin Data from real Supabase tables
  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setErrorNotice(null);

    try {
      // 1. Fetch Registered Profiles
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!profErr && profData) setProfiles(profData);

      // 2. Fetch Withdrawal Requests
      const { data: wdData, error: wdErr } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!wdErr && wdData) setWithdrawals(wdData);

      // 3. Fetch Task Submissions
      const { data: subData, error: subErr } = await supabase
        .from('task_submissions')
        .select('*, sponsored_tasks(*)')
        .order('created_at', { ascending: false });
      if (!subErr && subData) setSubmissions(subData);

      // 4. Fetch Membership Plans & Memberships
      const { data: planData } = await supabase
        .from('membership_plans')
        .select('*')
        .order('created_at', { ascending: true });
      if (planData) setPlans(planData);

      const { data: membData } = await supabase
        .from('memberships')
        .select('*, membership_plans(*)')
        .order('created_at', { ascending: false });
      if (membData) setMemberships(membData);

      // 5. Fetch Membership Payments
      const { data: payData } = await supabase
        .from('membership_payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (payData) setPayments(payData);

      // 6. Fetch Campaigns & Tasks
      const { data: campData } = await supabase
        .from('sponsored_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      if (campData) setCampaigns(campData);

      const { data: tData } = await supabase
        .from('sponsored_tasks')
        .select('*, sponsored_campaigns(*)')
        .order('created_at', { ascending: false });
      if (tData) setTasks(tData);

      // 7. Fetch Referrals & Codes
      const { data: refCodeData } = await supabase
        .from('referral_codes')
        .select('*')
        .order('created_at', { ascending: false });
      if (refCodeData) setReferralCodes(refCodeData);

      const { data: refData } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });
      if (refData) setReferrals(refData);

      // 8. Fetch Wallet Ledger
      const { data: lData } = await supabase
        .from('wallet_ledger')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (lData) setLedgerEntries(lData);

    } catch (err: any) {
      console.warn('Admin data load exception:', err);
      setErrorNotice(err?.message || 'Error querying database under admin session.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin, loadAdminData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    showToast('Admin data refreshed from Supabase.');
  };

  // Admin Actions: Update Withdrawal Request Status
  const handleUpdateWithdrawalStatus = async (id: string, newStatus: 'paid' | 'approved' | 'rejected') => {
    setProcessingActionId(id);
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        showToast(`Action failed: ${error.message}`);
      } else {
        showToast(`Withdrawal status updated to ${newStatus}.`);
        setWithdrawals((prev) => 
          prev.map((w) => w.id === id ? { ...w, status: newStatus, updated_at: new Date().toISOString() } : w)
        );
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Update failed'}`);
    } finally {
      setProcessingActionId(null);
    }
  };

  // Admin Actions: Update Task Submission Review Status
  const handleUpdateSubmissionStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessingActionId(id);
    try {
      const { error } = await supabase
        .from('task_submissions')
        .update({ 
          status: newStatus, 
          reviewed_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        showToast(`Action failed: ${error.message}`);
      } else {
        showToast(`Submission marked as ${newStatus}.`);
        setSubmissions((prev) => 
          prev.map((s) => s.id === id ? { ...s, status: newStatus, reviewed_at: new Date().toISOString() } : s)
        );
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Update failed'}`);
    } finally {
      setProcessingActionId(null);
    }
  };

  // 1. Loading Authorization State
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#01140e] text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mb-4">
          <RotateCw className="w-7 h-7 text-emerald-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold font-heading text-white">Verifying Authorization</h2>
        <p className="text-xs text-slate-400 mt-1">Checking cryptographically signed JWT app_metadata claims...</p>
      </div>
    );
  }

  // 2. Access Denied State (Not an admin)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#01140e] text-slate-100 selection:bg-rose-500/30">
        <div className="w-full max-w-md rounded-3xl bg-[#062c20]/75 backdrop-blur-2xl border border-rose-500/30 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-mono font-bold uppercase tracking-wider">
              HTTP 403 Forbidden
            </span>
            <h1 className="text-2xl font-black text-white font-heading">
              Administrator Privilege Required
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              This console is restricted strictly to authorized platform administrators. Your authenticated account (
              <strong className="text-white font-mono break-all">{supabaseUser?.email || 'authenticated user'}</strong>
              ) does not possess trusted administrative credentials (<code className="text-rose-300 text-[11px] font-mono">app_metadata.role !== 'admin'</code>).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left space-y-1 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Authorization Policy</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Narivo enforces role-based access control via trusted Supabase JWT app_metadata and database Row Level Security.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setCurrentScreen('dashboard')}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Member Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('landing')}
              className="flex-1 h-11 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Public Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculated Metrics from live Supabase rows
  const totalMembers = profiles.length;
  const pendingWdCount = withdrawals.filter((w) => w.status === 'pending').length;
  const pendingWdVolumeKobo = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + (w.amount_kobo || 0), 0);
  const paidWdVolumeKobo = withdrawals
    .filter((w) => w.status === 'paid' || w.status === 'approved')
    .reduce((sum, w) => sum + (w.amount_kobo || 0), 0);
  const pendingSubCount = submissions.filter((s) => s.status === 'pending_review').length;
  const approvedSubCount = submissions.filter((s) => s.status === 'approved').length;
  const successfulPayCount = payments.filter((p) => p.status === 'successful').length;
  const totalPayVolumeKobo = payments
    .filter((p) => p.status === 'successful')
    .reduce((sum, p) => sum + (p.amount_kobo || 0), 0);

  // Filtered Lists
  const filteredWithdrawals = withdrawals.filter((w) => {
    if (withdrawalFilter === 'all') return true;
    return w.status === withdrawalFilter;
  });

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'all') return true;
    return s.status === submissionFilter;
  });

  const filteredMembers = profiles.filter((p) => {
    if (!memberSearch.trim()) return true;
    const q = memberSearch.toLowerCase();
    return (
      (p.full_name && p.full_name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone_number && p.phone_number.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#01140e] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. Admin Top Console Bar */}
      <header className="sticky top-0 z-40 bg-[#02241b]/95 backdrop-blur-2xl border-b border-emerald-400/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white font-heading">
                  NARIVO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {supabaseUser?.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="h-9 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh database records"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing || loading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentScreen('dashboard')}
              className="h-9 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Member Portal</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'withdrawals'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Withdrawals</span>
            {pendingWdCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                {pendingWdCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'submissions'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task Reviews</span>
            {pendingSubCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black">
                {pendingSubCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members ({totalMembers})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memberships')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'memberships'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Memberships</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payments'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campaigns & Tasks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Referrals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Wallet Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>RLS & Security</span>
          </button>
        </div>
      </header>

      {/* 2. Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {errorNotice && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="text-white underline font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white font-heading tracking-tight">
                Platform Overview
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time operational summary computed from live Supabase tables.
              </p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#04281f]/70 border border-emerald-400/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Registered Members</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{totalMembers}</div>
                <span className="text-[10px] text-emerald-300 block">Profiles in public.profiles</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#04281f]/70 border border-amber-400/25 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pending Withdrawals</span>
                  <Wallet className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {pendingWdCount} <span className="text-xs text-slate-400">({formatNaira(pendingWdVolumeKobo / 100)})</span>
                </div>
                <span className="text-[10px] text-amber-300/80 block">Awaiting compliance disbursement</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#04281f]/70 border border-emerald-400/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pending Task Reviews</span>
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{pendingSubCount}</div>
                <span className="text-[10px] text-emerald-300 block">{approvedSubCount} approved to date</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#04281f]/70 border border-emerald-400/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Completed Payouts</span>
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-teal-300 font-mono">
                  {formatNaira(paidWdVolumeKobo / 100)}
                </div>
                <span className="text-[10px] text-slate-400 block">Total disbursed via NUBAN</span>
              </div>
            </div>

            {/* Quick Action Tables for Pending Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Withdrawals Quick List */}
              <div className="p-6 rounded-3xl bg-[#03241b]/60 border border-amber-400/25 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white font-heading">
                      Pending Withdrawal Queue
                    </h2>
                    <p className="text-[11px] text-slate-400">Requires manual commercial bank transfer</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('withdrawals')}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {withdrawals.filter((w) => w.status === 'pending').length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No pending withdrawal requests in the queue.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {withdrawals.filter((w) => w.status === 'pending').slice(0, 4).map((w) => (
                      <div key={w.id} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white font-mono">{formatNaira((w.amount_kobo || 0) / 100)}</div>
                          <span className="text-[11px] text-slate-300">{w.bank_name} · {w.account_number} ({w.account_name})</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={processingActionId === w.id}
                            onClick={() => handleUpdateWithdrawalStatus(w.id, 'paid')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Task Submissions Quick List */}
              <div className="p-6 rounded-3xl bg-[#03241b]/60 border border-emerald-400/25 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white font-heading">
                      Pending Task Audit Queue
                    </h2>
                    <p className="text-[11px] text-slate-400">Verify evidence submitted by members</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="text-xs font-bold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {submissions.filter((s) => s.status === 'pending_review').length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No task submissions currently pending review.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {submissions.filter((s) => s.status === 'pending_review').slice(0, 4).map((s) => (
                      <div key={s.id} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate">{s.sponsored_tasks?.title || 'Sponsored Task'}</span>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            Reward: {formatNaira((s.sponsored_tasks?.reward_kobo || 0) / 100)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {s.proof_url && (
                            <a
                              href={s.proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-white/10 text-slate-200 hover:text-white"
                              title="View Proof"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            disabled={processingActionId === s.id}
                            onClick={() => handleUpdateSubmissionStatus(s.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white font-heading">
                  Withdrawal Requests ({withdrawals.length})
                </h1>
                <p className="text-xs text-slate-400">
                  Manage manual bank payouts to Nigerian commercial bank accounts.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                {['all', 'pending', 'approved', 'paid', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setWithdrawalFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                      withdrawalFilter === st
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Bank Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No withdrawal requests matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {w.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 font-bold font-mono text-white text-sm">
                          {formatNaira((w.amount_kobo || 0) / 100)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{w.account_name}</span>
                          <span className="text-[11px] text-slate-400 block">{w.bank_name} · {w.account_number}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            w.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                            w.status === 'approved' ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' :
                            w.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                            'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {new Date(w.created_at).toLocaleDateString('en-NG')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {w.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={processingActionId === w.id}
                                onClick={() => handleUpdateWithdrawalStatus(w.id, 'paid')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                Mark Paid
                              </button>
                              <button
                                type="button"
                                disabled={processingActionId === w.id}
                                onClick={() => handleUpdateWithdrawalStatus(w.id, 'rejected')}
                                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TASK REVIEWS */}
        {activeTab === 'submissions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white font-heading">
                  Task Submissions Audit ({submissions.length})
                </h1>
                <p className="text-xs text-slate-400">
                  Review member proof evidence and disburse approved task earnings to user wallets.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
                {['all', 'pending_review', 'approved', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSubmissionFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                      submissionFilter === st
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Submission ID</th>
                    <th className="py-3 px-4">Task Campaign</th>
                    <th className="py-3 px-4">Reward</th>
                    <th className="py-3 px-4">Proof Evidence</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No submissions matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {s.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">
                            {s.sponsored_tasks?.title || 'Sponsored Task'}
                          </span>
                          <span className="text-[10px] text-slate-400">Member: {s.user_id?.slice(0, 8)}...</span>
                        </td>
                        <td className="py-3 px-4 font-bold font-mono text-emerald-400">
                          {formatNaira((s.sponsored_tasks?.reward_kobo || 0) / 100)}
                        </td>
                        <td className="py-3 px-4">
                          {s.proof_url ? (
                            <a
                              href={s.proof_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 underline text-xs"
                            >
                              <span>View Evidence</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-500 text-[11px]">No link</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                            s.status === 'pending_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                            'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                          }`}>
                            {s.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {new Date(s.created_at).toLocaleDateString('en-NG')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {s.status === 'pending_review' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={processingActionId === s.id}
                                onClick={() => handleUpdateSubmissionStatus(s.id, 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={processingActionId === s.id}
                                onClick={() => handleUpdateSubmissionStatus(s.id, 'rejected')}
                                className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Audited</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white font-heading">
                  Registered Members Directory ({profiles.length})
                </h1>
                <p className="text-xs text-slate-400">
                  Full list of authenticated member records in <code className="text-emerald-300 font-mono">public.profiles</code>.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search members..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-black/40 border border-emerald-400/20 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Full Legal Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No members found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {m.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {m.full_name || 'NARIVO Member'}
                        </td>
                        <td className="py-3 px-4 text-slate-200">
                          {m.email}
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                          {m.phone_number || 'Not provided'}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {new Date(m.created_at).toLocaleDateString('en-NG')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MEMBERSHIPS */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white font-heading">
                Platform Membership Plans & Subscriptions
              </h1>
              <p className="text-xs text-slate-400">
                Tier definitions in <code className="text-emerald-300 font-mono">public.membership_plans</code> and active subscriptions in <code className="text-emerald-300 font-mono">public.memberships</code>.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-[#03241b]/70 border border-emerald-400/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <h3 className="font-bold text-white text-base">{p.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.is_active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.description || 'No description set'}</p>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs flex items-center justify-between font-mono">
                    <span className="text-slate-400">Price: {formatNaira((p.price_kobo || 0) / 100)}</span>
                    <span className="text-slate-400">Duration: {p.duration_days ? `${p.duration_days} days` : 'Unconfigured'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Memberships Table */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-white font-heading">
                User Subscription Records ({memberships.length})
              </h2>
              <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                  <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                    <tr>
                      <th className="py-3 px-4">Membership ID</th>
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Starts At</th>
                      <th className="py-3 px-4">Expires At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {memberships.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          Zero active memberships assigned (all accounts start as registered free profiles).
                        </td>
                      </tr>
                    ) : (
                      memberships.map((m) => (
                        <tr key={m.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{m.id.slice(0, 8)}...</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{m.user_id.slice(0, 8)}...</td>
                          <td className="py-3 px-4 font-semibold text-white">{m.membership_plans?.name || 'Premium'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-400">{m.starts_at ? new Date(m.starts_at).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3 px-4 text-[11px] text-slate-400">{m.expires_at ? new Date(m.expires_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-white font-heading">
                Membership Payment Records ({payments.length})
              </h1>
              <p className="text-xs text-slate-400">
                Audit trail from <code className="text-emerald-300 font-mono">public.membership_payments</code> with immutable snapshots.
              </p>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Verified At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No payment records registered yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{p.provider_reference}</td>
                        <td className="py-3 px-4 uppercase text-[11px] font-bold text-slate-400">{p.payment_provider}</td>
                        <td className="py-3 px-4 font-bold font-mono text-white">{formatNaira((p.amount_kobo || 0) / 100)}</td>
                        <td className="py-3 px-4 text-slate-200">{p.purchased_plan_name || 'Premium'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'successful' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {p.verified_at ? new Date(p.verified_at).toLocaleString() : 'Pending'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: TASKS & CAMPAIGNS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white font-heading">
                Sponsored Campaigns & Tasks Directory
              </h1>
              <p className="text-xs text-slate-400">
                Active opportunities configured in <code className="text-emerald-300 font-mono">public.sponsored_tasks</code> and <code className="text-emerald-300 font-mono">public.sponsored_campaigns</code>.
              </p>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Task Title</th>
                    <th className="py-3 px-4">Campaign Sponsor</th>
                    <th className="py-3 px-4">Reward</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No sponsored tasks listed in database.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((t) => (
                      <tr key={t.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-semibold text-white">{t.title}</td>
                        <td className="py-3 px-4 text-slate-300">{t.sponsored_campaigns?.title || 'Verified Partner'}</td>
                        <td className="py-3 px-4 font-bold font-mono text-emerald-400">{formatNaira((t.reward_kobo || 0) / 100)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: REFERRALS */}
        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white font-heading">
                Referral Records ({referrals.length})
              </h1>
              <p className="text-xs text-slate-400">
                Single-tier invite conversions from <code className="text-emerald-300 font-mono">public.referrals</code>.
              </p>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Referral ID</th>
                    <th className="py-3 px-4">Referred Member ID</th>
                    <th className="py-3 px-4">Commission</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No referral conversions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{r.id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{r.referred_user_id?.slice(0, 8)}...</td>
                        <td className="py-3 px-4 font-bold font-mono text-emerald-400">{formatNaira((r.commission_kobo || 0) / 100)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: WALLET LEDGER */}
        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-white font-heading">
                Wallet Ledger Audit ({ledgerEntries.length})
              </h1>
              <p className="text-xs text-slate-400">
                Immutable financial transactions from <code className="text-emerald-300 font-mono">public.wallet_ledger</code>.
              </p>
            </div>

            <div className="rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
                <thead className="bg-black/40 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Entry Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {ledgerEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No transactions recorded in wallet ledger.
                      </td>
                    </tr>
                  ) : (
                    ledgerEntries.map((l) => (
                      <tr key={l.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{l.id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{l.user_id.slice(0, 8)}...</td>
                        <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-400">{l.entry_type}</td>
                        <td className={`py-3 px-4 font-bold font-mono ${l.amount_kobo >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {l.amount_kobo >= 0 ? '+' : ''}{formatNaira(l.amount_kobo / 100)}
                        </td>
                        <td className="py-3 px-4 text-slate-200">{l.description}</td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">{new Date(l.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: RLS & SECURITY STATUS */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white font-heading">
                Row Level Security & Access Control Configuration
              </h1>
              <p className="text-xs text-slate-400">
                Review verified security policies and cryptographic claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Authorized Administrator Claim</span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trusted Email:</span>
                    <span className="text-emerald-300">{supabaseUser?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">JWT app_metadata.role:</span>
                    <span className="text-emerald-300 font-bold">{supabaseUser?.app_metadata?.role || 'admin'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supabase User UID:</span>
                    <span className="text-slate-300">{supabaseUser?.id}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Authentication is cryptographically signed by Supabase Auth with PKCE and JWT. The trusted role is read from <code className="text-emerald-300 font-mono">app_metadata</code>, which cannot be modified by user clients.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#03241b]/60 border border-emerald-400/20 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>Database is_narivo_admin() Policies</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Withdrawal Approvals:</strong> Admin session permitted to update withdrawal statuses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Task Submission Reviews:</strong> Admin session permitted to approve or reject submissions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Read All Profiles:</strong> Authenticated admin can inspect the complete member registry.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
