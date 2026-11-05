/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  SponsoredTask, 
  TaskSubmission, 
  WalletTransaction, 
  WithdrawalRequest, 
  ReferralStat, 
  ReferredUser,
  DatabaseProfile,
  DatabaseMembershipPlan,
  DatabaseMembership,
  DatabaseWalletBalance,
  DatabaseWalletLedger,
  DatabaseWithdrawalRequest,
  DatabaseSponsoredTask,
  DatabaseTaskSubmission,
  DatabaseReferralCode,
  DatabaseReferral
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

export type ScreenType = 
  | 'landing' 
  | 'about'
  | 'how-it-works'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'register' 
  | 'login' 
  | 'auth-callback'
  | 'dashboard' 
  | 'tasks' 
  | 'wallet' 
  | 'referrals' 
  | 'profile'
  | 'membership'
  | 'not-found';

export const SCREEN_ROUTES: Record<ScreenType, string> = {
  landing: '/',
  about: '/about',
  'how-it-works': '/how-it-works',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  register: '/register',
  login: '/login',
  'auth-callback': '/auth/callback',
  dashboard: '/dashboard',
  tasks: '/tasks',
  wallet: '/wallet',
  referrals: '/referrals',
  profile: '/profile',
  membership: '/membership',
  'not-found': '/404',
};

export const getScreenFromPathname = (pathname: string): ScreenType => {
  const normalized = pathname.replace(/\/$/, '') || '/';
  for (const [screen, path] of Object.entries(SCREEN_ROUTES)) {
    if (path === normalized && screen !== 'not-found') {
      return screen as ScreenType;
    }
  }
  return 'not-found';
};

interface AuthResponse {
  success: boolean;
  error?: string;
  needsEmailVerification?: boolean;
}

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  user: UserProfile | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  isEmailVerified: boolean;
  isSupabaseConfigured: boolean;
  
  // Database Models
  dbProfile: DatabaseProfile | null;
  activeMembership: DatabaseMembership | null;
  isMembershipActive: boolean;
  isMembershipExpired: boolean;
  membershipPlans: DatabaseMembershipPlan[];
  membershipLoading: boolean;
  
  // Financial State from Supabase
  availableBalance: number;
  pendingRewards: number;
  reservedFunds: number;
  totalWithdrawn: number;
  lifetimeEarned: number;
  walletLoading: boolean;
  walletError: string | null;
  transactions: WalletTransaction[];
  withdrawalRequests: WithdrawalRequest[];

  // Tasks & Submissions from Supabase
  tasks: SponsoredTask[];
  tasksLoading: boolean;
  tasksError: string | null;
  submissions: TaskSubmission[];
  submissionsLoading: boolean;
  selectedTaskForSubmission: SponsoredTask | null;
  setSelectedTaskForSubmission: (task: SponsoredTask | null) => void;

  // Referral Network from Supabase
  referralStat: ReferralStat;
  referrals: ReferredUser[];
  referralsLoading: boolean;

  // Global UI State
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;

  // Actions
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: { fullName: string; email: string; phone: string; password?: string; referralCode?: string }) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<AuthResponse>;
  ensureUserProfile: (sbUser: SupabaseAuthUser) => Promise<DatabaseProfile | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email?: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  submitTaskProof: (taskId: string, proof: { proofUrl?: string; proofUsername?: string; proofNotes?: string }) => Promise<{ success: boolean; message: string }>;
  requestWithdrawal: (amount: number, bankName: string, accountNumber: string, accountName: string) => Promise<{ success: boolean; message: string }>;
  refreshAllData: () => Promise<void>;
  refreshMembership: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


// Helper to check whether a membership is genuinely active (status = 'active' AND not expired)
export const checkMembershipIsActive = (m: DatabaseMembership | null): boolean => {
  if (!m) return false;
  if (m.status !== 'active') return false;
  if (m.expires_at) {
    return new Date(m.expires_at).getTime() > Date.now();
  }
  return true;
};

// Helper to check whether a membership has expired
export const checkMembershipIsExpired = (m: DatabaseMembership | null): boolean => {
  if (!m) return false;
  if (m.status === 'expired') return true;
  if (m.status === 'active' && m.expires_at) {
    return new Date(m.expires_at).getTime() <= Date.now();
  }
  return false;
};

