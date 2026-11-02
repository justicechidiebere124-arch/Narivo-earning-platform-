/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Banknote, Users2, Database, Code, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentScreen, setIsArchitectureModalOpen } = useApp();

  return (
    <footer className="bg-[#05080b] border-t border-white/[0.08] mt-24 pb-24 md:pb-12 text-slate-400 text-sm relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                N
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight font-heading">
                NARIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria’s sponsored-task marketplace connecting verified members with authentic advertiser campaigns, mobile testing, and consumer feedback surveys.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero-Fee Member Registration</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Minimum withdrawal preference: ₦5,000 via NUBAN.
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => { setCurrentScreen('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Platform Overview & Benefits
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentScreen('tasks'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Sponsored Tasks Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentScreen('register'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Register Free Member Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentScreen('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400"
                >
                  Member Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Platform Standards
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Banknote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>₦5,000 Minimum Payout Standard</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Anti-Fraud Proof Audit Windows</span>
              </li>
              <li className="flex items-start gap-2">
                <Users2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1-Level Direct Referral Bonus</span>
              </li>
              <li className="flex items-start gap-2">
                <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Nigerian NUBAN Bank Settlement</span>
              </li>
            </ul>
          </div>

          {/* Developer Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-heading">
              Technology Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Architected for enterprise deployment with Supabase PostgreSQL RLS, Paystack Transfer API, and GitHub repository integration.
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
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} NARIVO Technologies Nigeria. All rights reserved. NARIVO is an independent sponsored task marketplace. Task availability and reward payouts are funded by authentic third-party advertisers. No guaranteed returns.
          </p>
          <div className="flex items-center gap-4 text-slate-400 shrink-0">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
