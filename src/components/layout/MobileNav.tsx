/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, CheckSquare, Wallet, Users, User, Home, LogIn, UserPlus } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, isAuthenticated } = useApp();

  const authenticatedTabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  const publicTabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'login', label: 'Log In', icon: LogIn },
    { id: 'register', label: 'Register', icon: UserPlus },
  ] as const;

  const currentTabs = isAuthenticated ? authenticatedTabs : publicTabs;

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b0f]/92 backdrop-blur-3xl border-t border-white/[0.12] shadow-[0_-10px_35px_rgba(0,0,0,0.85)] pb-safe relative"
    >
      {/* Specular top border highlight sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

      <div className={`grid ${isAuthenticated ? 'grid-cols-5' : 'grid-cols-4'} items-center h-16 max-w-md mx-auto px-2`}>
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentScreen(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer relative py-1 rounded-2xl ${
                isActive 
                  ? 'text-emerald-300' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`relative px-2.5 py-1 rounded-xl transition-all ${
                isActive 
                  ? 'bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                  : ''
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive 
                    ? 'stroke-[2.5] scale-105 text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]' 
                    : 'stroke-[1.7]'
                }`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap transition-colors ${
                isActive 
                  ? 'font-bold text-emerald-300' 
                  : 'font-medium text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
