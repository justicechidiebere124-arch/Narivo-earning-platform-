/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
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
    logout 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, screen: ScreenType) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      navigateTo(screen);
    }
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
        <a
          href={isAuthenticated ? SCREEN_ROUTES['dashboard'] : SCREEN_ROUTES['landing']}
          onClick={(e) => handleLinkClick(e, isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_2px_10px_rgba(16,185,129,0.25)]">
            N
          </div>
          <span className="text-lg font-black tracking-tight text-white font-heading">
            NARIVO
          </span>
        </a>

        {/* Zone 2: Navigation Links or Authenticated Title */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a 
              href={SCREEN_ROUTES['landing']}
              onClick={(e) => handleLinkClick(e, 'landing')}
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'landing' ? 'text-white' : ''
              }`}
            >
              Overview
            </a>
            <a 
              href={SCREEN_ROUTES['how-it-works']}
              onClick={(e) => handleLinkClick(e, 'how-it-works')}
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'how-it-works' ? 'text-white' : ''
              }`}
            >
              How It Works
            </a>
            <a 
              href={SCREEN_ROUTES['tasks']}
              onClick={(e) => handleLinkClick(e, 'tasks')}
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'tasks' ? 'text-white' : ''
              }`}
            >
              Campaigns
            </a>
            <a 
              href={SCREEN_ROUTES['about']}
              onClick={(e) => handleLinkClick(e, 'about')}
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'about' ? 'text-white' : ''
              }`}
            >
              About
            </a>
            <a 
              href={SCREEN_ROUTES['contact']}
              onClick={(e) => handleLinkClick(e, 'contact')}
              className={`transition-colors cursor-pointer hover:text-white whitespace-nowrap ${
                currentScreen === 'contact' ? 'text-white' : ''
              }`}
            >
              Contact
            </a>
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
              <a
                href={SCREEN_ROUTES['login']}
                onClick={(e) => handleLinkClick(e, 'login')}
                className="inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-[0.98] text-xs px-3.5 py-2 min-h-[40px] gap-1.5 bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 border border-transparent"
              >
                Log In
              </a>
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
              <a
                href={SCREEN_ROUTES['wallet']}
                onClick={(e) => handleLinkClick(e, 'wallet')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title="View Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono tabular-nums text-white text-xs font-bold">
                  {formatNaira(availableBalance)}
                </span>
              </a>

              <a
                href={SCREEN_ROUTES['profile']}
                onClick={(e) => handleLinkClick(e, 'profile')}
                className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Member Profile"
              >
                <User className="w-4 h-4" />
              </a>

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
            <a
              href={SCREEN_ROUTES['wallet']}
              onClick={(e) => handleLinkClick(e, 'wallet')}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-emerald-400 font-mono text-xs font-bold"
            >
              {formatNaira(availableBalance)}
            </a>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#070b10]/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {!isAuthenticated ? (
            <div className="flex flex-col space-y-1">
              <a
                href={SCREEN_ROUTES['landing']}
                onClick={(e) => handleLinkClick(e, 'landing')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Overview
              </a>
              <a
                href={SCREEN_ROUTES['how-it-works']}
                onClick={(e) => handleLinkClick(e, 'how-it-works')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                How It Works
              </a>
              <a
                href={SCREEN_ROUTES['tasks']}
                onClick={(e) => handleLinkClick(e, 'tasks')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Campaign Tasks
              </a>
              <a
                href={SCREEN_ROUTES['about']}
                onClick={(e) => handleLinkClick(e, 'about')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                About NARIVO
              </a>
              <a
                href={SCREEN_ROUTES['contact']}
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Contact Support
              </a>
              <a
                href={SCREEN_ROUTES['terms']}
                onClick={(e) => handleLinkClick(e, 'terms')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Terms of Service
              </a>
              <a
                href={SCREEN_ROUTES['privacy']}
                onClick={(e) => handleLinkClick(e, 'privacy')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Privacy Policy
              </a>
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
              <a
                href={SCREEN_ROUTES['dashboard']}
                onClick={(e) => handleLinkClick(e, 'dashboard')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center justify-between"
              >
                <span>Dashboard</span>
              </a>
              <a
                href={SCREEN_ROUTES['tasks']}
                onClick={(e) => handleLinkClick(e, 'tasks')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Tasks
              </a>
              <a
                href={SCREEN_ROUTES['wallet']}
                onClick={(e) => handleLinkClick(e, 'wallet')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center justify-between"
              >
                <span>Wallet</span>
                <span className="font-mono text-emerald-400 font-bold">{formatNaira(availableBalance)}</span>
              </a>
              <a
                href={SCREEN_ROUTES['referrals']}
                onClick={(e) => handleLinkClick(e, 'referrals')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Referrals
              </a>
              <a
                href={SCREEN_ROUTES['membership']}
                onClick={(e) => handleLinkClick(e, 'membership')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Membership Tier
              </a>
              <a
                href={SCREEN_ROUTES['profile']}
                onClick={(e) => handleLinkClick(e, 'profile')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
              >
                Profile & Bank Settings
              </a>
              <div className="pt-2 border-t border-white/[0.08]">
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 min-h-[44px] flex items-center gap-2 cursor-pointer"
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