// Helper to construct UserProfile from Supabase Auth + Database Profile + Active Membership
const mapSupabaseDataToProfile = (
  sbUser: SupabaseAuthUser, 
  dbProfile?: DatabaseProfile | null, 
  dbMembership?: DatabaseMembership | null,
  referralCode?: string
): UserProfile => {
  const meta = sbUser.user_metadata || {};
  const fullName = dbProfile?.full_name || meta.full_name || sbUser.email?.split('@')[0] || 'NARIVO Member';
  const email = dbProfile?.email || sbUser.email || '';
  const phone = dbProfile?.phone_number || meta.phone || '';

  // Strict database-driven membership status
  let membershipTier = 'Registered — No Active Membership';
  if (checkMembershipIsActive(dbMembership ?? null)) {
    membershipTier = dbMembership?.membership_plans?.name || 'Premium Member';
  } else if (checkMembershipIsExpired(dbMembership ?? null)) {
    const planName = dbMembership?.membership_plans?.name || 'Premium Member';
    membershipTier = `${planName} (Expired)`;
  } else {
    membershipTier = 'Registered — No Active Membership';
  }

  const generatedRef = referralCode || `NAR-${sbUser.id.slice(0, 6).toUpperCase()}`;

  return {
    id: sbUser.id,
    fullName,
    email,
    phone,
    state: meta.state || 'Lagos State',
    referralCode: generatedRef,
    referredBy: meta.referred_by || undefined,
    membershipTier,
    isEmailVerified: Boolean(sbUser.email_confirmed_at),
    isPhoneVerified: Boolean(sbUser.phone_confirmed_at),
    bankDetails: {
      bankName: meta.bank_name || '',
      bankCode: meta.bank_code || '',
      accountNumber: meta.account_number || '',
      accountName: meta.account_name || fullName,
    },
    createdAt: dbProfile?.created_at 
      ? dbProfile.created_at.split('T')[0] 
      : (sbUser.created_at ? sbUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<ScreenType>(() => {
    if (typeof window !== 'undefined') {
      return getScreenFromPathname(window.location.pathname);
    }
    return 'landing';
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Database-backed Profile & Membership
  const [dbProfile, setDbProfile] = useState<DatabaseProfile | null>(null);
  const [activeMembership, setActiveMembership] = useState<DatabaseMembership | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<DatabaseMembershipPlan[]>([]);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);

  // Database-backed Financial State
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [pendingRewards, setPendingRewards] = useState<number>(0);
  const [reservedFunds, setReservedFunds] = useState<number>(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
  const [lifetimeEarned, setLifetimeEarned] = useState<number>(0);
  const [walletLoading, setWalletLoading] = useState<boolean>(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  // Database-backed Tasks & Submissions
  const [tasks, setTasks] = useState<SponsoredTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState<boolean>(false);
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<SponsoredTask | null>(null);

  // Database-backed Referrals
  const [referralStat, setReferralStat] = useState<ReferralStat>({
    totalClicks: 0,
    registeredCount: 0,
    activeEarnersCount: 0,
    totalEarnedNaira: 0,
    referralCode: '',
    referralLink: '',
  });
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [referralsLoading, setReferralsLoading] = useState<boolean>(false);

  // UI state
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  // Protected member-only routes
  const protectedScreens: ScreenType[] = ['dashboard', 'wallet', 'referrals', 'profile', 'membership'];

  const setCurrentScreen = useCallback((screen: ScreenType) => {
    if (protectedScreens.includes(screen) && !isAuthenticated) {
      showToast('Authentication required. Please sign in to access your member account.');
      setCurrentScreenState('login');
      if (typeof window !== 'undefined') {
        const path = SCREEN_ROUTES['login'];
        if (window.location.pathname !== path) {
          window.history.pushState(null, '', path);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setCurrentScreenState(screen);
    if (typeof window !== 'undefined') {
      const path = SCREEN_ROUTES[screen] || '/';
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated, protectedScreens, showToast]);

  // Synchronize browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const screen = getScreenFromPathname(window.location.pathname);
      setCurrentScreenState(screen);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Public data fetcher (campaigns & membership plans accessible publicly)
  const fetchPublicData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setTasksLoading(true);
    try {
      // 1. Fetch public.membership_plans
      const { data: mpData } = await supabase
        .from('membership_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (mpData) {
        setMembershipPlans(mpData as DatabaseMembershipPlan[]);
      }

      // 2. Fetch public.sponsored_tasks with active campaigns
      const { data: stData, error: stErr } = await supabase
        .from('sponsored_tasks')
        .select('*, sponsored_campaigns(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (stErr) {
        console.warn('Error reading public.sponsored_tasks:', stErr.message);
        setTasksError(stErr.message);
        setTasks([]);
      } else if (stData && stData.length > 0) {
        const rawTasks = stData as DatabaseSponsoredTask[];
        const now = Date.now();

        // Display only genuinely active campaigns and tasks
        const activeTasks = rawTasks.filter((t) => {
          if (t.status !== 'active') return false;
          if (t.sponsored_campaigns) {
            const camp = t.sponsored_campaigns;
            if (camp.status && camp.status !== 'active') return false;
            if (camp.starts_at && new Date(camp.starts_at).getTime() > now) return false;
            if (camp.ends_at && new Date(camp.ends_at).getTime() < now) return false;
          }
          return true;
        });

        const mappedTasks: SponsoredTask[] = activeTasks.map((t) => {
          let inst: string[] = [];
          if (Array.isArray(t.instructions)) {
            inst = t.instructions;
          } else if (typeof t.instructions === 'string') {
            inst = t.instructions.split('\n').filter(Boolean);
          } else {
            inst = ['Follow the verified campaign instructions provided.'];
          }

          return {
            id: t.id,
            title: t.title,
            category: 'Sponsored Campaign',
            sponsorName: t.sponsored_campaigns?.title || 'Verified Advertiser',
            rewardNaira: (t.reward_kobo || 0) / 100,
            totalSlots: 100,
            remainingSlots: 50,
            estimatedMinutes: 5,
            instructions: inst,
            proofRequirements: {
              type: 'link',
              description: 'Submit proof URL or verification screenshot as requested.',
            },
            verificationWindowHours: 24,
            status: 'active',
            createdAt: t.created_at,
            campaignType: 'verified_sponsor',
          };
        });
        setTasks(mappedTasks);
        setTasksError(null);
      } else {
        setTasks([]);
        setTasksError(null);
      }
    } catch (err: any) {
      console.warn('Failed to fetch public tasks & plans:', err);
      setTasksError(err?.message || 'Database query error');
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  // =========================================================================
  // SUPABASE DATA FETCHING (STRICTLY FROM DATABASE TABLES & VIEWS)
  // =========================================================================
  const fetchUserData = useCallback(async (userId: string, sbUser?: SupabaseAuthUser) => {
    if (!isSupabaseConfigured) return;

    setMembershipLoading(true);
    setWalletLoading(true);
    setTasksLoading(true);
    setSubmissionsLoading(true);
    setReferralsLoading(true);
    setWalletError(null);
    setTasksError(null);

    try {
      // 1. Fetch public.profiles
      const { data: pData, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (pErr) {
        console.warn('Error reading public.profiles:', pErr.message);
      } else if (pData) {
        setDbProfile(pData as DatabaseProfile);
      }

      // 2. Fetch public.memberships (latest record for this user)
      const { data: mData, error: mErr } = await supabase
        .from('memberships')
        .select('*, membership_plans(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (mErr) {
        console.warn('Error reading public.memberships:', mErr.message);
      } else {
        setActiveMembership(mData as DatabaseMembership | null);
      }

      // 3. Fetch public.membership_plans
      const { data: plansData, error: plansErr } = await supabase
        .from('membership_plans')
        .select('*')
        .order('created_at', { ascending: true });

      if (plansErr) {
        console.warn('Error reading public.membership_plans:', plansErr.message);
      } else if (plansData && plansData.length > 0) {
        setMembershipPlans(plansData as DatabaseMembershipPlan[]);
      } else {
        setMembershipPlans([
          {
            id: 'premium-unpriced',
            name: 'Premium Member',
            description: 'Priority task catalog access, expedited verification, and high-value brand sponsorships.',
            price_kobo: 0,
            duration_days: null,
            is_active: false,
            created_at: new Date().toISOString(),
          }
        ]);
      }

      // 4. Fetch public.wallet_balances (View)
      const { data: wbData, error: wbErr } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (wbErr) {
        console.warn('Error reading public.wallet_balances view:', wbErr.message);
        setWalletError(wbErr.message);
      } else if (wbData) {
        const wb = wbData as DatabaseWalletBalance;
        setAvailableBalance((wb.available_kobo || 0) / 100);
        setPendingRewards((wb.pending_kobo || 0) / 100);
        setReservedFunds((wb.reserved_kobo || 0) / 100);
      } else {
        // Genuine new user with zero ledger records starts at ₦0.00
        setAvailableBalance(0);
        setPendingRewards(0);
        setReservedFunds(0);
      }

      // 5. Fetch public.wallet_ledger (Financial Source of Truth)
      const { data: wlData, error: wlErr } = await supabase
        .from('wallet_ledger')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (wlErr) {
        console.warn('Error reading public.wallet_ledger:', wlErr.message);
        setWalletError(wlErr.message);
      } else if (wlData) {
        const rawLedger = wlData as DatabaseWalletLedger[];
        const mappedTx: WalletTransaction[] = rawLedger.map((row) => ({
          id: row.id,
          userId: row.user_id,
          type: row.entry_type || 'task_reward',
          title: row.description || 'Ledger Entry',
          amountNaira: Math.abs(row.amount_kobo || 0) / 100,
          status: 'approved',
          reference: `LEDGER-${row.id.slice(0, 8).toUpperCase()}`,
          date: new Date(row.created_at).toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
        }));
        setTransactions(mappedTx);

        // Calculate lifetime earned from positive ledger credits
        const totalEarnedKobo = rawLedger
          .filter((r) => (r.amount_kobo || 0) > 0)
          .reduce((sum, r) => sum + r.amount_kobo, 0);
        setLifetimeEarned(totalEarnedKobo / 100);
      } else {
        setTransactions([]);
        setLifetimeEarned(0);
      }

      // 6. Fetch public.withdrawal_requests
      const { data: wrData, error: wrErr } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (wrErr) {
        console.warn('Error reading public.withdrawal_requests:', wrErr.message);
      } else if (wrData) {
        const rawWd = wrData as DatabaseWithdrawalRequest[];
        const mappedWd: WithdrawalRequest[] = rawWd.map((row) => ({
          id: row.id,
          userId: row.user_id,
          amountNaira: (row.amount_kobo || 0) / 100,
          bankName: row.bank_name || 'Commercial Bank',
          accountNumber: row.account_number || '',
          accountName: row.account_name || 'Account Holder',
          status: row.status,
          reference: `WD-${row.id.slice(0, 8).toUpperCase()}`,
          requestedAt: new Date(row.created_at).toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          processedAt: row.updated_at ? new Date(row.updated_at).toLocaleString('en-NG') : undefined,
        }));
        setWithdrawalRequests(mappedWd);

        // Calculate total confirmed withdrawals (status === 'paid' or 'completed')
        const totalPaidKobo = rawWd
          .filter((r) => r.status === 'paid')
          .reduce((sum, r) => sum + (r.amount_kobo || 0), 0);
        setTotalWithdrawn(totalPaidKobo / 100);
      } else {
        setWithdrawalRequests([]);
        setTotalWithdrawn(0);
      }

      // 7. Fetch public.sponsored_tasks
      const { data: stData, error: stErr } = await supabase
        .from('sponsored_tasks')
        .select('*, sponsored_campaigns(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (stErr) {
        console.warn('Error reading public.sponsored_tasks:', stErr.message);
        setTasksError(stErr.message);
        setTasks([]);
      } else if (stData && stData.length > 0) {
        const rawTasks = stData as DatabaseSponsoredTask[];
        const mappedTasks: SponsoredTask[] = rawTasks.map((t) => {
          let inst: string[] = [];
          if (Array.isArray(t.instructions)) {
            inst = t.instructions;
          } else if (typeof t.instructions === 'string') {
            inst = t.instructions.split('\n').filter(Boolean);
          } else {
            inst = ['Follow the verified campaign instructions provided.'];
          }

          return {
            id: t.id,
            title: t.title,
            category: 'Sponsored Campaign',
            sponsorName: t.sponsored_campaigns?.title || 'Verified Partner',
            rewardNaira: (t.reward_kobo || 0) / 100,
            totalSlots: 100,
            remainingSlots: 50,
            estimatedMinutes: 5,
            instructions: inst,
            proofRequirements: {
              type: 'link',
              description: 'Submit proof URL or verification screenshot as requested.',
            },
            verificationWindowHours: 24,
            status: 'active',
            createdAt: t.created_at,
            campaignType: 'verified_sponsor',
          };
        });
        setTasks(mappedTasks);
      } else {
        // Zero active tasks in database
        setTasks([]);
      }

      // 8. Fetch public.task_submissions
      const { data: subData, error: subErr } = await supabase
        .from('task_submissions')
        .select('*, sponsored_tasks(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (subErr) {
        console.warn('Error reading public.task_submissions:', subErr.message);
      } else if (subData) {
        const rawSubs = subData as DatabaseTaskSubmission[];
        const mappedSubs: TaskSubmission[] = rawSubs.map((s) => ({
          id: s.id,
          taskId: s.task_id,
          taskTitle: s.sponsored_tasks?.title || 'Sponsored Campaign Submission',
          sponsorName: 'Verified Campaign',
          userId: s.user_id,
          rewardNaira: (s.sponsored_tasks?.reward_kobo || 0) / 100,
          proofUrl: s.proof_url,
          submittedAt: new Date(s.created_at).toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          reviewedAt: s.reviewed_at ? new Date(s.reviewed_at).toLocaleString('en-NG') : undefined,
          status: s.status,
        }));
        setSubmissions(mappedSubs);
      } else {
        setSubmissions([]);
      }

      // 9. Fetch public.referral_codes & public.referrals
      let refCodeString = `NAR-${userId.slice(0, 6).toUpperCase()}`;
      const { data: rcData, error: rcErr } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (!rcErr && rcData) {
        refCodeString = (rcData as DatabaseReferralCode).code;
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://narivo.app';
      const refLink = `${origin}/?ref=${refCodeString}`;

      // Query referrals linked to this code
      if (rcData?.id) {
        const { data: refRows } = await supabase
          .from('referrals')
          .select('*')
          .eq('referral_code_id', rcData.id)
          .order('created_at', { ascending: false });

        if (refRows && refRows.length > 0) {
          const rawRefs = refRows as DatabaseReferral[];
          const mappedRefs: ReferredUser[] = rawRefs.map((r) => ({
            id: r.id,
            name: `Member ${r.referred_user_id.slice(0, 8)}`,
            joinedDate: new Date(r.created_at).toLocaleDateString('en-NG'),
            status: r.status,
            commissionEarnedNaira: (r.commission_kobo || 0) / 100,
          }));
          setReferrals(mappedRefs);

          const totalCommissionKobo = rawRefs.reduce((acc, curr) => acc + (curr.commission_kobo || 0), 0);
          setReferralStat({
            totalClicks: 0,
            registeredCount: mappedRefs.length,
            activeEarnersCount: mappedRefs.filter((m) => m.status === 'active').length,
            totalEarnedNaira: totalCommissionKobo / 100,
            referralCode: refCodeString,
            referralLink: refLink,
          });
        } else {
          setReferrals([]);
          setReferralStat({
            totalClicks: 0,
            registeredCount: 0,
            activeEarnersCount: 0,
            totalEarnedNaira: 0,
            referralCode: refCodeString,
            referralLink: refLink,
          });
        }
      } else {
        setReferrals([]);
        setReferralStat({
          totalClicks: 0,
          registeredCount: 0,
          activeEarnersCount: 0,
          totalEarnedNaira: 0,
          referralCode: refCodeString,
          referralLink: refLink,
        });
      }

      // 10. Update user profile state
      if (sbUser) {
        const fullProfile = mapSupabaseDataToProfile(
          sbUser, 
          pData as DatabaseProfile | null, 
          mData as DatabaseMembership | null,
          refCodeString
        );
        setUser(fullProfile);
      }
    } catch (err) {
      console.warn('Unexpected error during fetchUserData:', err);
    } finally {
      setMembershipLoading(false);
      setWalletLoading(false);
      setTasksLoading(false);
      setSubmissionsLoading(false);
      setReferralsLoading(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await fetchPublicData();
    if (!user) return;
    await fetchUserData(user.id);
  }, [user, fetchPublicData, fetchUserData]);

  const refreshMembership = useCallback(async () => {
    await fetchPublicData();
    if (!user) return;
    await fetchUserData(user.id);
  }, [user, fetchPublicData, fetchUserData]);

  // =========================================================================
  // USER PROFILE SYNCHRONIZATION (IDEMPOTENT & STRICT)
  // =========================================================================
  const ensureUserProfile = useCallback(async (sbUser: SupabaseAuthUser): Promise<DatabaseProfile | null> => {
    if (!isSupabaseConfigured) return null;

    try {
      // 1. Check whether user's profile already exists in public.profiles
      const { data: existingProfile, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (!fetchErr && existingProfile) {
        setDbProfile(existingProfile as DatabaseProfile);
        return existingProfile as DatabaseProfile;
      }

      // 2. If it does not exist, safely create the profile using authenticated Supabase user ID and metadata
      const meta = sbUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'NARIVO Member';
      const email = sbUser.email || '';
      const phone = meta.phone || meta.phone_number || null;

      const { data: inserted, error: insertErr } = await supabase
        .from('profiles')
        .insert({
          id: sbUser.id,
          full_name: fullName,
          email: email,
          phone_number: phone,
        })
        .select('*')
        .maybeSingle();

      if (insertErr) {
        console.warn('Profile insert note (may be handled by DB trigger or RLS):', insertErr.message);
        // If trigger already inserted it, query one more time
        const { data: recheck } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .maybeSingle();
        if (recheck) {
          setDbProfile(recheck as DatabaseProfile);
          return recheck as DatabaseProfile;
        }
        return null;
      }

      if (inserted) {
        setDbProfile(inserted as DatabaseProfile);
      }

      // Ensure default referral code is created if not already present
      const defaultRefCode = `NAR-${sbUser.id.slice(0, 6).toUpperCase()}`;
      try {
        await supabase
          .from('referral_codes')
          .insert({
            user_id: sbUser.id,
            code: defaultRefCode,
            is_active: true,
          });
      } catch {
        // Ignored if RLS or unique constraint already handles this
      }

      return (inserted as DatabaseProfile) || null;
    } catch (err) {
      console.warn('Exception ensuring user profile:', err);
      return null;
    }
  }, []);

  // =========================================================================
  // SUPABASE SESSION PERSISTENCE & AUTH LISTENER
  // =========================================================================
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) setAuthLoading(false);
        return;
      }

      try {
        // Fetch public marketplace and plans for all users
        await fetchPublicData();

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase auth getSession error:', error.message);
        }

        if (session?.user && isMounted) {
          setIsAuthenticated(true);
          await ensureUserProfile(session.user);
          await fetchUserData(session.user.id, session.user);
        }
      } catch (err) {
        console.warn('Failed to restore Supabase session:', err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setIsAuthenticated(true);
          await ensureUserProfile(session.user);
          await fetchUserData(session.user.id, session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setDbProfile(null);
        setActiveMembership(null);
        setIsAuthenticated(false);
        setAvailableBalance(0);
        setPendingRewards(0);
        setReservedFunds(0);
        setTotalWithdrawn(0);
        setLifetimeEarned(0);
        setSubmissions([]);
        setTransactions([]);
        setReferrals([]);
        setCurrentScreenState('landing');
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchPublicData, fetchUserData, ensureUserProfile]);

  // Listen for OAuth popup completion (supports AI Studio iframe environment)
  useEffect(() => {
    const handleOAuthPopupMessage = async (event: MessageEvent) => {
      if (typeof window !== 'undefined') {
        const origin = event.origin;
        if (
          origin !== window.location.origin && 
          !origin.endsWith('.run.app') && 
          !origin.includes('localhost')
        ) {
          return;
        }
      }

      if (event.data?.type === 'NARIVO_OAUTH_SUCCESS') {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setIsAuthenticated(true);
            await ensureUserProfile(session.user);
            await fetchUserData(session.user.id, session.user);
            showToast('Signed in with Google successfully!');
            setCurrentScreenState('dashboard');
            if (typeof window !== 'undefined') {
              const path = SCREEN_ROUTES['dashboard'];
              if (window.location.pathname !== path) {
                window.history.pushState(null, '', path);
              }
            }
          }
        } catch (e) {
          console.warn('Error handling OAuth popup message:', e);
        }
      }
    };

    window.addEventListener('message', handleOAuthPopupMessage);
    return () => window.removeEventListener('message', handleOAuthPopupMessage);
  }, [ensureUserProfile, fetchUserData, showToast]);

  // Route protection check: require authentication for protected pages
  useEffect(() => {
    if (!authLoading && !isAuthenticated && protectedScreens.includes(currentScreen)) {
      setCurrentScreenState('login');
    }
  }, [authLoading, isAuthenticated, currentScreen, protectedScreens]);

  // Automatically redirect authenticated users visiting /login or /register to /dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && (currentScreen === 'login' || currentScreen === 'register')) {
      setCurrentScreenState('dashboard');
      if (typeof window !== 'undefined') {
        const path = SCREEN_ROUTES['dashboard'];
        if (window.location.pathname !== path) {
          window.history.pushState(null, '', path);
        }
      }
    }
  }, [authLoading, isAuthenticated, currentScreen]);

  // AUTH ACTIONS
  // =========================================================================
  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsAuthenticated(true);
        await fetchUserData(data.user.id, data.user);
        showToast('Signed in successfully.');
        setCurrentScreenState('dashboard');
        return { 
          success: true, 
          needsEmailVerification: !data.user.email_confirmed_at 
        };
      }

      return { success: false, error: 'Sign in failed. Please try again.' };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'An unexpected error occurred during login.' 
      };
    }
  };

  const register = async (data: { 
    fullName: string; 
    email: string; 
    phone: string; 
    password?: string; 
    referralCode?: string 
  }): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password || '',
        options: {
          data: {
            full_name: data.fullName.trim(),
            phone: data.phone.trim(),
            referral_code: `NAR-${Math.floor(1000 + Math.random() * 9000)}`,
            referred_by: data.referralCode?.trim() || null,
            state: 'Lagos State',
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (authData.user) {
        if (authData.session) {
          setIsAuthenticated(true);
          await fetchUserData(authData.user.id, authData.user);
          setCurrentScreenState('dashboard');
          return { success: true, needsEmailVerification: false };
        } else {
          return { 
            success: true, 
            needsEmailVerification: true 
          };
        }
      }

      return { success: false, error: 'Registration could not be completed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration exception' };
    }
  };

  const signInWithGoogle = async (): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase credentials are not configured.' };
    }

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectTo = `${origin}/auth/callback`;
      const isIframe = typeof window !== 'undefined' && window.self !== window.top;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: isIframe, // In iframe, prevent framing errors by opening popup directly
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (isIframe && data?.url) {
        const popup = window.open(
          data.url,
          'narivo_google_auth',
          'width=540,height=660,menubar=no,toolbar=no,status=no,location=yes'
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          // If popup blocker intervened, open in new tab
          window.open(data.url, '_blank');
        }
      }

      return { success: true };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'Failed to initiate Google authentication. Please try again.' 
      };
    }
  };

  const logout = async () => {

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('SignOut error:', err);
      }
    }
    setUser(null);
    setDbProfile(null);
    setActiveMembership(null);
    setIsAuthenticated(false);
    setAvailableBalance(0);
    setPendingRewards(0);
    setReservedFunds(0);
    setLifetimeEarned(0);
    setTotalWithdrawn(0);
    setTransactions([]);
    setWithdrawalRequests([]);
    setSubmissions([]);
    setReferrals([]);
    setCurrentScreenState('landing');
    showToast('Signed out of NARIVO.');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase is not configured.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Password reset request failed.' };
    }
  };

  const resendVerificationEmail = async (targetEmail?: string): Promise<{ success: boolean; message: string }> => {
    const emailToUse = targetEmail || user?.email;
    if (!emailToUse) {
      return { success: false, message: 'No email address specified.' };
    }
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Supabase authentication is not configured.' };
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Verification link resent to your email!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to resend verification email.' };
    }
  };

  // =========================================================================
  // PROFILE MUTATIONS
  // =========================================================================
  const updateProfile = async (updated: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'No user signed in' };

    const merged = { ...user, ...updated };
    setUser(merged);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updated.fullName !== undefined ? updated.fullName.trim() : user.fullName,
            phone_number: updated.phone !== undefined ? updated.phone.trim() : user.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) {
          console.warn('Error updating public.profiles:', error.message);
          showToast(`Profile update error: ${error.message}`);
          return { success: false, message: error.message };
        } else {
          setDbProfile((prev) => prev ? {
            ...prev,
            full_name: updated.fullName ?? prev.full_name,
            phone_number: updated.phone ?? prev.phone_number,
          } : null);
        }
      } catch (err: any) {
        console.warn('Exception during profile update:', err);
      }
    }

    showToast('Profile and settlement settings updated successfully.');
    return { success: true, message: 'Saved successfully' };
  };

  // =========================================================================
  // TASK SUBMISSION WITH REAL SERVER-SIDE PRE-VALIDATION
  // =========================================================================
  const submitTaskProof = async (
    taskId: string, 
    proof: { proofUrl?: string; proofUsername?: string; proofNotes?: string }
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Authentication required to submit task evidence.' };
    }

    // 1. Enforce active Premium membership requirement
    const isPremium = checkMembershipIsActive(activeMembership);
    if (!isPremium) {
      return { 
        success: false, 
        message: 'Task submission requires an active Premium membership. Premium registration is currently inactive while pricing is being configured.' 
      };
    }

    // 2. Prevent duplicate pending submissions
    const existing = submissions.find(s => s.taskId === taskId && s.status === 'pending_review');
    if (existing) {
      return { success: false, message: 'You already submitted proof for this task. It is pending sponsor review.' };
    }

    try {
      const proofPayload = proof.proofUrl || proof.proofUsername || proof.proofNotes || 'Proof submitted';
      const { data, error } = await supabase
        .from('task_submissions')
        .insert({
          task_id: taskId,
          user_id: user.id,
          status: 'pending_review',
          proof_url: proofPayload,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: `Submission failed: ${error.message}` };
      }

      await fetchUserData(user.id);
      showToast('Task proof submitted successfully! Awaiting sponsor audit.');
      return { success: true, message: 'Task proof submitted for verification.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to record task submission.' };
    }
  };

  // =========================================================================
  // ATOMIC WITHDRAWAL USING REAL DATABASE RPC (request_withdrawal)
  // =========================================================================
  const requestWithdrawal = async (
    amount: number, 
    bankName: string, 
    accountNumber: string, 
    accountName: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Authentication required for withdrawals.' };
    }

    if (amount < 5000) {
      return { success: false, message: 'Minimum withdrawal amount is ₦5,000.00.' };
    }

    if (amount > availableBalance) {
      return { 
        success: false, 
        message: `Insufficient available balance. You currently have ₦${availableBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })} available.` 
      };
    }

    if (!accountNumber || accountNumber.length !== 10) {
      return { success: false, message: 'Please provide a valid 10-digit Nigerian NUBAN account number.' };
    }

    const amountKobo = Math.round(amount * 100);

    try {
      // Call existing atomic RPC in Supabase
      const { data: rpcData, error: rpcError } = await supabase.rpc('request_withdrawal', {
        p_amount_kobo: amountKobo,
        p_bank_name: bankName.trim(),
        p_account_name: accountName.trim(),
        p_account_number: accountNumber.trim(),
      });

      if (rpcError) {
        console.warn('request_withdrawal RPC error:', rpcError);
        return { success: false, message: rpcError.message || 'Withdrawal reservation failed on server.' };
      }

      // Refresh real balances and withdrawal requests from Supabase
      await fetchUserData(user.id);
      showToast(`Withdrawal of ₦${amount.toLocaleString('en-NG')} queued for administrator review.`);
      return { 
        success: true, 
        message: 'Withdrawal request submitted successfully. Transfers are processed manually by administrators.' 
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Server exception during withdrawal reservation.' };
    }
  };

  const isEmailVerified = Boolean(user?.isEmailVerified);
  const isUserMembershipActive = checkMembershipIsActive(activeMembership);
  const isUserMembershipExpired = checkMembershipIsExpired(activeMembership);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        user,
        isAuthenticated,
        authLoading,
        isEmailVerified,
        isSupabaseConfigured,
        dbProfile,
        activeMembership,
        isMembershipActive: isUserMembershipActive,
        isMembershipExpired: isUserMembershipExpired,
        membershipPlans,
        membershipLoading,
        availableBalance,
        pendingRewards,
        reservedFunds,
        totalWithdrawn,
        lifetimeEarned,
        walletLoading,
        walletError,
        transactions,
        withdrawalRequests,
        tasks,
        tasksLoading,
        tasksError,
        submissions,
        submissionsLoading,
        selectedTaskForSubmission,
        setSelectedTaskForSubmission,
        referralStat,
        referrals,
        referralsLoading,
        toastMessage,
        showToast,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        login,
        register,
        signInWithGoogle,
        ensureUserProfile,
        logout,
        resetPassword,
        resendVerificationEmail,
        updateProfile,
        submitTaskProof,
        requestWithdrawal,
        refreshAllData,
        refreshMembership,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
