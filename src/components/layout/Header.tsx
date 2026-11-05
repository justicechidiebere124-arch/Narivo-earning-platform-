/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp, SCREEN_ROUTES, ScreenType } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { 
  Menu, 
  X, 
  Wallet, 
  User, 
  LogOut, 
  Bell, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    isAuthenticated, 
    user,
    availableBalance, 
    isMembershipActive,
    submissions,
    logout 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    setNotificationOpen(false);
    setProfileMenuOpen(false);
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
      case 'dashboard': return 'Dashboard';
      case 'tasks': return 'Tasks';
      case 'wallet': return 'Wallet & Withdrawals';
      case 'referrals': return 'Referrals';
      case 'membership': return 'Membership';
      case 'profile': return 'Profile Settings';
      case 'about': return 'About';
      case 'how-it-works': return 'How It Works';
      case 'contact': return 'Contact';
      case 'terms': return 'Terms';
      case 'privacy': return 'Privacy';
      default: return 'Portal';
    }
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Member';
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'N';

  const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;

  return (
    <header className="sticky top-0 z-30 bg-[#022c22]/85 backdrop-blur-2xl border-b border-emerald-400/20 shadow-[0_4px_24px_rgba(1,26,20,0.6)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Identity */}
        <a
          href={isAuthenticated ? SCREEN_ROUTES['dashboard'] : SCREEN_ROUTES['landing']}
          onClick={(e) => handleLinkClick(e, isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_16px_rgba(52,211,153,0.4)] group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-lg font-black tracking-[0.14em] text-white font-heading">
            NARIVO
          </span>
        </a>

        {/* Zone 2: Navigation Links or Authenticated Breadcrumb */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a 
              href={SCREEN_ROUTES['landing']}
              onClick={(e) => handleLinkClick(e, 'landing')}
              className={`transition-colors cursor-pointer hover:text-white ${
                currentScreen === 'landing' ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              Overview
            </a>
            <a 
              href={SCREEN_ROUTES['how-it-works']}
              onClick={(e) => handleLinkClick(e, 'how-it-works')}
              className={`transition-colors cursor-pointer hover:text-white ${
                currentScreen === 'how-it-works' ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              How It Works
            </a>
            <a 
              href={SCREEN_ROUTES['tasks']}
              onClick={(e) => handleLinkClick(e, 'tasks')}
              className={`transition-colors cursor-pointer hover:text-white ${
                currentScreen === 'tasks' ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              Campaigns
            </a>
            <a 
              href={SCREEN_ROUTES['about']}
              onClick={(e) => handleLinkClick(e, 'about')}
              className={`transition-colors cursor-pointer hover:text-white ${
                currentScreen === 'about' ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              About
            </a>
            <a 
              href={SCREEN_ROUTES['contact']}
              onClick={(e) => handleLinkClick(e, 'contact')}
              className={`transition-colors cursor-pointer hover:text-white ${
                currentScreen === 'contact' ? 'text-emerald-400 font-bold' : ''
              }`}
            >
              Contact
            </a>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-300">
            <span className="text-emerald-400/70 font-medium">Welcome, {firstName}</span>
            <span className="text-emerald-400/30">/</span>
            <span className="text-white font-bold">{getScreenTitle()}</span>
          </div>
        )}

        {/* Zone 3: Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!isAuthenticated ? (
            <>
              <a
                href={SCREEN_ROUTES['login']}
                onClick={(e) => handleLinkClick(e, 'login')}
                className="inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all cursor-pointer text-xs px-4 py-2 min-h-[40px] text-slate-200 hover:text-white hover:bg-white/[0.06]"
              >
                Sign In
              </a>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => navigateTo('register')}
                icon={<ArrowRight className="w-3.5 h-3.5 text-slate-950" />}
                iconPosition="right"
              >
                Get Started
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Task Wallet Quick Balance Button */}
              <button
                type="button"
                onClick={() => navigateTo('wallet')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#064e3b]/50 hover:bg-[#064e3b]/80 border border-emerald-400/25 text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="View Wallet Balances"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono tabular-nums text-white text-xs font-bold">
                  {formatNaira(availableBalance)}
                </span>
              </button>

              {/* Compact Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-emerald-400/20 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer relative"
                  aria-label="View notifications"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {pendingCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  )}
                </button>

                {/* Notification Popover */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#042f24]/95 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_20px_45px_rgba(1,26,20,0.85)] p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-emerald-400/15 pb-2">
                      <span className="text-xs font-bold text-white font-heading">Notifications</span>
                      <span className="text-[10px] text-emerald-300">Account verified</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#064e3b]/40 border border-emerald-400/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Platform Status Active</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {isMembershipActive ? 'Active Premium Member access granted.' : 'Free Registered Member. Browse active sponsor campaigns.'}
                        </p>
                      </div>

                      {pendingCount > 0 && (
                        <div className="p-2.5 rounded-xl bg-[#064e3b]/40 border border-emerald-400/20 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Pending Reviews ({pendingCount})</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Your submitted task proofs are currently under verification.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu Trigger */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-emerald-400/20 text-slate-200 hover:text-white transition-all cursor-pointer"
                  title="Profile Menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                    {initials}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#042f24]/95 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_20px_45px_rgba(1,26,20,0.85)] p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-emerald-400/15">
                      <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Member'}</p>
                      <p className="text-[11px] text-emerald-300/80 truncate font-mono">{user?.email || ''}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('profile')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-300 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Profile & Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('wallet')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 hover:text-emerald-300 transition-colors cursor-pointer text-left"
                    >
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Wallet & Withdrawals</span>
                    </button>

                    <div className="border-t border-emerald-400/15 pt-1">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Actions Header */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => navigateTo('wallet')}
              className="px-2.5 py-1 rounded-xl bg-[#064e3b]/60 border border-emerald-400/25 text-emerald-300 font-mono text-xs font-bold"
            >
              {formatNaira(availableBalance)}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-400/20 bg-[#042f24]/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {!isAuthenticated ? (
            <div className="flex flex-col space-y-1">
              <a
                href={SCREEN_ROUTES['landing']}
                onClick={(e) => handleLinkClick(e, 'landing')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Overview
              </a>
              <a
                href={SCREEN_ROUTES['how-it-works']}
                onClick={(e) => handleLinkClick(e, 'how-it-works')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                How It Works
              </a>
              <a
                href={SCREEN_ROUTES['tasks']}
                onClick={(e) => handleLinkClick(e, 'tasks')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Sponsored Tasks
              </a>
              <div className="pt-2 border-t border-emerald-400/20 space-y-2">
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="sm" 
                  onClick={() => navigateTo('register')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  size="sm" 
                  onClick={() => navigateTo('login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 text-xs">
              <div className="px-3 py-2 rounded-xl bg-black/30 border border-emerald-400/20 mb-2">
                <span className="text-[11px] text-slate-400 block">Signed in as</span>
                <span className="font-bold text-white text-xs block truncate">{user?.fullName || 'Member'}</span>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('dashboard')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigateTo('tasks')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Sponsored Tasks
              </button>
              <button
                type="button"
                onClick={() => navigateTo('wallet')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Wallet & Withdrawals
              </button>
              <button
                type="button"
                onClick={() => navigateTo('referrals')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Referral Network
              </button>
              <button
                type="button"
                onClick={() => navigateTo('profile')}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-emerald-500/15 min-h-[44px] flex items-center"
              >
                Profile & Settings
              </button>
              <div className="pt-2 border-t border-emerald-400/20">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/15 min-h-[44px] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
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
