/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { 
  Menu, 
  X, 
  Wallet, 
  User, 
  LogOut, 
  ArrowRight,
  Crown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    isAuthenticated, 
    availableBalance, 
    isMembershipActive,
    logout,
    user
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (screen: any) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard': return 'Member Dashboard';
      case 'tasks': return 'Sponsored Tasks';
      case 'wallet': return 'Wallet & Withdrawals';
      case 'referrals': return 'Referral Network';
      case 'membership': return 'Membership Tier';
      case 'profile': return 'Profile Settings';
      case 'about': return 'About NARIVO';
      case 'how-it-works': return 'How It Works';
      case 'contact': return 'Contact & Support';
      case 'terms': return 'Terms of Service';
      case 'privacy': return 'Privacy Policy';
      default: return 'Marketplace';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#070b10]/95 backdrop-blur-xl border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Identity */}
        <button
          onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_2px_10px_rgba(16,185,129,0.25)]">
            N
          </div>
          <span className="text-lg font-black tracking-tight text-white font-heading">
            NARIVO
          </span>
        </button>

        {/* Zone 2: Navigation Links or Authenticated Title */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <button 
              onClick={() => navigateTo('landing')} 
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'landing' ? 'text-white' : ''
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => navigateTo('how-it-works')} 
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'how-it-works' ? 'text-white' : ''
              }`}
            >
              How It Works
            </button>
            <button 
              onClick={() => navigateTo('tasks')} 
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'tasks' ? 'text-white' : ''
              }`}
            >
              Campaigns
            </button>
            <button 
              onClick={() => navigateTo('about')} 
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'about' ? 'text-white' : ''
              }`}
            >
              About
            </button>
            <button 
              onClick={() => navigateTo('contact')} 
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'contact' ? 'text-white' : ''
              }`}
            >
              Contact
            </button>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="text-slate-500">Portal</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{getScreenTitle()}</span>
          </div>
        )}

        {/* Zone 3: Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateTo('login')}
              >
                Log In
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => navigateTo('register')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Create Free Account
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('wallet')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title="View Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono tabular-nums text-white text-xs font-bold">
                  {formatNaira(availableBalance)}
                </span>
              </button>

              <button
                onClick={() => navigateTo('profile')}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Member Profile"
              >
                <User className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <button
              onClick={() => navigateTo('wallet')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white text-xs font-bold font-mono"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formatNaira(availableBalance)}</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer border border-white/[0.08]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#070b10]/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {!isAuthenticated ? (
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => navigateTo('landing')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Overview
              </button>
              <button
                onClick={() => navigateTo('how-it-works')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                How It Works
              </button>
              <button
                onClick={() => navigateTo('tasks')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Campaign Tasks
              </button>
              <button
                onClick={() => navigateTo('about')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                About NARIVO
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigateTo('terms')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Terms of Service
              </button>
              <button
                onClick={() => navigateTo('privacy')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Privacy Policy
              </button>
              <div className="pt-2 border-t border-white/[0.08] space-y-2">
                <Button variant="secondary" fullWidth size="md" onClick={() => navigateTo('login')}>
                  Log In
                </Button>
                <Button variant="primary" fullWidth size="md" onClick={() => navigateTo('register')}>
                  Create Free Account
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => navigateTo('dashboard')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center justify-between"
              >
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigateTo('tasks')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Tasks
              </button>
              <button
                onClick={() => navigateTo('wallet')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center justify-between"
              >
                <span>Wallet</span>
                <span className="font-mono text-emerald-400 font-bold">{formatNaira(availableBalance)}</span>
              </button>
              <button
                onClick={() => navigateTo('referrals')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Referrals
              </button>
              <button
                onClick={() => navigateTo('membership')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Membership Tier
              </button>
              <button
                onClick={() => navigateTo('profile')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Profile & Bank Settings
              </button>
              <div className="pt-2 border-t border-white/[0.08]">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 min-h-[44px] flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
