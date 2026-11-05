/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentScreen, setCurrentScreen, isAuthenticated } = useApp();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isPortalScreen = isAuthenticated && ['dashboard', 'tasks', 'wallet', 'referrals', 'profile', 'membership'].includes(currentScreen);

  // Compact, quiet footer for authenticated member pages
  if (isPortalScreen) {
    return (
      <footer className="border-t border-emerald-400/15 py-6 px-4 sm:px-8 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span className="text-slate-400">
            © 2026 NARIVO. Nigerian Sponsored Tasks and Digital Opportunities Platform.
          </span>
          <div className="flex items-center gap-4 text-emerald-300/80">
            <a 
              href={SCREEN_ROUTES['terms']} 
              onClick={(e) => handleLinkClick(e, 'terms')}
              className="hover:text-emerald-200 transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <span className="text-emerald-400/30">·</span>
            <a 
              href={SCREEN_ROUTES['privacy']} 
              onClick={(e) => handleLinkClick(e, 'privacy')}
              className="hover:text-emerald-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#02241b]/80 border-t border-emerald-400/15 mt-20 pb-24 md:pb-12 text-slate-300 text-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <a 
              href={SCREEN_ROUTES['landing']}
              onClick={(e) => handleLinkClick(e, 'landing')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                N
              </div>
              <span className="font-extrabold text-white text-lg tracking-[0.14em] font-heading">
                NARIVO
              </span>
            </a>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nigeria’s sponsored-task platform connecting members with verified advertiser campaigns, app testing, and digital opportunities.
            </p>
            <div className="p-3 rounded-xl bg-[#064e3b]/30 border border-emerald-400/20 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero-Fee Member Registration</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Minimum bank withdrawal: ₦5,000 via NUBAN.
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href={SCREEN_ROUTES['landing']}
                  onClick={(e) => handleLinkClick(e, 'landing')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['how-it-works']}
                  onClick={(e) => handleLinkClick(e, 'how-it-works')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['tasks']}
                  onClick={(e) => handleLinkClick(e, 'tasks')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Sponsored Tasks
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['about']}
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  About NARIVO
                </a>
              </li>
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-heading">
              Members
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href={SCREEN_ROUTES['register']}
                  onClick={(e) => handleLinkClick(e, 'register')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Create Account
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['login']}
                  onClick={(e) => handleLinkClick(e, 'login')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Member Sign In
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['forgot-password']}
                  onClick={(e) => handleLinkClick(e, 'forgot-password')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Forgot Password
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-heading">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href={SCREEN_ROUTES['terms']}
                  onClick={(e) => handleLinkClick(e, 'terms')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['privacy']}
                  onClick={(e) => handleLinkClick(e, 'privacy')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['contact']}
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="hover:text-emerald-300 transition-colors cursor-pointer text-slate-300"
                >
                  Contact & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-400/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 NARIVO Platform. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">NUBAN settlements processed in Nigerian Naira (₦).</p>
        </div>
      </div>
    </footer>
  );
};
