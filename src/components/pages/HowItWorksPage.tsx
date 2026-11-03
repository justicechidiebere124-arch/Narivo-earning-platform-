/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { 
  UserCheck, 
  Search, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  Banknote, 
  ArrowRight,
  ShieldAlert,
  Crown,
  Users2
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useApp();

  usePageSeo({
    title: 'How It Works – NARIVO Sponsored Task Marketplace Nigeria',
    description: 'Learn how to register for free, browse verified sponsored tasks, submit completion proof for audit, and withdraw approved Naira rewards to Nigerian bank accounts.',
    canonicalPath: '/how-it-works',
  });

  const steps = [
    {
      step: '01',
      title: 'Free Account Registration',
      icon: UserCheck,
      description: 'Creating an account on NARIVO is completely free. Every registration creates a profile in our database without upfront fees, mandatory subscription charges, or hidden onboarding costs. Verify your email to activate full account access.',
      badge: '100% Free Registration',
    },
    {
      step: '02',
      title: 'Membership & Tier Structure',
      icon: Crown,
      description: 'Registration creates a verified member profile. NARIVO includes an upcoming Premium membership tier (30-day active period) designed to unlock priority campaign access and expedited verification. Note: Premium plan pricing is currently unconfigured and inactive while being finalized. You can participate in all open marketplace activities without paying any subscription fees today.',
      badge: 'Transparent Tier Model',
    },
    {
      step: '03',
      title: 'Explore Genuine Sponsored Campaigns',
      icon: Search,
      description: 'Browse the campaign directory to find opportunities funded by real advertisers. Tasks include mobile app onboarding feedback, software testing, user experience surveys, and digital brand engagement. Only active campaigns with live budgets are listed.',
      badge: 'Verified Opportunities',
    },
    {
      step: '04',
      title: 'Follow Instructions & Submit Genuine Proof',
      icon: FileCheck2,
      description: 'Each sponsored campaign provides explicit step-by-step instructions and proof requirements (such as a completion screenshot, verification link, or unique code). Submit your genuine proof before the campaign window closes.',
      badge: 'Zero Spam Tolerance',
    },
    {
      step: '05',
      title: 'Rigorous Verification & Audit Windows',
      icon: Clock,
      description: 'To protect advertiser budgets and ensure honesty, submitted proofs undergo an audit period (typically 12 to 48 hours). Submissions meeting all criteria are approved; fraudulent, duplicate, or incomplete entries are rejected.',
      badge: '12–48h Audit Standard',
    },
    {
      step: '06',
      title: 'Approved Rewards Credited in Naira (₦)',
      icon: CheckCircle2,
      description: 'Upon verification approval, task rewards are automatically released into your available wallet balance in Nigerian Naira. Your wallet ledger records all credits and transactions transparently.',
      badge: 'Transparent Ledger',
    },
    {
      step: '07',
      title: 'Manual Review & Bank Withdrawal Process',
      icon: Banknote,
      description: 'When your available balance reaches ₦5,000.00, you can submit a withdrawal request directly to any 10-digit NUBAN account at a licensed Nigerian commercial bank. Withdrawal requests are placed in an administrative queue for compliance review and processed via bank transfer. Payment is only marked complete once confirmed.',
      badge: '₦5,000 Minimum Payout',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Platform Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          How NARIVO Works: Step-by-Step
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          From free member registration to verified task audit and bank withdrawal: an honest, transparent overview of our operational flow.
        </p>
      </div>

      {/* 2. Step-by-step timeline */}
      <div className="space-y-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div 
              key={idx}
              className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-black text-base flex items-center justify-center shrink-0">
                {s.step}
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                    {s.title}
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {s.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Important Disclosures Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090f15] border border-amber-500/25 space-y-4">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-heading">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
          <span>Important Operating Policies & Disclosures</span>
        </div>
        <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
            <span><strong>No Guaranteed Income:</strong> NARIVO is not an investment scheme, high-yield program, or employer. Payouts are strictly earned per approved task from advertiser budgets.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
            <span><strong>Semi-Automated Withdrawals:</strong> At launch, all bank withdrawal requests undergo human administrative review to prevent fraud and money laundering before manual bank disbursement.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
            <span><strong>Referral Programme:</strong> Invitation codes are provided to all members. Specific referral commission rates and qualification criteria will be officially announced when the program is activated.</span>
          </li>
        </ul>
      </div>

      {/* 4. Call to Action */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/30 text-center space-y-4 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
          Start Participating Today
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Join verified Nigerian members completing digital tasks and consumer research campaigns.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentScreen(isAuthenticated ? 'dashboard' : 'register')}
            className="px-7 py-3 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <span>{isAuthenticated ? 'Open Member Dashboard' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
