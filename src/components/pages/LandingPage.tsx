/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { SUPPORT_CONFIG } from '../../config/support';
import { 
  ArrowRight, 
  Menu, 
  X, 
  Check, 
  ChevronDown, 
  Globe, 
  Smartphone, 
  FileText, 
  Search, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Users, 
  Wallet, 
  Clock, 
  Award, 
  Mail, 
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  Send,
  Laptop
} from 'lucide-react';

/**
 * Authentic Telegram vector mark with crisp geometry
 */
const TelegramPlaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="m5.491 11.74 11.57-4.461c.537-.194 1.006.131.832.943l.001-.001-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z"
      fill="currentColor"
    />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated, isPasswordRecovery } = useApp();

  // Navigation & Interactive state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);
  const [telegramNoticeOpen, setTelegramNoticeOpen] = useState(false);
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);
  const [bizImgLoaded, setBizImgLoaded] = useState(false);

  // Exact SEO configuration per specification
  usePageSeo({
    title: 'Narivo | Digital Tasks and Rewards Platform',
    description: 'Discover digital tasks on Narivo. Complete sponsored activities, participate in online research and receive rewards for verified contributions.',
    canonicalPath: '/',
  });

  // Safeguard: Redirect authenticated members away from public landing if already signed in
  useEffect(() => {
    if (isAuthenticated && !isPasswordRecovery) {
      if (typeof window !== 'undefined') {
        const isRecovery = window.location.search.includes('type=recovery') || 
                           window.location.hash.includes('type=recovery');
        if (isRecovery) {
          setCurrentScreen('reset-password');
          return;
        }
      }
      setCurrentScreen('dashboard');
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', SCREEN_ROUTES['dashboard']);
      }
    }
  }, [isAuthenticated, isPasswordRecovery, setCurrentScreen]);

  const handleNavigate = (screen: ScreenType) => {
    setMobileMenuOpen(false);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isTelegramConfigured = Boolean(
    SUPPORT_CONFIG.isTelegramConfigured && SUPPORT_CONFIG.telegramCommunityUrl?.trim()
  );

  // 10 Mandatory FAQs according to specification
  const faqs = [
    {
      q: 'What is Narivo?',
      a: 'Narivo is a digital task and rewards platform where individuals discover and participate in sponsored digital activities, usability testing, and consumer feedback programs to earn verified rewards.'
    },
    {
      q: 'How does Narivo work?',
      a: 'Businesses and advertisers partner with Narivo to sponsor digital tasks. Narivo administrators review, verify, and publish approved tasks. Registered members complete the activities, submit valid proof of completion, and earn rewards once their submission is verified by platform reviewers.'
    },
    {
      q: 'How can I earn rewards on Narivo?',
      a: 'You earn rewards by browsing available tasks on the platform, carefully following the task instructions (such as website testing, mobile app feedback, or answering surveys), and submitting clear evidence of completion for administrative verification.'
    },
    {
      q: 'What types of digital tasks are available?',
      a: 'Available activities include website testing, mobile application feedback, online surveys, product experience research, digital information-gathering, and legitimate advertiser-funded promotional campaigns.'
    },
    {
      q: 'How do I submit completed tasks?',
      a: 'Every task card includes a straightforward submission form. Depending on the task requirements, you will upload clear proof such as screenshots, confirmation codes, transaction references, or structured feedback.'
    },
    {
      q: 'How are submissions verified?',
      a: 'Narivo platform administrators evaluate each submission against the published task instructions to verify genuine human participation, proof authenticity, and compliance with quality standards before approving rewards.'
    },
    {
      q: 'How do I receive my rewards?',
      a: 'Once a submission is approved, eligible rewards are credited directly to your Narivo account wallet. Eligible members can then request withdrawals directly to their verified Nigerian bank accounts via standard NUBAN electronic settlement.'
    },
    {
      q: 'Are tasks always available?',
      a: 'Task availability depends on active campaigns from corporate sponsors and partners. While campaigns are updated regularly, task availability varies and is never guaranteed.'
    },
    {
      q: 'Can businesses advertise through Narivo?',
      a: 'Yes. Businesses and organizations can contact the Narivo team directly to discuss sponsored campaigns, usability testing, and consumer feedback initiatives. Narivo handles task structuring, administration, publishing, and quality verification.'
    },
    {
      q: 'How can I contact customer support?',
      a: 'You can reach our dedicated support desk through the Contact page at narivo.site/contact, email us directly at support@narivo.site, or connect with our community through our official communication channels.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#011a14] text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* ── Ambient Background Lighting (Sophisticated Deep Forest Emerald) ── */}
      <div 
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] lg:w-[1200px] h-[550px] bg-[radial-gradient(circle,rgba(16,185,129,0.14)_0%,rgba(6,95,70,0.08)_45%,transparent_75%)] blur-3xl -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none fixed top-1/3 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none fixed bottom-1/4 -left-32 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10" 
        aria-hidden="true" 
      />

      {/* Subtle Hairline Grid Pattern */}
      <div 
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_60%,transparent_100%)] -z-10"
        aria-hidden="true"
      />

      {/* ── 1. HEADER AND NAVIGATION (Top Bar Contract: 1-Row, 3-Zone) ── */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#011a14]/85 border-b border-emerald-500/15 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Authentic Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 shrink-0 group select-none"
            aria-label="Narivo Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(52,211,153,0.45)] ring-1 ring-white/30 transition-transform duration-200 group-hover:scale-105">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-[0.18em] text-white font-heading">
                NARIVO
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Desktop, Single-Line, Clean Typography) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-white hover:text-emerald-300 transition-colors whitespace-nowrap"
            >
              Home
            </a>
            <a 
              href={SCREEN_ROUTES['about']} 
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('about');
              }}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              About
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              How It Works
            </a>
            <a 
              href="#explore-tasks" 
              onClick={(e) => handleSmoothScroll(e, 'explore-tasks')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              Explore Tasks
            </a>
            <a 
              href="#for-businesses" 
              onClick={(e) => handleSmoothScroll(e, 'for-businesses')}
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              For Businesses
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('register')}
                  className="px-5 py-2.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className="px-5 py-2.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all whitespace-nowrap flex items-center gap-2"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.06] border border-emerald-400/20 text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-emerald-400/20 bg-[#02241b]/95 backdrop-blur-2xl px-4 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 rounded-lg hover:bg-white/[0.06] text-white"
              >
                Home
              </a>
              <a
                href={SCREEN_ROUTES['about']}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('about');
                }}
                className="px-3 py-2 rounded-lg hover:bg-white/[0.06] text-slate-300 hover:text-white"
              >
                About
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                className="px-3 py-2 rounded-lg hover:bg-white/[0.06] text-slate-300 hover:text-white"
              >
                How It Works
              </a>
              <a
                href="#explore-tasks"
                onClick={(e) => handleSmoothScroll(e, 'explore-tasks')}
                className="px-3 py-2 rounded-lg hover:bg-white/[0.06] text-slate-300 hover:text-white"
              >
                Explore Tasks
              </a>
              <a
                href="#for-businesses"
                onClick={(e) => handleSmoothScroll(e, 'for-businesses')}
                className="px-3 py-2 rounded-lg hover:bg-white/[0.06] text-slate-300 hover:text-white"
              >
                For Businesses
              </a>
            </nav>

            <div className="pt-4 border-t border-emerald-400/15 flex flex-col gap-2.5">
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleNavigate('login')}
                    className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white font-semibold text-sm text-center"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('register')}
                    className="w-full py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm text-center shadow-md"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavigate('dashboard')}
                  className="w-full py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── 2. HERO SECTION (Two-Column Desktop, Vertically Stacked Mobile) ── */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Introductory Label (Zero-Pill Discipline: Clean unboxed text) */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>DIGITAL TASKS & REWARDS PLATFORM</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.12] font-heading">
                Discover Digital Tasks.{' '}
                <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-teal-100">
                  Get Rewarded.
                </span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Turn your digital participation into opportunities. Explore sponsored tasks, complete activities, share your feedback and receive rewards for your verified contributions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#explore-tasks"
                  onClick={(e) => handleSmoothScroll(e, 'explore-tasks')}
                  className="px-8 py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_28px_rgba(52,211,153,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>EXPLORE OPPORTUNITIES</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                  className="px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-sm border border-emerald-400/25 hover:border-emerald-400/40 backdrop-blur-xl transition-all cursor-pointer inline-flex items-center justify-center"
                >
                  HOW IT WORKS
                </a>
              </div>

              {/* Clean Factual Footnote */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Free registration</span>
                </div>
                <span className="text-emerald-500/40">·</span>
                <div className="flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified submissions</span>
                </div>
                <span className="text-emerald-500/40">·</span>
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Direct bank withdrawal</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Interface Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-2.5 sm:p-3 bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent border border-emerald-400/25 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                
                {/* Fallback & Container */}
                <div className="relative rounded-2xl overflow-hidden bg-[#03241b] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center">
                  
                  {/* Styled CSS Fallback with domain graphics */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#064e3b] to-[#022c22] transition-opacity duration-300 ${heroImgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Laptop className="w-12 h-12 text-emerald-400 mb-3" />
                    <span className="text-sm font-semibold text-white">Digital Task Verification Dashboard</span>
                    <span className="text-xs text-slate-300 mt-1">Real-time task review and participant tracking</span>
                  </div>

                  {/* Primary Visual Asset */}
                  <img
                    src="/src/assets/images/hero_digital_workspace_1794317864717.jpg"
                    alt="Narivo digital workspace showing task review interface"
                    referrerPolicy="no-referrer"
                    onLoad={() => setHeroImgLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {/* Subtle Top Specular Glass Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011a14]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Overlayed Sample Task Card Badge (Realistic, No fake numbers) */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#011f18]/90 border border-emerald-400/30 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">App Usability Evaluation</p>
                        <p className="text-[11px] text-emerald-300/80">Submission verified by platform team</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-400/20 shrink-0">
                      Eligible
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. PLATFORM INTRODUCTION ── */}
      <section className="py-16 sm:py-24 border-t border-emerald-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              Your Gateway to Digital Opportunities.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Narivo connects businesses with people through sponsored digital activities, research, feedback and online participation opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* CARD 1 — Discover Tasks */}
            <div className="p-8 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl hover:border-emerald-400/40 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-heading">
                Discover Tasks
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Explore available digital activities and sponsored opportunities tailored to your device and interests.
              </p>
            </div>

            {/* CARD 2 — Complete Activities */}
            <div className="p-8 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl hover:border-emerald-400/40 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-heading">
                Complete Activities
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Follow task instructions, perform the required activities and submit your work for review with proper evidence.
              </p>
            </div>

            {/* CARD 3 — Receive Rewards */}
            <div className="p-8 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl hover:border-emerald-400/40 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-heading">
                Receive Rewards
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Earn eligible rewards after your submissions have been successfully verified by our administrative team.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. TYPES OF DIGITAL TASKS ── */}
      <section id="explore-tasks" className="py-16 sm:py-24 border-t border-emerald-500/15 relative bg-[#01140e]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              OPPORTUNITY CATEGORIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              Explore Different Digital Activities.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Participate in legitimate advertiser-funded activities and structured digital research. We never support fake reviews, artificial engagement, or ranking manipulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Website Testing */}
            <div className="p-7 rounded-2xl bg-[#02241b]/60 border border-emerald-400/20 backdrop-blur-xl space-y-4 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-heading">Website Testing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Visit websites, test functionality and report genuine user experiences to help developers fix bugs.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300/80">
                <span>Usability audit</span>
                <span>·</span>
                <span>Navigation review</span>
                <span>·</span>
                <span>Form checks</span>
              </div>
            </div>

            {/* 2. App Testing */}
            <div className="p-7 rounded-2xl bg-[#02241b]/60 border border-emerald-400/20 backdrop-blur-xl space-y-4 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-heading">App Testing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Explore applications and provide structured usability feedback across Android and web interfaces.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300/80">
                <span>UI exploration</span>
                <span>·</span>
                <span>Device compatibility</span>
                <span>·</span>
                <span>Flow analysis</span>
              </div>
            </div>

            {/* 3. Online Surveys */}
            <div className="p-7 rounded-2xl bg-[#02241b]/60 border border-emerald-400/20 backdrop-blur-xl space-y-4 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-heading">Online Surveys</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Answer research questions and participate in eligible surveys to help organizations gather reliable data.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300/80">
                <span>Opinion research</span>
                <span>·</span>
                <span>Demographic surveys</span>
                <span>·</span>
                <span>Verified responses</span>
              </div>
            </div>

            {/* 4. Product Research */}
            <div className="p-7 rounded-2xl bg-[#02241b]/60 border border-emerald-400/20 backdrop-blur-xl space-y-4 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-heading">Product Research</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Help businesses understand customer experiences and product preferences through structured inquiries.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300/80">
                <span>Feature evaluation</span>
                <span>·</span>
                <span>Pricing sentiment</span>
                <span>·</span>
                <span>User insights</span>
              </div>
            </div>

            {/* 5. Digital Research */}
            <div className="p-7 rounded-2xl bg-[#02241b]/60 border border-emerald-400/20 backdrop-blur-xl space-y-4 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-heading">Digital Research</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Complete approved online research and information-gathering activities for structured market analysis.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300/80">
                <span>Information verification</span>
                <span>·</span>
                <span>Directory checking</span>
                <span>·</span>
                <span>Field data</span>
              </div>
            </div>

            {/* 6. Sponsored Activities */}
            <div className="p-7 rounded-2xl bg-[#02241b]/60 border border-emerald-400/20 backdrop-blur-xl space-y-4 hover:border-emerald-400/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1.5 font-heading">Sponsored Activities</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Participate in legitimate advertiser-funded digital campaigns with transparent reward structures.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-300/80">
                <span>Brand campaigns</span>
                <span>·</span>
                <span>Digital sign-ups</span>
                <span>·</span>
                <span>Sponsored discovery</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. HOW NARIVO WORKS (Horizontal Desktop, Vertical Mobile) ── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-emerald-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              SIMPLE & TRANSPARENT WORKFLOW
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              Getting Started Is Simple.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              A structured four-step process connecting your effort with approved task rewards.
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            
            {/* Desktop Connector Line */}
            <div 
              className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-emerald-500/10 via-emerald-400/30 to-emerald-500/10 -translate-y-8 pointer-events-none" 
              aria-hidden="true" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* STEP 1 */}
              <div className="relative p-6 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">01</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Create Your Account</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Register and access the Narivo member platform with email or Google sign-in.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="relative p-6 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">02</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Discover Available Tasks</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Browse available activities and review their instructions and reward conditions.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="relative p-6 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">03</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Complete and Submit</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Perform the required activity and submit the necessary evidence for review.
                </p>
              </div>

              {/* STEP 4 */}
              <div className="relative p-6 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">04</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Verification & Rewards</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Narivo reviews submissions and credits eligible rewards according to the applicable task conditions.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 6. FOR BUSINESSES (Direct Administration Model) ── */}
      <section id="for-businesses" className="py-16 sm:py-24 border-t border-emerald-500/15 relative bg-[#021f17]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                ENTERPRISE & SPONSOR SOLUTIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
                Looking to Reach a Digital Audience?
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Let Narivo help you organise sponsored digital tasks, collect user feedback and connect with people who can participate in your campaigns.
              </p>

              {/* 5 Distinct Benefits */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">
                    <strong className="text-white">Sponsored digital campaigns</strong> — Targeted promotion with verified participant involvement.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">
                    <strong className="text-white">Website usability testing</strong> — Unbiased user feedback on flows, design, and performance.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">
                    <strong className="text-white">Product feedback</strong> — Qualitative insights from diverse device users.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">
                    <strong className="text-white">Digital research</strong> — Structured responses to validate concepts and consumer sentiment.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">
                    <strong className="text-white">Organised participant submissions</strong> — Systematic evidence collection with administrative review.
                  </span>
                </div>
              </div>

              {/* Crucial Business Model Transparency Note */}
              <div className="p-4 rounded-xl bg-[#032a20]/90 border border-emerald-400/30 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-emerald-300">
                  Direct Administration Model:
                </p>
                <p className="leading-relaxed">
                  Businesses do not create public advertiser accounts or independently publish tasks. Our administration team directly consults with sponsors, reviews campaign requirements, publishes verified tasks, and oversees submission quality.
                </p>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setBusinessModalOpen(true)}
                  className="px-8 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(52,211,153,0.35)] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>CONTACT NARIVO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-emerald-500/20 to-transparent border border-emerald-400/20 shadow-2xl backdrop-blur-xl">
                <div className="relative rounded-2xl overflow-hidden bg-[#03241b] aspect-[4/3] flex items-center justify-center">
                  
                  {/* Fallback */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#064e3b] to-[#022c22] transition-opacity duration-300 ${bizImgLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Building2 className="w-12 h-12 text-emerald-400 mb-2" />
                    <span className="text-sm font-semibold text-white">Business Task Partnerships</span>
                  </div>

                  <img
                    src="/src/assets/images/business_collaboration_1794317864808.jpg"
                    alt="Narivo business feedback and research analysis"
                    referrerPolicy="no-referrer"
                    onLoad={() => setBizImgLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${bizImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#011a14]/70 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 7. FOR MEMBERS ── */}
      <section className="py-16 sm:py-24 border-t border-emerald-500/15 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-b from-[#064e3b]/40 via-[#043d2e]/30 to-[#02241b]/40 border border-emerald-400/25 shadow-2xl backdrop-blur-2xl">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
              <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                MEMBER OPPORTUNITIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
                Your Participation Creates Opportunities.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Registered members can explore legitimate sponsored digital activities, submit verified contributions, and earn rewards on their own schedule.
              </p>
            </div>

            {/* Structured Capabilities List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-sm">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Discover available digital tasks</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Review task requirements</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Complete eligible activities</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Submit evidence & proof</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Track submission status</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">View approved rewards</span>
              </div>
              <div className="sm:col-span-2 flex items-center justify-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Access your account wallet for verified bank withdrawal</span>
              </div>
            </div>

            {/* Honest Disclaimer */}
            <p className="text-xs text-slate-400 text-center max-w-xl mx-auto mb-8 leading-relaxed">
              *Task availability, reward amounts, and eligibility vary by active campaigns. Narivo does not offer guaranteed income, investment returns, or financial deposit schemes.
            </p>

            {/* CTA */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => handleNavigate('register')}
                className="px-10 py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_28px_rgba(52,211,153,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
              >
                JOIN NARIVO
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── 8. TRANSPARENCY SECTION ── */}
      <section className="py-16 sm:py-24 border-t border-emerald-500/15 relative bg-[#01140e]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              AUTHENTICITY & TRUST
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              Built Around Clear Processes.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              We operate with complete clarity regarding task rules, verification standards, and approved reward handling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Principle 1 */}
            <div className="p-7 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">Clear Task Requirements</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every task published details the exact activity, requirements, and required evidence before you begin.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-7 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">Transparent Reward Conditions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eligible reward amounts and verification timelines are explicitly displayed so you know what to expect.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-7 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">Submission Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trained administrators review submitted proof to prevent fraud and ensure genuine value for sponsors.
              </p>
            </div>

            {/* Principle 4 */}
            <div className="p-7 rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">Account & Transaction Records</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track every submission, approved credit, and withdrawal request through your real-time member ledger.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Task availability, reward amounts, and eligibility vary. Narivo connects members with verified advertiser campaigns and digital opportunities; we do not promise guaranteed income.
            </p>
          </div>

        </div>
      </section>

      {/* ── 9. FREQUENTLY ASKED QUESTIONS (10 Required Accordions) ── */}
      <section id="faqs" className="py-16 sm:py-24 border-t border-emerald-500/15 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              COMMON QUESTIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Everything you need to know about participating, submitting tasks, and receiving rewards.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="rounded-2xl bg-[#02241b]/70 border border-emerald-400/20 backdrop-blur-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:bg-white/[0.04]"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-bold text-white font-heading">
                      {index + 1}. {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 10. FINAL CALL TO ACTION ── */}
      <section className="py-16 sm:py-24 border-t border-emerald-500/15 relative overflow-hidden bg-gradient-to-b from-transparent via-[#064e3b]/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
            Ready to Explore Digital Opportunities?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join a platform designed to connect digital participation with sponsored opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleNavigate('register')}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              GET STARTED
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('login')}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-sm border border-emerald-400/25 transition-all cursor-pointer"
            >
              SIGN IN
            </button>
          </div>

        </div>
      </section>

      {/* ── 11. COMPREHENSIVE FOOTER ── */}
      <footer className="border-t border-emerald-500/20 bg-[#01140e] text-slate-300 text-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Col 1 & 2: Brand Identity & Support Info */}
            <div className="lg:col-span-2 space-y-4">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-lg">
                  N
                </div>
                <span className="text-xl font-black tracking-[0.18em] text-white font-heading">
                  NARIVO
                </span>
              </a>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                A digital task and rewards platform where individuals discover and complete sponsored digital activities, usability testing, and online research.
              </p>

              <div className="pt-2 text-xs text-slate-400 space-y-1.5">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <a href="mailto:support@narivo.site" className="text-slate-300 hover:text-emerald-300 transition-colors">
                    support@narivo.site
                  </a>
                </p>
                <p className="text-[11px] text-slate-400">
                  Customer inquiries answered within 24 business hours.
                </p>
              </div>

              {/* Official Telegram community button */}
              <div className="pt-2">
                {isTelegramConfigured ? (
                  <a
                    href={SUPPORT_CONFIG.telegramCommunityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 text-xs font-semibold transition-colors"
                  >
                    <TelegramPlaneIcon className="w-4 h-4 text-[#229ED9]" />
                    <span>Official Telegram Community</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTelegramNoticeOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 text-xs font-medium transition-colors"
                  >
                    <TelegramPlaneIcon className="w-4 h-4 text-emerald-400" />
                    <span>Official Community Channel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Col 3: Platform Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href={SCREEN_ROUTES['about']}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('about');
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    About Narivo
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#explore-tasks"
                    onClick={(e) => handleSmoothScroll(e, 'explore-tasks')}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Explore Tasks
                  </a>
                </li>
                <li>
                  <a
                    href="#for-businesses"
                    onClick={(e) => handleSmoothScroll(e, 'for-businesses')}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    For Businesses
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                Support
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href="#faqs"
                    onClick={(e) => handleSmoothScroll(e, 'faqs')}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href={SCREEN_ROUTES['contact']}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('contact');
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href={SCREEN_ROUTES['contact']}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('contact');
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Help Centre
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href={SCREEN_ROUTES['terms']}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('terms');
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href={SCREEN_ROUTES['privacy']}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('privacy');
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href={SCREEN_ROUTES['terms']}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('terms');
                    }}
                    className="text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    Reward Policy
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar & Honest Legal Notice */}
          <div className="pt-8 border-t border-emerald-500/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} NARIVO. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-400 text-center md:text-right max-w-xl">
              Narivo is a digital task and rewards marketplace, not an investment or deposit-taking platform. Task availability and eligible reward amounts vary by campaign.
            </p>
          </div>

        </div>
      </footer>

      {/* ── BUSINESS INQUIRY MODAL / DIALOG ── */}
      {businessModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="biz-modal-title"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#032a20] border border-emerald-400/30 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setBusinessModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="biz-modal-title" className="text-lg font-bold text-white font-heading">
                  Partner with Narivo
                </h3>
                <p className="text-xs text-slate-300">
                  Sponsored task campaigns, usability tests & consumer research
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5 space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Direct Business Engagement:</strong> Businesses and advertisers work directly with our administration team. We review your project goals, design custom task parameters, and verify participant submissions for maximum accuracy.
              </p>
              <p>
                Contact our partnership desk to request a tailored campaign proposal:
              </p>
              <div className="pt-2 font-mono text-emerald-300 bg-black/30 p-2.5 rounded-lg border border-emerald-400/20 text-center">
                support@narivo.site
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={SCREEN_ROUTES['contact']}
                onClick={(e) => {
                  e.preventDefault();
                  setBusinessModalOpen(false);
                  handleNavigate('contact');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs text-center transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] cursor-pointer"
              >
                Open Support & Inquiries Desk
              </a>
              <button
                type="button"
                onClick={() => setBusinessModalOpen(false)}
                className="py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TELEGRAM COMMUNITY STATUS MODAL ── */}
      {telegramNoticeOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="telegram-modal-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-[#032a20] border border-emerald-400/30 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setTelegramNoticeOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9]">
              <TelegramPlaneIcon className="w-6 h-6 text-[#229ED9]" />
            </div>

            <div className="space-y-2">
              <h3 id="telegram-modal-title" className="text-base font-bold text-white font-heading">
                Official Telegram Community
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The official Narivo Telegram community channel is currently being prepared for platform announcements.
              </p>
              <p className="text-xs text-emerald-300/90 leading-relaxed">
                For prompt assistance with account questions, task verification, or business inquiries, please connect directly with our support desk.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={SCREEN_ROUTES['contact']}
                onClick={(e) => {
                  e.preventDefault();
                  setTelegramNoticeOpen(false);
                  handleNavigate('contact');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs text-center transition-all cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              >
                Open Support Desk
              </a>
              <button
                type="button"
                onClick={() => setTelegramNoticeOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
