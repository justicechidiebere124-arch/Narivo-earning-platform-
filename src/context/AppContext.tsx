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
  DatabaseMembership
} from '../types';
import { 
  INITIAL_USER, 
  SAMPLE_DEMO_USER,
  INITIAL_TASKS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REFERRED_USERS 
} from '../data/sampleData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

export type ScreenType = 
  | 'landing' 
  | 'register' 
  | 'login' 
  | 'dashboard' 
  | 'tasks' 
  | 'wallet' 
  | 'referrals' 
  | 'profile'
  | 'membership';

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
  dbProfile: DatabaseProfile | null;
  activeMembership: DatabaseMembership | null;
  isMembershipActive: boolean;
  isMembershipExpired: boolean;
  membershipPlans: DatabaseMembershipPlan[];
  membershipLoading: boolean;
  refreshMembership: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  tasks: SponsoredTask[];
  submissions: TaskSubmission[];
  transactions: WalletTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  referrals: ReferredUser[];
  referralStat: ReferralStat;
  availableBalance: number;
  pendingRewards: number;
  totalWithdrawn: number;
  lifetimeEarned: number;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: { fullName: string; email: string; phone: string; password?: string; referralCode?: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resendVerificationEmail: (email?: string) => Promise<{ success: boolean; message: string }>;
  submitTaskProof: (taskId: string, proof: { proofUrl?: string; proofUsername?: string; proofNotes?: string }) => { success: boolean; message: string };
  requestWithdrawal: (amount: number, bankName: string, accountNumber: string, accountName: string) => { success: boolean; message: string };
  updateProfile: (updated: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  resetDemoData: () => void;
  loadFreshAccount: () => void;
  loadDemoAccount: () => void;
  isDemoAccount: boolean;
  selectedTaskForSubmission: SponsoredTask | null;
  setSelectedTaskForSubmission: (task: SponsoredTask | null) => void;
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
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
  dbMembership?: DatabaseMembership | null
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

  return {
    id: sbUser.id,
    fullName,
    email,
    phone,
    state: meta.state || 'Lagos State',
    referralCode: meta.referral_code || `NAR-${sbUser.id.slice(0, 4).toUpperCase()}`,
    referredBy: meta.referred_by || undefined,
    membershipTier,
    isEmailVerified: Boolean(sbUser.email_confirmed_at),
    isPhoneVerified: Boolean(sbUser.phone_confirmed_at),
    bankDetails: {
      bankName: '',
      bankCode: '',
      accountNumber: '',
      accountName: fullName,
    },
    createdAt: dbProfile?.created_at 
      ? dbProfile.created_at.split('T')[0] 
      : (sbUser.created_at ? sbUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    isDemoUser: false,
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<ScreenType>('landing');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Database-backed states
  const [dbProfile, setDbProfile] = useState<DatabaseProfile | null>(null);
  const [activeMembership, setActiveMembership] = useState<DatabaseMembership | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<DatabaseMembershipPlan[]>([]);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);

  // Financial and Task States
  const [tasks, setTasks] = useState<SponsoredTask[]>(INITIAL_TASKS);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);

  // Default initial balances: A real member account starts strictly at ₦0.00
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [pendingRewards, setPendingRewards] = useState<number>(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
  const [lifetimeEarned, setLifetimeEarned] = useState<number>(0);

  // Modals & UI helpers
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<SponsoredTask | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  // Protected member-only routes
  const protectedScreens: ScreenType[] = ['dashboard', 'tasks', 'wallet', 'referrals', 'profile', 'membership'];

  const setCurrentScreen = (screen: ScreenType) => {
    if (protectedScreens.includes(screen) && !isAuthenticated) {
      showToast('Authentication required. Please sign in to access the member terminal.');
      setCurrentScreenState('login');
      return;
    }
    setCurrentScreenState(screen);
  };

  // Helper to fetch live database records for a given user
  const fetchUserData = useCallback(async (userId: string, sbUser?: SupabaseAuthUser) => {
    if (!isSupabaseConfigured) return;
    setMembershipLoading(true);

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

      // 2. Fetch public.memberships (latest record for this user to inspect active vs expired)
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
        // Fallback placeholder representing the inactive Premium model
        setMembershipPlans([
          {
            id: 'premium-plan-seed',
            name: 'Premium Member',
            description: 'Exclusive high-tier campaigns, premium sponsorship rates, priority task audit windows, and dedicated settlement pipelines.',
            price_kobo: 0,
            duration_days: null,
            is_active: false,
            created_at: new Date().toISOString(),
          }
        ]);
      }

      // 4. Update combined profile state if auth user provided
      if (sbUser) {
        const fullProfile = mapSupabaseDataToProfile(
          sbUser, 
          pData as DatabaseProfile | null, 
          mData as DatabaseMembership | null
        );
        setUser(fullProfile);
      }
    } catch (err) {
      console.warn('Unexpected error during fetchUserData:', err);
    } finally {
      setMembershipLoading(false);
    }
  }, []);

  // Public methods to refresh data
  const refreshMembership = useCallback(async () => {
    if (!user || user.isDemoUser) return;
    await fetchUserData(user.id);
  }, [user, fetchUserData]);

  const refreshProfile = useCallback(async () => {
    if (!user || user.isDemoUser) return;
    await fetchUserData(user.id);
  }, [user, fetchUserData]);

  // 1. Initial Session Restoration & Supabase Auth Listener
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) setAuthLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase auth getSession error:', error.message);
        }

        if (session?.user && isMounted) {
          setIsAuthenticated(true);
          await fetchUserData(session.user.id, session.user);

          // Genuine accounts start strictly at clean ₦0.00
          setAvailableBalance(0);
          setPendingRewards(0);
          setTotalWithdrawn(0);
          setLifetimeEarned(0);
        }
      } catch (err) {
        console.warn('Failed to restore Supabase session:', err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setIsAuthenticated(true);
          await fetchUserData(session.user.id, session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setDbProfile(null);
        setActiveMembership(null);
        setIsAuthenticated(false);
        setAvailableBalance(0);
        setPendingRewards(0);
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
  }, [fetchUserData]);

  // 2. Route protection check when auth state resolves
  useEffect(() => {
    if (!authLoading && !isAuthenticated && protectedScreens.includes(currentScreen)) {
      setCurrentScreenState('login');
    }
  }, [authLoading, isAuthenticated, currentScreen]);

  // Login via Supabase Auth
  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        setIsAuthenticated(true);
        await fetchUserData(data.user.id, data.user);

        // Genuine accounts start at ₦0.00
        setAvailableBalance(0);
        setPendingRewards(0);
        setTotalWithdrawn(0);
        setLifetimeEarned(0);

        showToast('Signed in successfully to NARIVO Member Portal.');
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

  // Register via Supabase Auth (Profile only through DB trigger, zero free memberships)
  const register = async (data: { 
    fullName: string; 
    email: string; 
    phone: string; 
    password?: string; 
    referralCode?: string 
  }): Promise<AuthResponse> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase credentials are not configured.',
      };
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
        return {
          success: false,
          error: error.message,
        };
      }

      // Check if user already exists
      if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
        return {
          success: false,
          error: 'An account with this email address is already registered. Please log in instead.',
        };
      }

      if (authData.user) {
        const needsVerification = !authData.user.email_confirmed_at;
        
        // If session created immediately (auto-confirm enabled)
        if (authData.session) {
          setIsAuthenticated(true);
          await fetchUserData(authData.user.id, authData.user);
          setAvailableBalance(0);
          setPendingRewards(0);
          setTotalWithdrawn(0);
          setLifetimeEarned(0);
          setCurrentScreenState('dashboard');
        }

        return {
          success: true,
          needsEmailVerification: needsVerification,
        };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || 'An unexpected error occurred during registration.' 
      };
    }
  };

  // Sign out via Supabase Auth
  const logout = async () => {
    if (user?.isDemoUser) {
      setUser(null);
      setDbProfile(null);
      setActiveMembership(null);
      setIsAuthenticated(false);
      setCurrentScreenState('landing');
      showToast('Signed out of demo session.');
      return;
    }

    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Error during signOut:', err);
    } finally {
      setUser(null);
      setDbProfile(null);
      setActiveMembership(null);
      setIsAuthenticated(false);
      setCurrentScreenState('landing');
      showToast('Signed out of member session.');
    }
  };

  // Resend verification email
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

  // Update Profile connected directly to public.profiles
  const updateProfile = async (updated: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'No user signed in' };

    const merged = { ...user, ...updated };
    setUser(merged);

    if (!user.isDemoUser && isSupabaseConfigured) {
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
          showToast(`Database profile sync notice: ${error.message}`);
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

  // Task proof submission
  const submitTaskProof = (
    taskId: string, 
    proof: { proofUrl?: string; proofUsername?: string; proofNotes?: string }
  ) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return { success: false, message: 'Task not found.' };
    }

    const existing = submissions.find(s => s.taskId === taskId && s.status === 'pending_review');
    if (existing) {
      return { success: false, message: 'You already submitted proof for this task. It is pending sponsor review.' };
    }

    const newSub: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      sponsorName: task.sponsorName,
      userId: user?.id || 'usr-guest',
      rewardNaira: task.rewardNaira,
      proofUrl: proof.proofUrl,
      proofUsername: proof.proofUsername,
      proofNotes: proof.proofNotes,
      submittedAt: new Date().toLocaleString(),
      status: 'pending_review',
    };

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: user?.id || 'usr-guest',
      type: 'task_reward',
      title: `Task Submission: ${task.title}`,
      amountNaira: task.rewardNaira,
      status: 'pending',
      reference: `NAR-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString(),
      notes: `Submitted for sponsor verification (${task.verificationWindowHours}h audit window).`,
      isDemoData: Boolean(user?.isDemoUser),
    };

    setSubmissions(prev => [newSub, ...prev]);
    setTransactions(prev => [newTx, ...prev]);
    setPendingRewards(prev => prev + task.rewardNaira);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, remainingSlots: Math.max(0, t.remainingSlots - 1) } : t));

    showToast(`Task submitted! ₦${task.rewardNaira.toLocaleString()} queued in Pending Rewards.`);
    return { success: true, message: 'Task submitted for verification.' };
  };

  // Withdrawal Request simulation
  const requestWithdrawal = (
    amount: number, 
    bankName: string, 
    accountNumber: string, 
    accountName: string
  ) => {
    if (amount < 5000) {
      return { success: false, message: 'Minimum withdrawal preference is ₦5,000 as per platform policy.' };
    }
    if (amount > availableBalance) {
      return { success: false, message: `Insufficient available balance. You currently have ₦${availableBalance.toLocaleString()} available.` };
    }
    if (!accountNumber || accountNumber.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit Nigerian NUBAN account number.' };
    }
    if (!bankName) {
      return { success: false, message: 'Please select a recipient Nigerian bank.' };
    }

    const ref = `DEMO-WD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newWd: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      userId: user?.id || 'usr-guest',
      amountNaira: amount,
      bankName,
      accountNumber,
      accountName: accountName || 'VERIFIED BENEFICIARY',
      status: 'processing',
      reference: ref,
      requestedAt: new Date().toLocaleString(),
      isDemoSimulation: true,
    };

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      userId: user?.id || 'usr-guest',
      type: 'withdrawal',
      title: `Simulated Payout Request to ${bankName} (${accountNumber.slice(0, 3)}****${accountNumber.slice(-3)})`,
      amountNaira: amount,
      status: 'processing',
      reference: ref,
      date: new Date().toLocaleString(),
      notes: 'DEMO DATA: Simulated withdrawal test in sandbox mode. No actual banking transfer has been completed.',
      isDemoData: true,
    };

    setAvailableBalance(prev => prev - amount);
    setTotalWithdrawn(prev => prev + amount);
    setWithdrawalRequests(prev => [newWd, ...prev]);
    setTransactions(prev => [newTx, ...prev]);

    showToast(`Simulated withdrawal of ₦${amount.toLocaleString()} queued for review.`);
    return { success: true, message: 'Withdrawal request simulated successfully.' };
  };

  const isDemoAccount = Boolean(user?.isDemoUser);
  const isEmailVerified = Boolean(user?.isEmailVerified);

  const isUserMembershipActive = checkMembershipIsActive(activeMembership);
  const isUserMembershipExpired = checkMembershipIsExpired(activeMembership);

  const loadFreshAccount = () => {
    setUser({ ...INITIAL_USER, membershipTier: 'Registered — No Active Membership', isDemoUser: false });
    setDbProfile(null);
    setActiveMembership(null);
    setIsAuthenticated(true);
    setAvailableBalance(0);
    setPendingRewards(0);
    setTotalWithdrawn(0);
    setLifetimeEarned(0);
    setSubmissions([]);
    setTransactions([]);
    setWithdrawalRequests([]);
    setReferrals([]);
    showToast('Switched to clean member account (₦0.00 balance, Registered — No Active Membership).');
  };

  const loadDemoAccount = () => {
    setUser({ ...SAMPLE_DEMO_USER, membershipTier: 'Registered — No Active Membership' });
    setDbProfile(null);
    setActiveMembership(null);
    setIsAuthenticated(true);
    setTasks(INITIAL_TASKS);
    setSubmissions([
      {
        id: 'sub-sample-01',
        taskId: 'task-005',
        taskTitle: 'Product Review: Share Honest Feedback on EcoClean Laundry App',
        sponsorName: 'EcoClean On-Demand',
        userId: 'usr-demo-84291',
        rewardNaira: 1200,
        proofUsername: 'JusticeReviewerNG',
        proofNotes: 'Play Store 5-star constructive review published Oct 30.',
        submittedAt: '2026-10-30 08:30',
        status: 'pending_review',
      }
    ]);
    setTransactions(INITIAL_TRANSACTIONS);
    setWithdrawalRequests([
      {
        id: 'wd-001',
        userId: 'usr-demo-84291',
        amountNaira: 5000,
        bankName: 'Guaranty Trust Bank (GTBank)',
        accountNumber: '0248819284',
        accountName: 'JUSTICE CHIDIEBERE OKOYE',
        status: 'processing',
        reference: 'DEMO-WD-640192',
        requestedAt: '2026-10-30 10:45',
        isDemoSimulation: true,
      }
    ]);
    setReferrals(INITIAL_REFERRED_USERS);
    setAvailableBalance(5500);
    setPendingRewards(1200);
    setTotalWithdrawn(0);
    setLifetimeEarned(6700);
    showToast('Loaded sample demo sandbox data (₦5,500.00 DEMO balance).');
  };

  const resetDemoData = () => {
    if (user?.isDemoUser) {
      loadDemoAccount();
    } else {
      loadFreshAccount();
    }
  };

  const referralStat: ReferralStat = {
    totalClicks: isDemoAccount ? 28 : 0,
    registeredCount: referrals.length,
    activeEarnersCount: referrals.filter(r => r.status === 'Active').length,
    totalEarnedNaira: referrals.reduce((sum, r) => sum + r.commissionEarnedNaira, 0),
    referralCode: user?.referralCode || 'NAR-9428',
    referralLink: `https://narivo.com/register?ref=${user?.referralCode || 'NAR-9428'}`,
  };

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
        refreshMembership,
        refreshProfile,
        tasks,
        submissions,
        transactions,
        withdrawalRequests,
        referrals,
        referralStat,
        availableBalance,
        pendingRewards,
        totalWithdrawn,
        lifetimeEarned,
        login,
        register,
        logout,
        resendVerificationEmail,
        submitTaskProof,
        requestWithdrawal,
        updateProfile,
        resetDemoData,
        loadFreshAccount,
        loadDemoAccount,
        isDemoAccount,
        selectedTaskForSubmission,
        setSelectedTaskForSubmission,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        toastMessage,
        showToast,
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
