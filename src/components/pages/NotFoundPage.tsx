/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePageSeo } from '../../hooks/usePageSeo';
import { Button, Card } from '../ui';
import { Home, Search, Mail, ArrowLeft, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useApp();

  usePageSeo({
    title: '404 – Page Not Found | NARIVO',
    description: 'The requested page could not be found on NARIVO. Return to the marketplace overview or browse sponsored opportunities in Nigeria.',
    canonicalPath: '/404',
  });

  const navigateTo = (screen: any) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-8">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono font-semibold">
        <span className="w-2 h-2 rounded-full bg-rose-400" />
        <span>HTTP Error 404</span>
      </div>

      {/* Main Display */}
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <HelpCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
          The page you requested could not be located on the NARIVO platform. It may have been moved, updated, or does not exist.
        </p>
      </div>

      {/* Primary Action Card */}
      <Card variant="elevated" className="p-6 sm:p-8 space-y-4 max-w-lg mx-auto text-left">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
          Helpful Destinations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'landing')}
            variant="primary"
            size="md"
            className="w-full justify-start text-xs"
            leftIcon={<Home className="w-4 h-4" />}
          >
            {isAuthenticated ? 'Member Dashboard' : 'Homepage Overview'}
          </Button>

          <Button
            onClick={() => navigateTo('tasks')}
            variant="secondary"
            size="md"
            className="w-full justify-start text-xs"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Browse Campaigns
          </Button>

          <Button
            onClick={() => navigateTo('how-it-works')}
            variant="secondary"
            size="md"
            className="w-full justify-start text-xs"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            How It Works
          </Button>

          <Button
            onClick={() => navigateTo('contact')}
            variant="secondary"
            size="md"
            className="w-full justify-start text-xs"
            leftIcon={<Mail className="w-4 h-4" />}
          >
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
};
