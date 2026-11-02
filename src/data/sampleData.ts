import { SponsoredTask, UserProfile, WalletTransaction, ReferredUser } from '../types';

export const NIGERIAN_BANKS = [
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '044', name: 'Access Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '999992', name: 'OPay Digital Services' },
  { code: '999991', name: 'Palmpay' },
  { code: '090267', name: 'Kuda Microfinance Bank' },
  { code: '090405', name: 'Moniepoint Microfinance Bank' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '035', name: 'Wema Bank / ALAT' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-member-84291',
  fullName: 'Justice Chidiebere',
  email: 'justicechidiebere124@gmail.com',
  phone: '+234 812 490 2814',
  state: 'Lagos State',
  referralCode: 'NAR-9428',
  referredBy: 'NAR-1002',
  membershipTier: 'Registered — No Active Membership',
  isEmailVerified: true,
  isPhoneVerified: true,
  isDemoUser: false,
  bankDetails: {
    bankName: 'Guaranty Trust Bank (GTBank)',
    bankCode: '058',
    accountNumber: '0248819284',
    accountName: 'JUSTICE CHIDIEBERE OKOYE',
  },
  createdAt: '2026-10-30',
};

export const SAMPLE_DEMO_USER: UserProfile = {
  ...INITIAL_USER,
  id: 'usr-demo-84291',
  fullName: 'Justice Chidiebere (Demo)',
  isDemoUser: true,
};

// Active sponsored campaigns catalog
export const INITIAL_TASKS: SponsoredTask[] = [
  {
    id: 'task-001',
    title: 'App Testing: Install & Verify Onboarding on PayVantage',
    category: 'App Testing',
    sponsorName: 'PayVantage FinTech NG',
    rewardNaira: 850,
    totalSlots: 250,
    remainingSlots: 84,
    estimatedMinutes: 6,
    isSampleData: false,
    campaignType: 'verified_sponsor',
    instructions: [
      'Download or open the designated testing link provided in the brief.',
      'Complete regular sign-up steps using your active Nigerian phone or email.',
      'Reach the main home dashboard and take an uncropped screenshot showing your username/dashboard.',
      'Upload the screenshot proof below along with your registered app email.'
    ],
    proofRequirements: {
      type: 'multiple',
      description: 'Upload 1 screenshot of the welcome dashboard + enter registered account email.'
    },
    verificationWindowHours: 24,
    status: 'active',
    createdAt: '2026-10-25',
  },
  {
    id: 'task-002',
    title: 'Market Survey: Lagos SME Digital Payment Preference (10 Qs)',
    category: 'Surveys & Feedback',
    sponsorName: 'Consumer Insights West Africa',
    rewardNaira: 650,
    totalSlots: 500,
    remainingSlots: 172,
    estimatedMinutes: 5,
    isSampleData: false,
    campaignType: 'verified_sponsor',
    instructions: [
      'Open the official survey link and read each of the 10 questions carefully.',
      'Provide your honest business or consumer payment habits (POS, USSD, Transfer).',
      'At the survey completion page, copy the generated unique Completion Code.',
      'Paste the unique code in the submission form below.'
    ],
    proofRequirements: {
      type: 'username',
      description: 'Unique 8-character survey completion code generated at the final screen.'
    },
    verificationWindowHours: 12,
    status: 'active',
    createdAt: '2026-10-26',
  },
  {
    id: 'task-003',
    title: 'Social Engagement: Follow & Comment on Apex Motors NG Launch',
    category: 'Social Engagement',
    sponsorName: 'Apex Motors Nigeria',
    rewardNaira: 350,
    totalSlots: 300,
    remainingSlots: 95,
    estimatedMinutes: 3,
    isSampleData: false,
    campaignType: 'verified_sponsor',
    instructions: [
      'Visit the official Instagram handle @ApexMotorsNG.',
      'Follow the account and like the latest pinned announcement post.',
      'Leave an authentic, relevant comment regarding their EV test-drive in Lagos.',
      'Submit your Instagram @handle for verification.'
    ],
    proofRequirements: {
      type: 'username',
      description: 'Your public Instagram username used to post the comment.'
    },
    verificationWindowHours: 24,
    status: 'active',
    createdAt: '2026-10-27',
  },
  {
    id: 'task-004',
    title: 'Channel Follow: Join AgroConnect Nigeria Telegram Announcements',
    category: 'Channel Follow',
    sponsorName: 'AgroConnect AgriTech',
    rewardNaira: 300,
    totalSlots: 400,
    remainingSlots: 218,
    estimatedMinutes: 2,
    isSampleData: false,
    campaignType: 'verified_sponsor',
    instructions: [
      'Click the verified Telegram invitation channel link.',
      'Join the public community broadcast channel.',
      'Remain subscribed for at least 7 days to pass automated audit.',
      'Submit your Telegram username/handle.'
    ],
    proofRequirements: {
      type: 'username',
      description: 'Telegram @handle used to join the channel.'
    },
    verificationWindowHours: 12,
    status: 'active',
    createdAt: '2026-10-28',
  },
  {
    id: 'task-005',
    title: 'Product Review: Share Honest Feedback on EcoClean Laundry App',
    category: 'Surveys & Feedback',
    sponsorName: 'EcoClean On-Demand',
    rewardNaira: 1200,
    totalSlots: 100,
    remainingSlots: 26,
    estimatedMinutes: 8,
    isSampleData: false,
    campaignType: 'verified_sponsor',
    instructions: [
      'Open the Android Google Play Store listing for EcoClean NG.',
      'Rate the service objectively and write at least 3 constructive sentences about the booking experience.',
      'Take a screenshot of your published review.',
      'Submit the screenshot and the reviewer profile name.'
    ],
    proofRequirements: {
      type: 'screenshot',
      description: 'Screenshot showing your published Play Store review with visible username.'
    },
    verificationWindowHours: 48,
    status: 'active',
    createdAt: '2026-10-28',
  },
  {
    id: 'task-006',
    title: 'Content Creation: 30-Sec Reel on Student Study Hacks',
    category: 'Content Creation',
    sponsorName: 'BrainSpark EdTech',
    rewardNaira: 2800,
    totalSlots: 50,
    remainingSlots: 14,
    estimatedMinutes: 15,
    isSampleData: false,
    campaignType: 'verified_sponsor',
    instructions: [
      'Create a brief 30-45 second short video or reel showcasing how you organize study notes.',
      'Mention BrainSpark study assistant naturally or show the study plan screen.',
      'Include hashtag #BrainSparkNG in your video description.',
      'Submit the direct public video URL.'
    ],
    proofRequirements: {
      type: 'link',
      description: 'Direct public link to the published TikTok or Instagram Reel.'
    },
    verificationWindowHours: 48,
    status: 'active',
    createdAt: '2026-10-29',
  },
];

// Sample demonstration ledger records - strictly labeled as DEMO DATA
export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-101',
    userId: 'usr-demo-84291',
    type: 'task_reward',
    title: '[DEMO] App Testing Task: PayVantage Onboarding Verified',
    amountNaira: 850,
    status: 'approved',
    reference: 'DEMO-TRX-948102',
    date: '2026-10-28 14:22',
    notes: 'DEMO DATA: Sample approved reward demonstration.',
    isDemoData: true,
  },
  {
    id: 'tx-102',
    userId: 'usr-demo-84291',
    type: 'task_reward',
    title: '[DEMO] Market Survey: Lagos SME Digital Payment Qs',
    amountNaira: 650,
    status: 'approved',
    reference: 'DEMO-TRX-947321',
    date: '2026-10-27 10:15',
    notes: 'DEMO DATA: Sample completion code validation demonstration.',
    isDemoData: true,
  },
  {
    id: 'tx-103',
    userId: 'usr-demo-84291',
    type: 'referral_bonus',
    title: '[DEMO] 1-Level Referral Bonus: Tunde Adeleke First Task',
    amountNaira: 500,
    status: 'approved',
    reference: 'DEMO-REF-884102',
    date: '2026-10-26 19:40',
    notes: 'DEMO DATA: Direct 1-level referral credit demonstration.',
    isDemoData: true,
  },
  {
    id: 'tx-104',
    userId: 'usr-demo-84291',
    type: 'withdrawal',
    title: '[DEMO] Simulated Payout Request to GTBank (0248819284)',
    amountNaira: 5000,
    status: 'processing',
    reference: 'DEMO-WD-640192',
    date: '2026-10-30 11:05',
    notes: 'DEMO DATA: Simulated withdrawal test in sandbox mode. No real money was transferred.',
    isDemoData: true,
  },
  {
    id: 'tx-105',
    userId: 'usr-demo-84291',
    type: 'task_reward',
    title: '[DEMO] Review Task: EcoClean Laundry Play Store Review',
    amountNaira: 1200,
    status: 'pending',
    reference: 'DEMO-TRX-950291',
    date: '2026-10-30 08:30',
    notes: 'DEMO DATA: Sample pending submission under audit.',
    isDemoData: true,
  },
];

export const INITIAL_REFERRED_USERS: ReferredUser[] = [
  {
    id: 'ref-u-01',
    name: 'Tunde Adeleke (Demo User)',
    joinedDate: '2026-10-24',
    status: 'Active',
    commissionEarnedNaira: 500,
  },
  {
    id: 'ref-u-02',
    name: 'Amaka Eze (Demo User)',
    joinedDate: '2026-10-27',
    status: 'Active',
    commissionEarnedNaira: 500,
  },
  {
    id: 'ref-u-03',
    name: 'Ibrahim Danladi (Demo User)',
    joinedDate: '2026-10-29',
    status: 'Pending First Task',
    commissionEarnedNaira: 0,
  },
];
