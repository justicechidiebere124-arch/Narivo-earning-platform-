/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { SUPPORT_CONFIG } from '../../config/support';
import { ArrowRight, X } from 'lucide-react';

/**
 * Authentic Telegram paper-plane vector mark with crisp geometry
 */
const TelegramPlaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="m5.491 11.74 11.57-4.461c.537-.194 1.006.131.832.943l.001-.001-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z"
      fill="#ffffff"
    />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useApp();
  const [showTelegramNotice, setShowTelegramNotice] = useState(false);

  // Exact SEO configuration preserved with canonical mapping
  usePageSeo({
    title: 'NARIVO – Nigerian Sponsored Tasks and Digital Opportunities Platform',
    description: 'Explore authentic sponsored tasks and digital opportunities across Nigeria through one simple, verified platform with NARIVO.',
    canonicalPath: '/',
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isTelegramConfigured = Boolean(
    SUPPORT_CONFIG.isTelegramConfigured && SUPPORT_CONFIG.telegramCommunityUrl?.trim()
  );

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[radial-gradient(ellipse_130%_90%_at_50%_-15%,#065f46_0%,#044e39_25%,#033a2b_50%,#022c22_75%,#011f18_100%)] selection:bg-emerald-400 selection:text-slate-950">
      
      {/* 1. Rich Emerald Ambient Illumination with Gentle Float Animation */}
      <div 
        className="anim-ambient-1 absolute top-0 left-1/2 -translate-x-1/2 w-[720px] sm:w-[1000px] h-[450px] bg-[radial-gradient(circle,rgba(52,211,153,0.3)_0%,rgba(16,185,129,0.14)_45%,transparent_75%)] blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="anim-ambient-2 absolute top-1/4 -right-20 w-80 h-80 bg-emerald-400/18 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="anim-ambient-3 absolute bottom-10 -left-20 w-96 h-96 bg-teal-500/18 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Subtle fine glass contour grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,211,153,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,211,153,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_65%,transparent_100%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 2. Top Header Brand Identity with Entrance Animation */}
      <header className="anim-hero-logo w-full max-w-4xl mx-auto flex items-center justify-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#032f24]/75 border border-emerald-400/30 backdrop-blur-xl shadow-[0_8px_24px_rgba(1,26,20,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(52,211,153,0.5)] ring-1 ring-white/30 select-none">
            N
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-[0.16em] text-white font-heading select-none">
            NARIVO
          </span>
          <span className="hidden sm:inline-block h-3.5 w-[1px] bg-emerald-400/40" />
          <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-300 uppercase tracking-widest">
            Nigeria
          </span>
        </div>
      </header>

      {/* 3. Centered Emerald Glassmorphism Card */}
      <main className="w-full max-w-3xl mx-auto my-auto py-8 sm:py-12 text-center">
        <div className="relative rounded-3xl sm:rounded-[36px] bg-[#064e3b]/45 sm:bg-[#064e3b]/50 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_30px_70px_rgba(1,26,20,0.75),inset_0_1px_1px_rgba(255,255,255,0.28),inset_0_0_40px_rgba(16,185,129,0.1)] p-6 sm:p-12 lg:p-16 space-y-8 sm:space-y-10 overflow-hidden">
          
          {/* Subtle top specular sheen */}
          <div 
            className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />

          {/* Genuine NARIVO Logo Emblem inside Hero with Entrance Animation */}
          <div className="anim-hero-logo flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-600 p-0.5 shadow-[0_0_36px_rgba(52,211,153,0.45)]">
              <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-[#022c22] backdrop-blur-sm flex items-center justify-center border border-white/30">
                <span className="text-3xl sm:text-4xl font-black text-white select-none">
                  N
                </span>
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-white font-heading select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              NARIVO
            </span>
          </div>

          {/* Mandatory Main Heading & Supporting Description with High Legibility & Animations */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="anim-hero-heading text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.14] font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              <span className="text-white">Nigerian Sponsored Tasks</span>{' '}
              <span className="block mt-1 sm:mt-2 text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-white sm:via-emerald-100 sm:to-teal-100 drop-shadow-[0_2px_16px_rgba(52,211,153,0.35)]">
                and Digital Opportunities Platform
              </span>
            </h1>
            <p className="anim-hero-desc text-base sm:text-lg text-slate-100 sm:text-emerald-50 leading-relaxed max-w-xl mx-auto font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Connecting verified Nigerian members with genuine advertiser-funded campaigns, sponsored tasks, and transparent digital earning opportunities.
            </p>
          </div>

          {/* Two Primary Action Buttons with Staggered Animations & Clear Contrast */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto pt-2">
            {!isAuthenticated ? (
              <>
                {/* 1. GET STARTED Button */}
                <a
                  href={SCREEN_ROUTES['register']}
                  onClick={(e) => handleLinkClick(e, 'register')}
                  className="anim-hero-btn-1 group relative flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-[0_0_28px_rgba(52,211,153,0.5),inset_0_1px_0_rgba(255,255,255,0.7)] border border-emerald-200/80 active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>GET STARTED</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>

                {/* 2. SIGN IN Button */}
                <a
                  href={SCREEN_ROUTES['login']}
                  onClick={(e) => handleLinkClick(e, 'login')}
                  className="anim-hero-btn-2 group flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-white hover:text-emerald-200 font-bold text-sm sm:text-base tracking-wide border border-white/25 hover:border-emerald-400/50 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer touch-target"
                >
                  <span>SIGN IN</span>
                </a>
              </>
            ) : (
              <>
                {/* Authenticated Member Direct Access */}
                <a
                  href={SCREEN_ROUTES['dashboard']}
                  onClick={(e) => handleLinkClick(e, 'dashboard')}
                  className="anim-hero-btn-1 group relative flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-[0_0_28px_rgba(52,211,153,0.5),inset_0_1px_0_rgba(255,255,255,0.7)] border border-emerald-200/80 active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>GO TO DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>

                <a
                  href={SCREEN_ROUTES['tasks']}
                  onClick={(e) => handleLinkClick(e, 'tasks')}
                  className="anim-hero-btn-2 group flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-white hover:text-emerald-200 font-bold text-sm sm:text-base tracking-wide border border-white/25 hover:border-emerald-400/50 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer touch-target"
                >
                  <span>BROWSE TASKS</span>
                </a>
              </>
            )}
          </div>

          {/* 4. Single Authentic Blue Telegram Icon (Headset Completely Removed) */}
          <div className="pt-4 sm:pt-6 flex items-center justify-center">
            {isTelegramConfigured ? (
              <a
                href={SUPPORT_CONFIG.telegramCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Official NARIVO Telegram Community"
                aria-label="Official NARIVO Telegram Community"
                className="anim-hero-telegram group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#229ED9] hover:bg-[#1d8ec4] border border-white/30 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(34,158,217,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-200 hover:scale-108 active:scale-95 touch-target select-none cursor-pointer"
              >
                <TelegramPlaneIcon className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setShowTelegramNotice(true)}
                title="Official NARIVO Telegram Community"
                aria-label="Official NARIVO Telegram Community"
                className="anim-hero-telegram group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#229ED9] hover:bg-[#1d8ec4] border border-white/30 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(34,158,217,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-200 hover:scale-108 active:scale-95 touch-target select-none cursor-pointer"
              >
                <TelegramPlaneIcon className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-900 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              </button>
            )}
          </div>

        </div>
      </main>

      {/* 5. Minimal Bottom Footnote */}
      <footer className="w-full max-w-3xl mx-auto text-center pb-2">
        <p className="text-xs text-emerald-100/70 font-medium">
          © {new Date().getFullYear()} NARIVO. Nigerian Sponsored Tasks and Digital Opportunities Platform.
        </p>
      </footer>

      {/* 6. Telegram Community Status Modal (shown if community link is pending administrative configuration) */}
      {showTelegramNotice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="telegram-modal-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-[#042f24] border border-emerald-400/30 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowTelegramNotice(false)}
              className="absolute top-4 right-4 text-emerald-200/70 hover:text-white transition-colors p-1 rounded-lg"
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
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                The official NARIVO Telegram community link is currently being finalized by platform administrators.
              </p>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                For prompt assistance with account questions, task verification, or withdrawals, please connect with our support desk directly.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={SCREEN_ROUTES['contact']}
                onClick={(e) => {
                  setShowTelegramNotice(false);
                  handleLinkClick(e, 'contact');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs text-center transition-all cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              >
                Open Support Desk
              </a>
              <button
                type="button"
                onClick={() => setShowTelegramNotice(false)}
                className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-emerald-100 text-xs font-semibold transition-all cursor-pointer"
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
