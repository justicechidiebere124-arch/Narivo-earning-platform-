/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
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

  const authenticatedTabs: { id: ScreenType; label: string; icon: typeof Home }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const publicTabs: { id: ScreenType; label: string; icon: typeof Home }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'login', label: 'Sign In', icon: LogIn },
    { id: 'register', label: 'Register', icon: UserPlus },
  ];

  const currentTabs = isAuthenticated ? authenticatedTabs : publicTabs;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#02281e]/95 backdrop-blur-2xl border-t border-emerald-400/20 shadow-[0_-8px_32px_rgba(1,26,20,0.85)] pb-safe"
    >
      <div className={`grid ${isAuthenticated ? 'grid-cols-5' : 'grid-cols-4'} items-center h-16 max-w-md mx-auto px-1`}>
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <a
              key={tab.id}
              href={SCREEN_ROUTES[tab.id]}
              onClick={(e) => handleLinkClick(e, tab.id)}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center transition-all duration-150 cursor-pointer relative py-1 rounded-xl select-none ${
                isActive 
                  ? 'text-emerald-300' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all ${
                isActive 
                  ? 'bg-emerald-400/20 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]' 
                  : 'text-slate-400'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.2] scale-105 text-emerald-300' : 'stroke-[1.75]'
                }`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${
                isActive ? 'font-bold text-emerald-300' : 'font-medium text-slate-400'
              }`}>
                {tab.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
