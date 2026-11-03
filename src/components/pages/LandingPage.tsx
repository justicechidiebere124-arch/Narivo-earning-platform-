/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { formatNaira } from '../../utils/formatters';
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
  Clock,
  Banknote,
  Search,
  HelpCircle,
  FileText,
  Mail,
  AlertCircle,
  RotateCw
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentScreen, 
    isAuthenticated, 
    isMembershipActive,
    tasks,
    tasksLoading,
    tasksError,
    refreshAllData,
    setSelectedTaskForSubmission
  } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  usePageSeo({
    title: 'NARIVO – Sponsored Tasks and Digital Opportunities in Nigeria',
    description: 'NARIVO connects Nigerian users with sponsored tasks, app testing opportunities and consumer feedback campaigns. Explore available campaigns, submit task entries for review and track approved rewards transparently.',
    canonicalPath: '/',
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is registration on NARIVO free?",
      answer: "Yes. Account registration is 100% free. Every new registration creates a verified member profile in our database without mandatory subscription fees or hidden onboarding charges."
    },
    {
      question: "Are income or task availability guaranteed?",
      answer: "No. NARIVO does not promise guaranteed daily income, minimum earnings, or perpetual task availability. Opportunities and payouts depend strictly on genuine advertiser budgets, campaign duration, and verified compliance with instructions."
    },
    {
      question: "What is the Premium membership model?",
      answer: "Premium is an upcoming membership tier providing 30 days of active access to priority campaign slots and expedited verification. Currently, the Premium price is unconfigured and the tier remains inactive while being prepared. You cannot purchase an inactive plan."
    },
    {
      question: "How do bank withdrawals work?",
      answer: "The minimum withdrawal threshold is ₦5,000.00. Members with sufficient available balance can submit a withdrawal request to their valid 10-digit Nigerian NUBAN account. All requests undergo human administrative review and bank transfers are processed manually at launch. Payment is only complete once the transfer is confirmed."
    },
    {
      question: "How does the referral programme work?",
      answer: "Every registered member receives a unique invitation code. Referral reward rates, eligibility criteria, and conditions will be published once the referral programme is officially activated by platform administrators."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        {/* Platform Status Badge */}
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
            <span className="text-slate-400 font-medium">
              Nigerian Sponsored-Task Marketplace
            </span>
          )}
        </div>

        {/* Official Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] font-heading max-w-4xl mx-auto">
          Discover Sponsored Tasks and Digital Opportunities.
        </h1>

        {/* Official Supporting Text */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Explore advertiser-funded campaigns, complete genuine tasks and track approved rewards through your NARIVO account.
        </p>

        {/* Primary Call-to-Action Buttons */}
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
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentScreen('how-it-works')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white font-bold text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore NARIVO</span>
              </button>
            </>
          )}
        </div>

        {/* Platform Integrity Indicators */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Free Registration</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Advertiser-Funded Campaigns</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>₦5,000 Minimum Payout Threshold</span>
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
            A transparent 3-step lifecycle connecting members to genuine campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              1. Explore Real Campaigns
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse available tasks sponsored by authentic advertisers, including mobile app testing, consumer surveys, and digital feedback activities.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              2. Follow Steps & Submit Proof
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete the exact instructions specified by the sponsor and submit required proof (screenshot or verification URL) for audit.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-white font-heading">
              3. Audit Review & Bank Transfer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Approved tasks credit your available wallet in Naira. Members with at least ₦5,000 can request bank payout via Nigerian commercial bank accounts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LIVE SPONSORED CAMPAIGN PREVIEW (LIVE SUPABASE DATA ONLY) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Live Database Preview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Current Sponsored Campaigns
            </h2>
          </div>
          <button
            onClick={() => setCurrentScreen('tasks')}
            className="self-start sm:self-auto text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Marketplace Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {tasksLoading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <RotateCw className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Querying active campaigns from database...</span>
          </div>
        ) : tasksError ? (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Unable to query active campaigns at this moment.</span>
            </div>
            <button
              onClick={() => refreshAllData()}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center space-y-3 border border-white/[0.08]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                No sponsored tasks are available right now. Please check back later for new opportunities.
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                New campaign allocations are published directly by verified corporate sponsors. Register your free account to receive updates when opportunities launch.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.slice(0, 4).map((task) => (
              <div 
                key={task.id}
                className="p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                    {task.sponsorName}
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {task.instructions[0] || 'Follow the verified campaign instructions provided.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-sm sm:text-base font-mono font-black text-emerald-400">
                    {formatNaira(task.rewardNaira)}
                  </span>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setCurrentScreen('login');
                      } else {
                        setSelectedTaskForSubmission(task);
                        setCurrentScreen('tasks');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg btn-emerald-primary text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    View Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. TRANSPARENT MEMBERSHIP MODEL */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Platform Membership Structure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Honest tier classification. No hidden charges or fabricated subscription prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registered Member (Free) */}
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Standard Tier</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Active & Free
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-heading">Registered Member</h3>
              <div className="text-2xl font-black font-mono text-white">₦0.00</div>
              <p className="text-xs text-slate-400">100% Free Account Registration</p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 border-t border-white/[0.06] pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero registration or monthly maintenance fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Access to open public campaign tasks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Naira wallet balance & manual bank withdrawals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Personal invitation referral link</span>
              </li>
            </ul>
          </div>

          {/* Premium Member (Currently Inactive / Preparing) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#080d12] border border-amber-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Premium Tier
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Inactive / In Preparation
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-heading">Premium Member</h3>
              <div className="text-2xl font-black font-mono text-slate-300">Unconfigured</div>
              <p className="text-xs text-amber-300/80">30-day active period upon official activation</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed border-t border-white/[0.06] pt-3">
              Premium is being prepared to provide priority allocations for high-value research campaigns and expedited audit queues. Premium plan pricing is currently unconfigured and the tier is inactive in the database. Users cannot purchase an inactive tier until officially activated by administrators.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Status: Inactive in database • No payment accepted
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT REWARDS & WITHDRAWALS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090f15] border border-white/[0.08] space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
              Transparent Rewards & Bank Settlement Policy
            </h2>
            <p className="text-xs text-slate-400">
              Clear rules governing earnings, audits, and manual bank payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <span className="font-bold text-white block">₦5,000 Minimum Payout</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Withdrawal requests can be submitted once your verified available balance reaches ₦5,000.00.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <span className="font-bold text-white block">Manual Review at Launch</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Bank transfers are manually audited by administrators before execution to ensure anti-fraud compliance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
              <span className="font-bold text-white block">Valid NUBAN Settlement</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Payouts are transferred to 10-digit NUBAN accounts matching your registered profile name. Payment is complete only upon confirmed transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT REFERRAL PROGRAMME DISCLOSURE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Member Referral Programme
            </span>
            <h3 className="text-base font-bold text-white font-heading">
              Direct Single-Level Member Invitations
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every member receives an invitation code. Note: Referral commission rates, qualification periods, and eligibility criteria are currently pending administrative configuration and will be published when the programme is officially activated.
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen(isAuthenticated ? 'referrals' : 'register')}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.1] shrink-0 cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* 7. CONCISE FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear, honest facts about platform participation and payouts.
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

      {/* 8. TRUST, POLICIES & INFORMATION DIRECTORY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setCurrentScreen('about')}
            className="p-4 rounded-2xl glass-panel border border-white/[0.06] hover:border-emerald-500/30 text-left space-y-1 transition-all cursor-pointer group"
          >
            <span className="text-emerald-400 font-bold block group-hover:text-emerald-300">About NARIVO</span>
            <span className="text-[11px] text-slate-400 block">Mission & purpose</span>
          </button>

          <button
            onClick={() => setCurrentScreen('how-it-works')}
            className="p-4 rounded-2xl glass-panel border border-white/[0.06] hover:border-emerald-500/30 text-left space-y-1 transition-all cursor-pointer group"
          >
            <span className="text-emerald-400 font-bold block group-hover:text-emerald-300">How It Works</span>
            <span className="text-[11px] text-slate-400 block">7-step process</span>
          </button>

          <button
            onClick={() => setCurrentScreen('terms')}
            className="p-4 rounded-2xl glass-panel border border-white/[0.06] hover:border-emerald-500/30 text-left space-y-1 transition-all cursor-pointer group"
          >
            <span className="text-emerald-400 font-bold block group-hover:text-emerald-300">Terms of Service</span>
            <span className="text-[11px] text-slate-400 block">Operating rules</span>
          </button>

          <button
            onClick={() => setCurrentScreen('contact')}
            className="p-4 rounded-2xl glass-panel border border-white/[0.06] hover:border-emerald-500/30 text-left space-y-1 transition-all cursor-pointer group"
          >
            <span className="text-emerald-400 font-bold block group-hover:text-emerald-300">Contact Us</span>
            <span className="text-[11px] text-slate-400 block">Support channels</span>
          </button>
        </div>
      </section>

      {/* 9. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#063b2a] via-[#04241a] to-[#02130e] border border-emerald-500/30 text-center space-y-5 shadow-[0_20px_50px_rgba(2,44,30,0.5)]">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Join NARIVO Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Register your free account in under 60 seconds and explore available sponsored opportunities across Nigeria.
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
