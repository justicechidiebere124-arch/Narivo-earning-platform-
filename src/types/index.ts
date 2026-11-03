/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'member' | 'advertiser' | 'admin';

// ==========================================
// SUPABASE DATABASE SCHEMAS
// ==========================================

export interface DatabaseProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMembershipPlan {
  id: string;
  name: string;
  description: string | null;
  price_kobo: number;
  duration_days: number | null;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseMembership {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  membership_plans?: DatabaseMembershipPlan;
}

export interface DatabaseMembershipPayment {
  id: string;
  user_id: string;
  membership_id: string;
  payment_provider: string;
  provider_reference: string;
  amount_kobo: number;
  currency: string;
  purchased_plan_name: string;
  purchased_duration_days: number;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  verified_at: string | null;
  created_at: string;
}

export interface DatabaseWalletBalance {
  user_id: string;
  available_kobo: number;
  pending_kobo: number;
  reserved_kobo: number;
}

export interface DatabaseWalletLedger {
  id: string;
  user_id: string;
  amount_kobo: number;
  entry_type: string;
  description: string;
  created_at: string;
}

export interface DatabaseWithdrawalRequest {
  id: string;
  user_id: string;
  amount_kobo: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'rejected' | 'failed';
  created_at: string;
  updated_at?: string;
}

export interface DatabaseSponsoredCampaign {
  id: string;
  title: string;
  description?: string;
  status: string;
  starts_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface DatabaseSponsoredTask {
  id: string;
  campaign_id?: string;
  title: string;
  description?: string;
  reward_kobo: number;
  instructions?: string | string[];
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at?: string;
  sponsored_campaigns?: DatabaseSponsoredCampaign;
}

export interface DatabaseTaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  status: 'pending_review' | 'approved' | 'rejected';
  proof_url?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at?: string;
  sponsored_tasks?: DatabaseSponsoredTask;
}

export interface DatabaseReferralCode {
  id: string;
  user_id: string;
  code: string;
  created_at: string;
  is_active: boolean;
}

export interface DatabaseReferral {
  id: string;
  referral_code_id: string;
  referred_user_id: string;
  status: string;
  commission_kobo: number;
  created_at: string;
}

// ==========================================
// FRONTEND MODEL TYPES
// ==========================================

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  referralCode: string;
  referredBy?: string;
  membershipTier: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isDemoUser?: boolean;
  bankDetails: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  createdAt: string;
}

export type TaskCategory = 
  | 'All'
  | 'Social Engagement'
  | 'App Testing'
  | 'Surveys & Feedback'
  | 'Content Creation'
  | 'Channel Follow';

export interface SponsoredTask {
  id: string;
  title: string;
  category: string;
  sponsorName: string;
  sponsorLogoUrl?: string;
  rewardNaira: number;
  totalSlots: number;
  remainingSlots: number;
  estimatedMinutes: number;
  instructions: string[];
  proofRequirements: {
    type: 'screenshot' | 'link' | 'username' | 'multiple';
    description: string;
  };
  verificationWindowHours: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  campaignType: 'verified_sponsor';
  isSampleData?: boolean;
}

export type SubmissionStatus = 'pending_review' | 'approved' | 'rejected';

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  sponsorName: string;
  userId: string;
  rewardNaira: number;
  proofUrl?: string;
  proofUsername?: string;
  proofNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  status: SubmissionStatus;
  rejectionReason?: string;
}

export type TransactionType = 'task_reward' | 'referral_bonus' | 'withdrawal' | 'adjustment' | string;
export type TransactionStatus = 'approved' | 'pending' | 'processing' | 'failed' | 'paid' | 'rejected' | string;

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  title: string;
  amountNaira: number;
  status: TransactionStatus;
  reference: string;
  date: string;
  notes?: string;
  isDemoData?: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountNaira: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'rejected' | 'failed';
  reference: string;
  requestedAt: string;
  processedAt?: string;
}

export interface ReferralStat {
  totalClicks: number;
  registeredCount: number;
  activeEarnersCount: number;
  totalEarnedNaira: number;
  referralCode: string;
  referralLink: string;
}

export interface ReferredUser {
  id: string;
  name: string;
  joinedDate: string;
  status: string;
  commissionEarnedNaira: number;
}
