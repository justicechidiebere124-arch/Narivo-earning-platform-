/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, ArrowRight, Wallet, LogOut, Terminal, User } from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    isAuthenticated, 
    availableBalance, 
    logout, 
    setIsArchitectureModalOpen 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (screen: any) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 bg-[#070b0f]/90 backdrop-blur-2xl border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-6">
        {/* Brand Identity */}
        <button
          onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] transition-all">
              N
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070b0f]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-heading">
                NARIVO
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Nigeria
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block -mt-0.5">
              Sponsored-Task Exchange
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          {!isAuthenticated ? (
            <>
              <button 
                onClick={() => navigateTo('landing')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'landing' 
                    ? 'text-white bg-white/[0.08]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => navigateTo('tasks')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'tasks' 
                    ? 'text-white bg-white/[0.08]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Campaigns
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigateTo('dashboard')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'dashboard' 
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigateTo('tasks')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'tasks' 
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Tasks
              </button>
              <button 
                onClick={() => navigateTo('wallet')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'wallet' 
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Wallet
              </button>
              <button 
                onClick={() => navigateTo('referrals')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'referrals' 
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Referrals
              </button>
              <button 
                onClick={() => navigateTo('membership')} 
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  currentScreen === 'membership' 
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Membership
              </button>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigateTo('login')}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigateTo('register')}
                className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white btn-emerald-primary rounded-xl cursor-pointer"
              >
                <span>Register Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('wallet')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer hover:border-emerald-500/30"
                title="View wallet & balance"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono tabular-nums text-white text-xs font-bold">
                  {formatNaira(availableBalance)}
                </span>
              </button>

              <button
                onClick={() => navigateTo('profile')}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
                title="Profile & Bank Settings"
              >
                <User className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Sign out"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-xs font-bold"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono tabular-nums">{formatNaira(availableBalance)}</span>
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
        <div className="md:hidden border-b border-white/[0.08] bg-[#070b0f]/95 backdrop-blur-3xl px-4 py-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigateTo('landing')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
                >
                  Overview & How It Works
                </button>
                <button
                  onClick={() => navigateTo('tasks')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
                >
                  Campaigns
                </button>
                <button
                  onClick={() => navigateTo('login')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigateTo('register')}
                  className="w-full text-center mt-2 px-4 py-3 rounded-xl text-xs font-bold text-white btn-emerald-primary min-h-[44px] flex items-center justify-center gap-2"
                >
                  <span>Register Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center justify-between"
                >
                  <span>Dashboard</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
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
                  <div className="flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Wallet</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">
                    {formatNaira(availableBalance)}
                  </span>
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
                  Membership
                </button>
                <button
                  onClick={() => navigateTo('profile')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-white/[0.06] min-h-[44px] flex items-center"
                >
                  Profile & Bank
                </button>
                <button
                  onClick={() => setIsArchitectureModalOpen(true)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-950/30 min-h-[44px] flex items-center gap-2"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Integration Architecture</span>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
