export type UserRole = 'member' | 'advertiser' | 'admin';

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
  bankDetails: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  createdAt: string;
  isDemoUser?: boolean;
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
  category: TaskCategory;
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
  isSampleData: boolean;
  campaignType: 'sample_demo' | 'verified_sponsor';
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

export type TransactionType = 'task_reward' | 'referral_bonus' | 'withdrawal' | 'adjustment';
export type TransactionStatus = 'approved' | 'pending' | 'processing' | 'failed';

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
  status: 'processing' | 'completed' | 'declined';
  reference: string;
  requestedAt: string;
  processedAt?: string;
  isDemoSimulation?: boolean;
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
  status: 'Active' | 'Pending First Task';
  commissionEarnedNaira: number;
}
