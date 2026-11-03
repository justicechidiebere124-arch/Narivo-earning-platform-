/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { SUPPORT_CONFIG } from '../../config/support';
import { ArrowRight, Headphones, X } from 'lucide-react';

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

  const customerSupportUrl = SUPPORT_CONFIG.supportUrl || SCREEN_ROUTES['contact'] || `mailto:${SUPPORT_CONFIG.supportEmail}`;

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[radial-gradient(ellipse_130%_90%_at_50%_-15%,#065f46_0%,#044e39_25%,#033a2b_50%,#022c22_75%,#011f18_100%)] selection:bg-emerald-400 selection:text-slate-950">
      
      {/* 1. Rich Emerald Ambient Illumination & Atmospheric Sheen */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] sm:w-[1000px] h-[450px] bg-[radial-gradient(circle,rgba(52,211,153,0.28)_0%,rgba(16,185,129,0.12)_45%,transparent_75%)] blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/4 -right-20 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 -left-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Subtle fine glass contour grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,211,153,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(52,211,153,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_65%,transparent_100%)] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 2. Top Header Brand Identity */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-400/20 backdrop-blur-xl shadow-[0_8px_24px_rgba(1,26,20,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(52,211,153,0.45)] ring-1 ring-white/30 select-none">
            N
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-[0.16em] text-white font-heading select-none">
            NARIVO
          </span>
          <span className="hidden sm:inline-block h-3.5 w-[1px] bg-emerald-400/30" />
          <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-300/90 uppercase tracking-widest">
            Nigeria
          </span>
        </div>
      </header>

      {/* 3. Centered Emerald Glassmorphism Card */}
      <main className="w-full max-w-3xl mx-auto my-auto py-8 sm:py-12 text-center">
        <div className="relative rounded-3xl sm:rounded-[36px] bg-[#064e3b]/35 sm:bg-[#064e3b]/40 backdrop-blur-2xl border border-emerald-400/25 shadow-[0_30px_70px_rgba(1,26,20,0.7),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_40px_rgba(16,185,129,0.08)] p-6 sm:p-12 lg:p-16 space-y-8 sm:space-y-10 overflow-hidden">
          
          {/* Subtle top specular sheen */}
          <div 
            className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />

          {/* Genuine NARIVO Logo Emblem inside Hero */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 p-0.5 shadow-[0_0_36px_rgba(52,211,153,0.4)]">
              <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-emerald-950/50 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-300 select-none">
                  N
                </span>
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-[0.2em] text-white font-heading select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              NARIVO
            </span>
          </div>

          {/* Mandatory Main Heading & Supporting Description */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.14] font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <span>Nigerian Sponsored Tasks</span>{' '}
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-100 drop-shadow-[0_2px_20px_rgba(52,211,153,0.35)]">
                and Digital Opportunities Platform
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed max-w-xl mx-auto font-normal">
              Connecting verified Nigerian members with genuine advertiser-funded campaigns, sponsored tasks, and transparent digital earning opportunities.
            </p>
          </div>

          {/* Two Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto pt-2">
            {!isAuthenticated ? (
              <>
                {/* 1. GET STARTED Button */}
                <a
                  href={SCREEN_ROUTES['register']}
                  onClick={(e) => handleLinkClick(e, 'register')}
                  className="group relative flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(52,211,153,0.45),inset_0_1px_0_rgba(255,255,255,0.6)] border border-emerald-300/60 active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>GET STARTED</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/30 pointer-events-none" />
                </a>

                {/* 2. SIGN IN Button */}
                <a
                  href={SCREEN_ROUTES['login']}
                  onClick={(e) => handleLinkClick(e, 'login')}
                  className="group flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-100 hover:text-white font-bold text-sm sm:text-base tracking-wide border border-emerald-400/35 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_25px_rgba(1,26,20,0.4)] active:scale-[0.98] transition-all cursor-pointer touch-target"
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
                  className="group relative flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(52,211,153,0.45),inset_0_1px_0_rgba(255,255,255,0.6)] border border-emerald-300/60 active:scale-[0.98] transition-all cursor-pointer overflow-hidden touch-target"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>GO TO DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/30 pointer-events-none" />
                </a>

                <a
                  href={SCREEN_ROUTES['tasks']}
                  onClick={(e) => handleLinkClick(e, 'tasks')}
                  className="group flex-1 min-h-[52px] inline-flex items-center justify-center px-8 py-3.5 sm:py-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-100 hover:text-white font-bold text-sm sm:text-base tracking-wide border border-emerald-400/35 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_25px_rgba(1,26,20,0.4)] active:scale-[0.98] transition-all cursor-pointer touch-target"
                >
                  <span>BROWSE TASKS</span>
                </a>
              </>
            )}
          </div>

          {/* 4. Small Clickable Telegram & Customer Support Headset Icons */}
          <div className="pt-4 sm:pt-6 flex items-center justify-center gap-3.5">
            {/* Telegram Icon Button */}
            {isTelegramConfigured ? (
              <a
                href={SUPPORT_CONFIG.telegramCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Official NARIVO Telegram Community"
                aria-label="Official NARIVO Telegram Community"
                className="group relative w-11 h-11 rounded-full bg-emerald-950/45 hover:bg-emerald-900/60 border border-emerald-400/30 hover:border-emerald-300/60 flex items-center justify-center text-emerald-200 hover:text-white backdrop-blur-md shadow-[0_6px_20px_rgba(1,26,20,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-105 active:scale-95 touch-target"
              >
                <TelegramMark className="w-5 h-5 text-emerald-300 group-hover:text-emerald-100 transition-colors" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setShowTelegramNotice(true)}
                title="Official Telegram Community (Setup in progress)"
                aria-label="Official Telegram Community (Setup in progress)"
                className="group relative w-11 h-11 rounded-full bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400/60 hover:text-emerald-200 hover:border-emerald-400/40 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer touch-target"
              >
                <TelegramMark className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400/80 rounded-full border border-emerald-950 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              </button>
            )}

            {/* Customer Support Headset Icon Button */}
            <a
              href={customerSupportUrl}
              onClick={(e) => {
                if (!customerSupportUrl.startsWith('mailto:')) {
                  handleLinkClick(e, 'contact');
                }
              }}
              title="Official Customer Support & Inquiries"
              aria-label="Official Customer Support & Inquiries"
              className="group relative w-11 h-11 rounded-full bg-emerald-950/45 hover:bg-emerald-900/60 border border-emerald-400/30 hover:border-emerald-300/60 flex items-center justify-center text-emerald-200 hover:text-white backdrop-blur-md shadow-[0_6px_20px_rgba(1,26,20,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-105 active:scale-95 touch-target cursor-pointer"
            >
              <Headphones className="w-5 h-5 text-emerald-300 group-hover:text-emerald-100 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-emerald-950 shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
            </a>
          </div>

        </div>
      </main>

      {/* 5. Minimal Bottom Footnote */}
      <footer className="w-full max-w-3xl mx-auto text-center pb-2">
        <p className="text-xs text-emerald-200/50 font-medium">
          © {new Date().getFullYear()} NARIVO. Nigerian Sponsored Tasks and Digital Opportunities Platform.
        </p>
      </footer>

      {/* 6. Telegram Community Status Modal (shown when link is pending administrative configuration) */}
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
              className="absolute top-4 right-4 text-emerald-200/60 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <TelegramMark className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 id="telegram-modal-title" className="text-base font-bold text-white font-heading">
                Official Telegram Community
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                The official NARIVO Telegram community link is currently being finalized by platform administrators.
              </p>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
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
