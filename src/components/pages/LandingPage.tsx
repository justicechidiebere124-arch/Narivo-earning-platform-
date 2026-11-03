/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  ChevronDown,
  Lock,
  ArrowUpRight,
  Crown,
  FileCheck2,
  Clock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated, isMembershipActive } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is registration on NARIVO free?",
      answer: "Yes. Creating an account is completely free. New registrations create a verified profile without mandatory upfront subscription fees or hidden onboarding charges."
    },
    {
      question: "How do members earn rewards?",
      answer: "Members access eligible brand campaigns such as mobile app testing, consumer surveys, and content amplification. Rewards are credited in Nigerian Naira once submitted proof is reviewed and approved by the sponsor."
    },
    {
      question: "Are income or earnings guaranteed?",
      answer: "No. Task availability and payouts depend entirely on genuine advertiser campaigns, budget limits, and successful compliance with task instructions. NARIVO does not offer investment schemes or guaranteed income."
    },
    {
      question: "What is the minimum bank withdrawal threshold?",
      answer: "The platform enforces a minimum withdrawal threshold of ₦5,000.00. Approved withdrawals are transferred directly to valid 10-digit NUBAN accounts at licensed Nigerian commercial banks."
    },
    {
      question: "What is Premium membership?",
      answer: "Premium is an upcoming platform tier providing priority access to high-value campaigns and expedited verification windows. Premium registration is currently inactive while pricing and duration are finalized."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* State Banner / Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {isAuthenticated ? (
            isMembershipActive ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-emerald-400" />
                Active Premium Session
              </span>
            ) : (
              <span className="text-slate-300 font-medium">
                Registered Member Session Active
              </span>
            )
          ) : (
            <span className="text-slate-400">
              Nigerian Sponsored-Task Exchange
            </span>
          )}
        </div>

        {/* Clear Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] font-heading max-w-4xl mx-auto">
          Monetize Real Human Engagement. Earn In <span className="text-emerald-400">Naira (₦).</span>
        </h1>

        {/* One Concise Supporting Sentence */}
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          NARIVO connects verified Nigerian smartphone users with authentic advertiser campaigns to test applications, provide consumer feedback, and withdraw approved rewards to your bank.
        </p>

        {/* Primary Action Buttons Based on Auth State */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl btn-emerald-primary text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <span>Open Member Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentScreen('tasks')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white font-bold text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Tasks</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentScreen('register')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl btn-emerald-primary text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentScreen('login')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white font-bold text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Log In</span>
              </button>
            </>
          )}
        </div>

        {/* Platform Integrity Indicators */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free Registration</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Brand Campaigns</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>10-Digit NUBAN Settlement</span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 CONCISE STEPS) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
            How NARIVO Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A straightforward 3-step lifecycle for Nigerian smartphone users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              Select Available Tasks
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore eligible brand campaigns including app onboarding testing, consumer surveys, and verified content reviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              Submit Evidence & Audit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your verification proof or completion code. Tasks are audited within the sponsor's 12–48 hour verification window.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              Withdraw In Naira
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once approved, rewards move to your available balance. Request bank payouts starting at ₦5,000 directly to your commercial bank.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM BENEFITS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090f15] border border-white/[0.08] space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
              Platform Standards
            </h2>
            <p className="text-xs text-slate-400">
              Built on transparency, financial accuracy, and strict anti-fraud review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <span className="font-bold text-white block">Genuine Sponsored Campaigns</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All rewards originate from active corporate brand campaigns with dedicated budgets.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <span className="font-bold text-white block">Strict Proof Audit</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Zero spam tolerance. Each task submission is reviewed against sponsor criteria before reward unlock.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <span className="font-bold text-white block">Direct Nigerian Banking</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Compatible with all licensed commercial banks and financial institutions across Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONCISE FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear facts about registration, tasks, and payouts.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/30 text-center space-y-5 shadow-[0_20px_50px_rgba(2,44,30,0.5)]">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Ready to Begin?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Register your free account in under 60 seconds and explore available sponsored opportunities.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentScreen(isAuthenticated ? 'dashboard' : 'register')}
              className="px-8 py-3.5 rounded-xl btn-emerald-primary text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>{isAuthenticated ? 'Open Member Dashboard' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
