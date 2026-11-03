/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Users, 
  User, 
  Terminal, 
  LogOut, 
  ArrowUpRight,
  ShieldCheck,
  Crown
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    user, 
    availableBalance, 
    isMembershipActive,
    logout, 
    setIsArchitectureModalOpen 
  } = useApp();

  const navItems: { id: ScreenType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'tasks', label: 'Sponsored Tasks', icon: CheckSquare },
    { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
    { id: 'membership', label: 'Membership Tiers', icon: Crown },
    { id: 'referrals', label: 'Referral Network', icon: Users },
    { id: 'profile', label: 'Profile & Bank', icon: User },
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col shrink-0 min-h-screen border-r border-white/[0.07] bg-[#070b0f]/90 backdrop-blur-2xl sticky top-0 z-30">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/[0.06]">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_28px_rgba(16,185,129,0.55)] transition-all">
              N
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b0f]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white font-heading block">
              NARIVO
            </span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase block -mt-0.5">
              Member Portal
            </span>
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Platform Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentScreen(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-950/80 to-emerald-900/30 text-emerald-300 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 stroke-[2.2]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
            </button>
          );
        })}

        {/* Sidebar Wallet Glance Widget */}
        <div className="pt-6">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 font-medium">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                Available Wallet
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-white tracking-tight tabular-nums my-1">
              {formatNaira(availableBalance)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
              <span className="text-slate-500">Min payout: ₦5,000</span>
              <button
                onClick={() => setCurrentScreen('wallet')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Payout</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Footer Profile & Architecture */}
      <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#05080b]/60">
        <button
          onClick={() => setIsArchitectureModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-white/[0.05] hover:border-emerald-500/30 transition-all cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Supabase Integration Blueprint</span>
        </button>

        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.fullName ? user.fullName.charAt(0) : 'N'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName || 'NARIVO Member'}
              </div>
              <div className="text-[10px] text-emerald-400/90 truncate flex items-center gap-1">
                {isMembershipActive ? (
                  <>
                    <Crown className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span>Premium Member</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span>Registered Member</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Sign out of portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
