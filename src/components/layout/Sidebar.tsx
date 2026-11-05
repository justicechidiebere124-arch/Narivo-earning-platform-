/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  Home, 
  CheckSquare, 
  Wallet, 
  Users, 
  User, 
  LogOut, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    user,
    availableBalance, 
    isMembershipActive,
    logout 
  } = useApp();

  const navItems: { id: ScreenType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'N';

  return (
    <aside className="hidden lg:flex w-64 flex-col shrink-0 min-h-screen border-r border-emerald-400/20 bg-[#02241b]/95 backdrop-blur-2xl sticky top-0 z-30 shadow-[4px_0_30px_rgba(1,26,20,0.5)]">
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-emerald-400/20">
        <a
          href="/dashboard"
          onClick={(e) => handleLinkClick(e, 'dashboard')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_15px_rgba(52,211,153,0.4)] group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <span className="text-lg font-black tracking-[0.14em] text-white font-heading block leading-none">
              NARIVO
            </span>
            <span className="text-[10px] text-emerald-300 font-medium tracking-wider uppercase block mt-1">
              Member Portal
            </span>
          </div>
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest">
          Platform Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <a
              key={item.id}
              href={`/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 shadow-[0_2px_12px_rgba(52,211,153,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
            </a>
          );
        })}
      </div>

      {/* Bottom Balance Card & User Profile */}
      <div className="p-4 border-t border-emerald-400/20 space-y-3">
        {/* Quick Task Wallet Card */}
        <div className="p-3.5 rounded-2xl bg-[#064e3b]/50 border border-emerald-400/25 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-emerald-200">
            <span className="font-semibold">Task Wallet</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base font-bold font-mono text-white tracking-tight">
            {formatNaira(availableBalance)}
          </div>
          <button
            type="button"
            onClick={() => setCurrentScreen('wallet')}
            className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 cursor-pointer pt-0.5"
          >
            <span>Withdraw</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-black/25 border border-emerald-400/15">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {user?.fullName || 'Member'}
              </span>
              <span className="text-[10px] text-emerald-300/80 block truncate">
                {isMembershipActive ? 'Premium Member' : 'Free Member'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
