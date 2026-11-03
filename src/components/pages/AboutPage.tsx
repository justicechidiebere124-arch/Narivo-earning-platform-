/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { 
  ShieldCheck, 
  Target, 
  Users, 
  Building2, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Banknote
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useApp();

  usePageSeo({
    title: 'About NARIVO – Sponsored Task Marketplace in Nigeria',
    description: 'Learn about NARIVO, Nigeria’s transparent sponsored-task marketplace connecting verified Nigerian members with genuine advertiser-funded campaigns and digital opportunities.',
    canonicalPath: '/about',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header / Breadcrumb */}
      <div className="space-y-3 text-center sm:text-left border-b border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>About Our Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          Connecting Nigerian Talent with Verified Sponsored Tasks
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          NARIVO is a Nigerian sponsored-task marketplace designed to connect members with genuine advertiser-funded campaigns, app testing opportunities, consumer research and feedback activities.
        </p>
      </div>

      {/* 2. Platform Purpose & Mission */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <span>Our Purpose & Mission</span>
        </h2>
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/[0.08] space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            In today’s expanding digital economy, brands, software developers, and research organizations require authentic human engagement to evaluate user experiences, validate software usability, and gather real-world consumer opinions.
          </p>
          <p>
            NARIVO was established to provide a structured, transparent bridge between corporate sponsors and verified Nigerian smartphone users. We replace ambiguous click farms and deceptive schemes with a clear, accountable engagement marketplace where real tasks receive fair, approved rewards.
          </p>
        </div>
      </section>

      {/* 3. The Operating Model */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span>How the Operating Model Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">For Nigerian Members</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registration is completely free. Members create a profile, browse active sponsored campaigns, carefully follow step-by-step instructions, and submit genuine proof of completion. Once audited and approved, rewards are credited in Nigerian Naira (₦) to their member wallet.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">For Corporate Advertisers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Advertisers allocate dedicated budgets to fund specific campaigns—such as testing application onboarding, participating in product usability studies, or evaluating digital content. Every submission is auditable before rewards are released.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Principles & Platform Integrity */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Our Integrity Standards</span>
        </h2>
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090f15] border border-white/[0.08] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero False Promises</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never promise guaranteed daily income, passive investment returns, or unrealistic earnings. Tasks depend strictly on active brand budgets.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>Proof Audit Standards</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero tolerance for fraudulent entries, automated bots, or manipulated screenshots. Real human participation protects sponsor integrity and member payouts.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Banknote className="w-4 h-4 shrink-0" />
                <span>₦5,000 Payout Rule</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Members with approved available balances of ₦5,000.00 or higher can request withdrawal to any valid Nigerian commercial bank account under manual administrative review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Intended Audience */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
          Who NARIVO Is Built For
        </h2>
        <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/[0.08] space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            NARIVO is designed specifically for Nigerian smartphone users who want to monetize their active attention and digital feedback. Whether you are a student, freelancer, professional, or tech enthusiast, our marketplace provides accessible, verified digital tasks with transparent Naira settlement.
          </p>
        </div>
      </section>

      {/* 6. Call to Action */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/30 text-center space-y-4 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
          Ready to Explore Digital Opportunities?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          Create your verified profile for free and discover genuine advertiser campaigns in Nigeria.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentScreen(isAuthenticated ? 'dashboard' : 'register')}
            className="px-7 py-3 rounded-xl btn-emerald-primary text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            <span>{isAuthenticated ? 'Open Member Dashboard' : 'Register Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
