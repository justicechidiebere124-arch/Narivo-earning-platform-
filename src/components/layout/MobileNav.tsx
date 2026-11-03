/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  CheckSquare, 
  Wallet, 
  Users, 
  User, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b10]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.8)] pb-safe"
    >
      <div className={`grid ${isAuthenticated ? 'grid-cols-5' : 'grid-cols-4'} items-center h-16 max-w-md mx-auto px-1`}>
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
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-all duration-150 cursor-pointer relative py-1 rounded-xl ${
                isActive 
                  ? 'text-emerald-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'text-slate-400'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.2] scale-105' : 'stroke-[1.75]'
                }`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                isActive ? 'font-bold text-emerald-400' : 'font-medium text-slate-400'
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
