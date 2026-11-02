/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Terminal, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  const { 
    setIsArchitectureModalOpen, 
    resetDemoData, 
    isDemoAccount, 
    loadFreshAccount, 
    loadDemoAccount,
    isAuthenticated,
    isSupabaseConfigured 
  } = useApp();

  if (!isDemoAccount) {
    return null;
  }

  return (
    <div className="bg-[#05080b] border-b border-white/[0.07] px-4 py-2 text-xs relative z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDemoAccount ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isDemoAccount ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </span>
            <span className="font-extrabold text-white uppercase tracking-wider text-[11px] font-heading">
              {isDemoAccount ? 'SANDBOX PREVIEW' : 'MEMBER SANDBOX'}
            </span>
            <span className={`hidden md:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}>
              {isSupabaseConfigured ? 'Supabase Live' : 'Supabase Setup Needed'}
            </span>
          </div>

          <span className="hidden lg:inline text-slate-400 border-l border-white/10 pl-2.5">
            {isDemoAccount 
              ? 'Sample tasks, simulated balance ledger & test payouts. Registration is 100% Free.'
              : 'Clean session active with ₦0.00 initial balance. Minimum withdrawal threshold is ₦5,000.'
            }
          </span>
          <span className="lg:hidden text-slate-400">
            {isDemoAccount ? 'Demo Data' : 'Clean ₦0'}
          </span>
        </div>

        {/* Right Sandbox Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            isDemoAccount ? (
              <button
                onClick={loadFreshAccount}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer text-[11px] font-medium"
                title="Switch to a clean member profile with ₦0.00 balance"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Test ₦0 Account</span>
              </button>
            ) : (
              <button
                onClick={loadDemoAccount}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 transition-all cursor-pointer text-[11px] font-medium shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                title="Load sample demonstration data"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Load Demo Data</span>
              </button>
            )
          )}

          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-emerald-950/40 text-emerald-400 hover:text-emerald-300 border border-white/[0.08] hover:border-emerald-500/30 font-medium transition-all cursor-pointer text-[11px]"
            title="Inspect Supabase, Paystack, and GitHub integration architecture"
          >
            <Terminal className="w-3 h-3" />
            <span className="hidden sm:inline">Backend Blueprint</span>
            <span className="sm:hidden">Blueprint</span>
          </button>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
            title="Reset sandbox state"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
