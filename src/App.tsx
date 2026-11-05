/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { EmailVerificationBanner } from './components/layout/EmailVerificationBanner';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { TaskSubmitModal } from './components/modals/TaskSubmitModal';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { LandingPage } from './components/pages/LandingPage';
import { AboutPage } from './components/pages/AboutPage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { ContactPage } from './components/pages/ContactPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { LoginPage } from './components/pages/LoginPage';
import { AuthCallbackPage } from './components/pages/AuthCallbackPage';
import { MemberDashboard } from './components/pages/MemberDashboard';
import { TasksPage } from './components/pages/TasksPage';
import { WalletPage } from './components/pages/WalletPage';
import { ReferralPage } from './components/pages/ReferralPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { MembershipPage } from './components/pages/MembershipPage';
import { NotFoundPage } from './components/pages/NotFoundPage';

const MainContent: React.FC = () => {
  const { currentScreen, isAuthenticated, toastMessage } = useApp();

  const isPortalScreen = isAuthenticated && ['dashboard', 'tasks', 'wallet', 'referrals', 'profile', 'membership'].includes(currentScreen);
  const isLanding = currentScreen === 'landing';
  const isAuthScreen = currentScreen === 'login' || currentScreen === 'register' || currentScreen === 'auth-callback';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage />;
      case 'about':
        return <AboutPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'contact':
        return <ContactPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'register':
        return <RegisterPage />;
      case 'login':
        return <LoginPage />;
      case 'auth-callback':
        return <AuthCallbackPage />;
      case 'dashboard':
        return <MemberDashboard />;
      case 'tasks':
        return <TasksPage />;
      case 'wallet':
        return <WalletPage />;
      case 'referrals':
        return <ReferralPage />;
      case 'profile':
        return <ProfilePage />;
      case 'membership':
        return <MembershipPage />;
      case 'not-found':
        return <NotFoundPage />;
      default:
        return <NotFoundPage />;
    }
  };

  // Minimal, uncompromised Emerald Glass layout for landing and auth screens (no top nav, no bottom nav, no footer marketing clutter)
  if (isLanding || isAuthScreen) {
    return (
      <div className="min-h-screen flex flex-col bg-[#022c22] text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950 relative overflow-x-hidden">
        <main className="flex-1 flex flex-col">
          {renderScreen()}
        </main>

        {/* Reactive Toast Notification */}
        {toastMessage && (
          <div 
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-4 z-50 glass-panel bg-[#064e3b]/95 text-white px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-emerald-400/30 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-150"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#06090c] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Top Notice Banner */}
      <EmailVerificationBanner />

      {/* Main Layout Container */}
      {isPortalScreen ? (
        <div className="flex-1 flex min-h-screen">
          {/* Desktop Luxury Sidebar */}
          <Sidebar />

          {/* Main View Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 pb-24 md:pb-12">
              {renderScreen()}
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {renderScreen()}
          </main>
          <Footer />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals */}
      <TaskSubmitModal />
      <ArchitectureModal />

      {/* Reactive Toast Notification */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 z-50 glass-panel bg-[#0c131a]/95 text-white px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-emerald-500/30 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-150"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
