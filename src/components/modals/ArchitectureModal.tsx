/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Database, CreditCard, GitBranch, FolderTree, Copy, Check, Terminal, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getSupabaseConfigStatus } from '../../lib/supabase';

export const ArchitectureModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'supabase' | 'paystack' | 'github'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isArchitectureModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/[0.12] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0a0f14] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              N
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                NARIVO Backend & Deployment Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Blueprint: Supabase PostgreSQL RLS, Paystack NIP Transfers & GitHub CI/CD
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center border-b border-white/[0.08] bg-black/40 px-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-300 bg-white/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Project Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'supabase'
                ? 'border-emerald-400 text-emerald-300 bg-white/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Connection</span>
          </button>

          <button
            onClick={() => setActiveTab('paystack')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'paystack'
                ? 'border-emerald-400 text-emerald-300 bg-white/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Paystack Bank Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'github'
                ? 'border-emerald-400 text-emerald-300 bg-white/[0.04]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub & CI/CD</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed bg-[#070b0f]/80">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-heading">
                Modular Frontend & Backend-Ready File Structure
              </h4>
              <p className="text-slate-400">
                The codebase is structured with clear separation of UI components, state machines, and API integration wrappers.
              </p>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
                <div className="text-emerald-400 font-bold">/src</div>
                <div className="pl-4">├── <span className="text-white">components/</span></div>
                <div className="pl-8">├── <span className="text-slate-400">layout/</span> (Header, Sidebar, MobileNav, Footer, DemoNoticeBanner)</div>
                <div className="pl-8">├── <span className="text-slate-400">pages/</span> (Landing, MemberDashboard, Tasks, Wallet, Referrals, Profile, Auth)</div>
                <div className="pl-8">└── <span className="text-slate-400">modals/</span> (TaskSubmitModal, ArchitectureModal)</div>
                <div className="pl-4">├── <span className="text-white">context/</span> (AppContext.tsx — Single Source of Truth)</div>
                <div className="pl-4">├── <span className="text-white">lib/</span> (supabase.ts, paystack.ts, supabase-schema.sql)</div>
                <div className="pl-4">├── <span className="text-white">utils/</span> (formatters.ts — Standard Naira ₦ formatting)</div>
                <div className="pl-4">└── <span className="text-white">types/</span> (index.ts — Strict TypeScript Data Models)</div>
              </div>
            </div>
          )}

          {activeTab === 'supabase' && (() => {
            const configStatus = getSupabaseConfigStatus();
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-heading">
                    Supabase Authentication & Database Integration (Phase 1)
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
                    configStatus.isConfigured 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {configStatus.isConfigured ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Configured</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>Credentials Required</span>
                      </>
                    )}
                  </span>
                </div>

                <p className="text-slate-400">
                  NARIVO uses official <code className="text-emerald-300 font-mono">@supabase/supabase-js</code> with token persistence, cryptographic session restore, <code className="text-emerald-300 font-mono">onAuthStateChange</code> listeners, and email verification enforcement.
                </p>

                {/* Configuration status box */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold text-white">Vite Environment Configuration (.env)</span>
                    <button
                      onClick={() => handleCopy(`VITE_SUPABASE_URL=https://jokteutbbqxwmwtzzoms.supabase.co\nVITE_SUPABASE_ANON_KEY=sb_publishable_HhSks_J_-BkxZ3Mf7OKLvA_kI7RZHIZ`, 'env_supabase')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {copiedKey === 'env_supabase' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'env_supabase' ? 'Copied' : 'Copy Live Config'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-emerald-300 text-[11px] overflow-x-auto p-3 bg-black/40 rounded-xl border border-white/[0.05]">
{`VITE_SUPABASE_URL="https://jokteutbbqxwmwtzzoms.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_HhSks_J_-BkxZ3Mf7OKLvA_kI7RZHIZ"`}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    Live connection established with project <code className="text-emerald-400 font-mono">jokteutbbqxwmwtzzoms</code>. All authentication requests and database queries for profiles, memberships, and plans target this Supabase project.
                  </p>
                </div>

                {/* Supabase Dashboard Settings Checklist */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Required Supabase Dashboard Settings</span>
                  </span>
                  <div className="space-y-1.5 text-slate-300 text-[11px] pt-1">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">1.</span>
                      <span><strong>Authentication → Providers → Email:</strong> Ensure Email provider is enabled.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">2.</span>
                      <span><strong>Authentication → Email Templates:</strong> Toggle "Confirm email" on to require email verification before account activation.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">3.</span>
                      <span><strong>Authentication → URL Configuration:</strong> Add your app domain to Site URL and Redirect URLs.</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'paystack' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-heading">
                Paystack NIP Nigerian Bank Transfers Integration
              </h4>
              <p className="text-slate-400">
                NARIVO connects to Paystack Transfers API to resolve Nigerian NUBAN recipient account names and dispatch batch withdrawals.
              </p>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
                <span className="text-[11px] text-slate-400 block font-semibold">
                  Required Paystack API Credentials (Server-Side Proxy Route)
                </span>
                <pre className="font-mono text-emerald-300 text-[11px] overflow-x-auto p-2 bg-black/40 rounded-xl">
                  {`PAYSTACK_SECRET_KEY="sk_live_..."
PAYSTACK_PUBLIC_KEY="pk_live_..."`}
                </pre>
                <p className="text-[11px] text-amber-300/90 pt-1">
                  Security note: Never expose PAYSTACK_SECRET_KEY in client code. Route all transfer requests through an authenticated backend proxy.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-heading">
                GitHub Repository & Production CI/CD
              </h4>
              <p className="text-slate-400">
                To connect to GitHub, initialize the repository and push to your private or public GitHub organization:
              </p>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
                <pre className="font-mono text-emerald-300 text-[11px] overflow-x-auto p-2 bg-black/40 rounded-xl">
                  {`git init
git add .
git commit -m "feat: NARIVO Premium Edition"
git remote add origin https://github.com/your-org/narivo.git
git push -u origin main`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
