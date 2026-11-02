/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Banknote, 
  Smartphone, 
  Users2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Lock,
  ChevronDown,
  Building2,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentScreen, tasks, setSelectedTaskForSubmission, isAuthenticated } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const previewTasks = tasks.slice(0, 3);

  const faqs = [
    {
      question: "Is registration on NARIVO really 100% free?",
      answer: "Yes, member registration on NARIVO is completely free. We do not charge subscription fees, registration charges, or hidden onboarding fees. Advertisers fund all tasks, and rewards are distributed to verified members."
    },
    {
      question: "What is the minimum withdrawal preference and payout schedule?",
      answer: "The platform enforces a minimum withdrawal threshold of ₦5,000.00. This standard protects members from micro-deduction transfer charges and ensures bank-grade batch settlements directly to your Nigerian NUBAN account."
    },
    {
      question: "Which Nigerian banks are supported for payouts?",
      answer: "We support major Nigerian commercial banks and licensed microfinance institutions including GTBank, Access Bank, Zenith Bank, First Bank, UBA, Kuda Bank, Moniepoint, OPay, and PalmPay via standard 10-digit NUBAN settlement."
    },
    {
      question: "How are task completions audited and verified?",
      answer: "Every submitted task proof (screenshots, usernames, or review links) undergoes verification within the sponsor's designated audit window (typically 12 to 48 hours). Once confirmed authentic, the reward moves from Pending Rewards to Available Balance."
    },
    {
      question: "How does the 1-Level Referral Programme work?",
      answer: "You receive a unique referral link upon registration. When you introduce a fellow Nigerian earner who completes verified tasks, you earn a platform referral bonus credited directly to your wallet."
    }
  ];

  return (
    <div className="space-y-28 pb-20 relative overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.16),transparent_65%)] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(5,150,105,0.08),transparent_70%)] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Value Proposition */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-wide">NIGERIA'S HIGH-INTEGRITY SPONSORED-TASK EXCHANGE</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] font-heading">
                Monetize Real Human Engagement. Earn In <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">Naira (₦).</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                NARIVO bridges verified Nigerian smartphone users with authentic advertiser campaigns. Test innovative apps, complete consumer market surveys, amplify brand promotions, and withdraw directly to your Nigerian commercial bank account.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free Registration</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span>₦5,000 Minimum Payout</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>10-Digit NUBAN Standard</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setCurrentScreen(isAuthenticated ? 'dashboard' : 'register')}
                  className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl btn-emerald-primary text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                >
                  <span>{isAuthenticated ? 'Open Member Portal' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentScreen('tasks')}
                  className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 hover:text-white font-bold text-sm border border-white/[0.1] hover:border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md"
                >
                  <span>Explore Sponsored Tasks</span>
                </button>
              </div>

              {/* Stat Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/[0.08] max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">₦0.00</div>
                  <div className="text-[11px] text-slate-400 font-medium">Free Member Access</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">₦5,000</div>
                  <div className="text-[11px] text-slate-400 font-medium">Min Payout Threshold</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">24-48h</div>
                  <div className="text-[11px] text-slate-400 font-medium">Task Audit Window</div>
                </div>
              </div>
            </div>

            {/* Right: Glassmorphism Fintech Card Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 blur-2xl opacity-75 pointer-events-none" />

                {/* Main Glass Fintech Card */}
                <div className="relative rounded-3xl glass-panel glass-specular p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-6">
                  {/* Top Bar of Glass Card */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-black text-sm shadow-sm">
                        N
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">NARIVO Exchange Architecture</div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Direct NUBAN Settlement Pipeline</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 font-bold uppercase border border-emerald-500/30">
                      LIVE PLATFORM
                    </span>
                  </div>

                  {/* High-Integrity Settlement Highlights */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-black/60 border border-emerald-500/25 relative overflow-hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-heading">
                        Minimum Payout Threshold
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        10-Digit NUBAN
                      </span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                      ₦5,000.00
                    </div>
                    <p className="text-[11px] text-slate-300/90 leading-relaxed">
                      Direct automated batch transfers via NIBSS to GTBank, Access, Zenith, First Bank, Kuda, and Moniepoint accounts.
                    </p>
                  </div>

                  {/* Active Featured Campaign Preview */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                      <span>Featured Campaign Sample</span>
                      <span className="text-[10px] text-emerald-400">Verified Sponsor</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          App Testing & Review
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-300">
                          ₦850.00
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-1">
                        PayVantage FinTech NG: Mobile Onboarding & Verification
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.06]">
                        <span>Est. 6 mins</span>
                        <span className="text-slate-300">84 slots available</span>
                      </div>
                    </div>
                  </div>

                  {/* Security & Free Registration Footnote */}
                  <div className="flex items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Zero registration fees</span>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('register')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Join Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3-STEP EDITORIAL ARCHITECTURE) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-heading">
            Simple, Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            How NARIVO Works For Members
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            A transparent 3-step lifecycle designed for Nigerian smartphone users to turn authentic brand engagement into tangible Naira rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="glass-panel p-7 rounded-3xl glass-card-interactive relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              01
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Select Sponsored Tasks
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore diverse tasks including mobile app testing, constructive Google Play reviews, authentic social amplification, and market survey questionnaires.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Clear reward amounts upfront</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-7 rounded-3xl glass-card-interactive relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              02
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Submit Task Verification
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Follow task instructions and submit authentic proof (profile handle, review link, or screenshot proof) through your dedicated member dashboard portal.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Anti-fraud advertiser audit window</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-7 rounded-3xl glass-card-interactive relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              03
            </div>
            <h3 className="text-lg font-bold text-white font-heading">
              Withdraw to Any Nigerian Bank
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once approved, funds move into your Available Balance. Request direct payouts to your 10-digit NUBAN account whenever your balance reaches ₦5,000.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fast settlement via NIBSS NUBAN</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE SPONSORED TASKS SHOWCASE */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-heading">
                Marketplace Preview
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                Sample Demonstrations
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading mt-1">
              Active Sponsored Tasks Preview
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Demonstration campaigns highlighting standard advertiser formats available on NARIVO.
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('tasks')}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group"
          >
            <span>View All Sponsored Tasks ({tasks.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewTasks.map((task) => (
            <div 
              key={task.id}
              className="glass-panel glass-specular p-6 rounded-3xl glass-card-interactive flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {task.category}
                    </span>
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/25">
                      DEMO
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-emerald-300">
                      {formatNaira(task.rewardNaira)}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {task.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {task.instructions[0] || task.proofRequirements.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[170px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{task.sponsorName}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{task.estimatedMinutes} mins</span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedTaskForSubmission(task);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/[0.08] hover:border-emerald-500"
                >
                  <span>Submit Proof / Review Task</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PLATFORM PILLARS & SECURITY */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel-emerald glass-specular p-8 sm:p-12 border border-emerald-500/30 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-heading">
                Security & Verification Protocol
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
                Built For Payout Integrity & Trust
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe in genuine performance. Nigerian advertisers demand real users, not simulated bots. Our platform ensures advertisers get authentic market insights, while verified members receive legitimate rewards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Anti-Bot Verification</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Real proof checks and IP validation ensure fair earnings for honest members.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>Nigerian Bank NUBAN Settlement (Demo)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Withdrawals map directly to verified 10-digit Nigerian commercial bank accounts.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>1-Level Referral Protocol</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Earn bonuses every time members you invite complete approved tasks. Expand your community of verified digital earners across Nigeria.
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No Upfront Capital Required</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Never pay to earn. Unlike predatory schemes, NARIVO charges ₦0.00 for registration or task access.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-heading">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Clear, honest answers about tasks, payouts, and platform rules.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden border border-white/[0.07] transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION CARD */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-[#071311] to-black border border-emerald-500/30 text-center space-y-6 relative overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.25)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Verified Nigerian Earners Today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
            Ready to Monetize Your Spare Time in Nigeria?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create your free member account in under 60 seconds. Start browsing active brand campaigns, submit task verification, and withdraw to your bank.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentScreen(isAuthenticated ? 'dashboard' : 'register')}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl btn-emerald-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer"
            >
              <span>{isAuthenticated ? 'Go to Member Dashboard' : 'Register Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentScreen('tasks')}
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 hover:text-white font-bold text-sm border border-white/[0.1] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Active Tasks</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
