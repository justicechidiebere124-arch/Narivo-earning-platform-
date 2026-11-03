/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { SUPPORT_CONFIG } from '../../config/support';
import { 
  ArrowRight, 
  Headphones, 
  ExternalLink, 
  ShieldCheck, 
  Info,
  X,
  Mail
} from 'lucide-react';

/**
 * Authentic Telegram vector mark for crisp rendering at any screen density
 */
const TelegramMark: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useApp();
  const [showTelegramNotice, setShowTelegramNotice] = useState(false);

  // Exact SEO configuration preserved
  usePageSeo({
    title: 'NARIVO – Sponsored Tasks and Digital Opportunities in Nigeria',
    description: 'Explore sponsored tasks and digital opportunities through one simple platform with NARIVO.',
    canonicalPath: '/',
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTelegramClick = (e: React.MouseEvent) => {
    if (SUPPORT_CONFIG.isTelegramConfigured && SUPPORT_CONFIG.telegramCommunityUrl) {
      // Configured official Telegram link
      window.open(SUPPORT_CONFIG.telegramCommunityUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Unconfigured official link: provide clear and honest status modal to user
      e.preventDefault();
      setShowTelegramNotice(true);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Realistic Ambient Lighting & Refraction */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[340px] sm:w-[900px] sm:h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_70%)] pointer-events-none -z-10 blur-2xl" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 bg-slate-900/40 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* 2. Centered Glassmorphism Hero Section */}
      <section className="w-full max-w-3xl mx-auto my-auto pt-6 sm:pt-10 pb-12 sm:pb-16 text-center">
        <div className="relative rounded-3xl bg-white/[0.025] backdrop-blur-2xl border border-white/[0.09] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.14)] p-8 sm:p-14 lg:p-16 space-y-8 sm:space-y-10 overflow-hidden">
          
          {/* Subtle top specular sheen */}
          <div 
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />

          {/* Genuine NARIVO Brand Logo */}
          <div className="flex items-center justify-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black text-2xl sm:text-3xl shadow-[0_4px_24px_rgba(16,185,129,0.35)] ring-1 ring-white/20 select-none">
              N
            </div>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-heading select-none">
              NARIVO
            </span>
          </div>

          {/* Core Headlines */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12] font-heading">
              Discover Opportunities. Earn with NARIVO.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
              Explore sponsored tasks and digital opportunities through one simple platform.
            </p>
          </div>

          {/* Exactly TWO Primary Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto pt-2">
            {!isAuthenticated ? (
              <>
                {/* 1. GET STARTED Button (Emerald glass-inspired button with depth and subtle light reflection) */}
                <a
                  href={SCREEN_ROUTES['register']}
                  onClick={(e) => handleLinkClick(e, 'register')}
                  className="group relative flex-1 min-h-[50px] inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.32),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/40 active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>GET STARTED</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/20 pointer-events-none" />
                </a>

                {/* 2. SIGN IN Button (Sophisticated transparent glass button with refined border and subtle blur) */}
                <a
                  href={SCREEN_ROUTES['login']}
                  onClick={(e) => handleLinkClick(e, 'login')}
                  className="group flex-1 min-h-[50px] inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-emerald-300 font-semibold text-sm tracking-wide border border-white/[0.14] hover:border-emerald-500/40 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-all cursor-pointer touch-target"
                >
                  <span>SIGN IN</span>
                </a>
              </>
            ) : (
              <>
                {/* Authenticated State: Member Navigation with the same two-button discipline */}
                <a
                  href={SCREEN_ROUTES['dashboard']}
                  onClick={(e) => handleLinkClick(e, 'dashboard')}
                  className="group relative flex-1 min-h-[50px] inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.32),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/40 active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>GO TO DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/20 pointer-events-none" />
                </a>

                <a
                  href={SCREEN_ROUTES['tasks']}
                  onClick={(e) => handleLinkClick(e, 'tasks')}
                  className="group flex-1 min-h-[50px] inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white hover:text-emerald-300 font-semibold text-sm tracking-wide border border-white/[0.14] hover:border-emerald-500/40 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-all cursor-pointer touch-target"
                >
                  <span>BROWSE TASKS</span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Telegram and Customer Support Area */}
      <footer className="w-full max-w-2xl mx-auto pt-4 pb-2">
        <div className="rounded-2xl bg-white/[0.025] backdrop-blur-xl border border-white/[0.08] p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            
            {/* Telegram Community Option */}
            <button
              onClick={handleTelegramClick}
              type="button"
              className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/30 transition-all text-left cursor-pointer active:scale-[0.99] touch-target"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 group-hover:scale-105 transition-all shrink-0">
                <TelegramMark className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  <span>Telegram Community</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {SUPPORT_CONFIG.isTelegramConfigured 
                    ? 'Join verified discussions' 
                    : 'Community updates & channel'}
                </div>
              </div>
            </button>

            {/* Customer Support Option */}
            <a
              href={SCREEN_ROUTES['contact']}
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/30 transition-all text-left cursor-pointer active:scale-[0.99] touch-target"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  <span>Customer Support</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Official helpdesk & inquiries
                </div>
              </div>
            </a>

          </div>
        </div>
      </footer>

      {/* 4. Telegram Status Modal (Shown gracefully when Telegram URL is pending configuration by project owner) */}
      {showTelegramNotice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="telegram-modal-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-[#090f15] border border-white/[0.12] p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowTelegramNotice(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <TelegramMark className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 id="telegram-modal-title" className="text-base font-bold text-white font-heading">
                Telegram Community Setup
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The official NARIVO Telegram community link is currently being finalized by platform administrators.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                For prompt assistance with account questions, task verification, or withdrawals, please contact our support team directly.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={SCREEN_ROUTES['contact']}
                onClick={(e) => {
                  setShowTelegramNotice(false);
                  handleLinkClick(e, 'contact');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition-all cursor-pointer"
              >
                Open Support Desk
              </a>
              <button
                type="button"
                onClick={() => setShowTelegramNotice(false)}
                className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
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
