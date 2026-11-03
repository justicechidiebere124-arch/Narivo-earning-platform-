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
  Crown,
  LogOut, 
  Terminal,
  ArrowUpRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    availableBalance, 
    isMembershipActive,
    logout, 
    setIsArchitectureModalOpen 
  } = useApp();

  const navItems: { id: ScreenType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'membership', label: 'Membership', icon: Crown },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col shrink-0 min-h-screen border-r border-white/[0.07] bg-[#070b10] sticky top-0 z-30">
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b border-white/[0.06]">
        <a
          href="/dashboard"
          onClick={(e) => handleLinkClick(e, 'dashboard')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_2px_12px_rgba(16,185,129,0.3)]">
            N
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white font-heading block leading-none">
              NARIVO
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-1">
              Member Portal
            </span>
          </div>
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <a
              key={item.id}
              href={`/${item.id === 'dashboard' ? 'dashboard' : item.id}`}
              onClick={(e) => handleLinkClick(e, item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </a>
          );
        })}

        {/* Sidebar Wallet Glance Widget */}
        <div className="pt-6 px-1">
          <div className="p-4 rounded-xl bg-[#0c1218] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Available</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black font-mono tabular-nums text-white">
              {formatNaira(availableBalance)}
            </div>
            <button
              onClick={() => {
                setCurrentScreen('wallet');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full text-center py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Open Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/[0.06] space-y-2">
        <button
          onClick={() => setIsArchitectureModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Architecture</span>
          </div>
          <ArrowUpRight className="w-3 h-3 text-slate-400" />
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
