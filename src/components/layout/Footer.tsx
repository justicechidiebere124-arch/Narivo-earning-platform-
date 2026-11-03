/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { ShieldCheck, Banknote, Code, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentScreen, setIsArchitectureModalOpen } = useApp();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#05080b] border-t border-white/[0.08] mt-24 pb-24 md:pb-12 text-slate-400 text-sm relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* 1. Brand & Mission */}
          <div className="space-y-4">
            <a 
              href={SCREEN_ROUTES['landing']}
              onClick={(e) => handleLinkClick(e, 'landing')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all">
                N
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight font-heading">
                NARIVO
              </span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria’s sponsored-task marketplace connecting members with genuine advertiser-funded campaigns, mobile app testing, consumer research, and feedback activities.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero-Fee Member Registration</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Minimum bank withdrawal: ₦5,000 via NUBAN.
              </div>
            </div>
          </div>

          {/* 2. Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href={SCREEN_ROUTES['landing']}
                  onClick={(e) => handleLinkClick(e, 'landing')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Overview & Opportunities
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['how-it-works']}
                  onClick={(e) => handleLinkClick(e, 'how-it-works')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['tasks']}
                  onClick={(e) => handleLinkClick(e, 'tasks')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Sponsored Tasks Directory
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['register']}
                  onClick={(e) => handleLinkClick(e, 'register')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Register Free Member Account
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['login']}
                  onClick={(e) => handleLinkClick(e, 'login')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Member Sign In
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Platform Policies & Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Information & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a 
                  href={SCREEN_ROUTES['about']}
                  onClick={(e) => handleLinkClick(e, 'about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  About NARIVO Platform
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['contact']}
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Contact & Support
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['terms']}
                  onClick={(e) => handleLinkClick(e, 'terms')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href={SCREEN_ROUTES['privacy']}
                  onClick={(e) => handleLinkClick(e, 'privacy')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 text-left block"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>₦5,000 Minimum Payout Standard</span>
              </li>
            </ul>
          </div>

          {/* 4. Technology Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Technology Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Architected for enterprise deployment with Supabase PostgreSQL Row Level Security (RLS) and structured backend verification.
            </p>
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-emerald-950/40 text-emerald-300 hover:text-emerald-200 border border-white/[0.08] hover:border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Integration Blueprint</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Regulatory & Disclaimer Notice */}
        <div className="pt-8 border-t border-white/[0.06] text-[11px] text-slate-400 leading-normal flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left max-w-3xl">
            © {new Date().getFullYear()} NARIVO. All rights reserved. NARIVO is an independent Nigerian sponsored task marketplace. Task availability and payouts depend on verified advertiser campaigns. No guaranteed income or investment returns.
          </p>
          <div className="flex items-center gap-3 text-slate-400 shrink-0">
            <a 
              href={SCREEN_ROUTES['terms']}
              onClick={(e) => handleLinkClick(e, 'terms')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Terms
            </a>
            <span>·</span>
            <a 
              href={SCREEN_ROUTES['privacy']}
              onClick={(e) => handleLinkClick(e, 'privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Privacy
            </a>
            <span>·</span>
            <a 
              href={SCREEN_ROUTES['contact']}
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
