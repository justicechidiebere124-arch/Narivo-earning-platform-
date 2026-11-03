/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePageSeo } from '../../hooks/usePageSeo';
import { ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  usePageSeo({
    title: 'Terms of Service – NARIVO Marketplace Nigeria',
    description: 'Read the official Terms of Service for NARIVO, detailing member registration rules, task participation, proof verification, rewards, and bank withdrawals in Nigeria.',
    canonicalPath: '/terms',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Platform Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Last revised: November 2026. Please read these terms carefully before creating an account or participating in sponsored campaigns on NARIVO.
        </p>
      </div>

      {/* Notice of Transparency */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> These Terms of Service reflect current operational rules and are published for transparent member notice pending final legal certification prior to full commercial rollout.
        </p>
      </div>

      {/* Terms Content Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or registering an account on NARIVO (accessible via https://narivo.site), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any provision of these terms, you must discontinue platform use immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            2. Eligibility & Member Account Creation
          </h2>
          <p>
            You must be at least 18 years of age and reside in Nigeria to register as a member. Registration is 100% free of charge. Users must provide accurate, true, and verifiable information during registration, including your full legal name matching your Nigerian bank records. Each individual is permitted to operate exactly one (1) account. Operating multiple accounts, fictitious profiles, or automated registrations constitutes grounds for permanent termination.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            3. Membership Tiers & Upcoming Premium
          </h2>
          <p>
            Account registration creates a standard member profile with zero subscription charges. NARIVO incorporates an upcoming Premium membership tier (30-day duration) intended for priority campaign access and expedited audit windows. Currently, the Premium tier price is unconfigured and the tier remains inactive. Users cannot purchase inactive plans. Free registration does not imply a perpetual guarantee of free access to future premium features once configured.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            4. Sponsored Task Rules & Campaign Availability
          </h2>
          <p>
            Tasks hosted on NARIVO are funded and specified by independent third-party advertisers. NARIVO does not guarantee task availability, daily quota volumes, or continuous campaign streams. Tasks may open and close without prior notice when advertiser budget limits or submission caps are reached.
          </p>
          <p>
            Members must strictly adhere to the posted instructions for each task. Failure to execute required steps accurately will result in rejection of the submission.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            5. Verification, Audit & Anti-Fraud Standards
          </h2>
          <p>
            All submitted evidence—including screenshots, URLs, usernames, or completion codes—is subject to an administrative and sponsor audit window (typically 12 to 48 hours). The platform enforces zero tolerance for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Submitting forged, edited, stolen, or duplicate screenshots.</li>
            <li>Using automated scripts, bots, emulators, or VPNs to simulate engagement.</li>
            <li>Re-submitting completed tasks under different identities.</li>
          </ul>
          <p>
            Any verified fraudulent activity results in immediate forfeiture of earned wallet balances and account banning.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            6. Rewards & Wallet Ledger
          </h2>
          <p>
            Rewards are denominated in Nigerian Naira (₦). A task reward is considered pending until the verification audit is successfully completed and approved. Approved rewards are credited to your Available Balance in the ledger. Balances do not accrue interest and do not represent bank deposits.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            7. Bank Withdrawals & Manual Review Process
          </h2>
          <p>
            Members can request a withdrawal once their Available Balance reaches or exceeds ₦5,000.00. Withdrawals are processed exclusively to valid 10-digit NUBAN accounts at licensed Nigerian commercial banks where the account holder name matches the verified member profile.
          </p>
          <p>
            All withdrawal requests undergo manual administrative compliance review before disbursement. Submitting a request reserves the funds but does not constitute completed payment. Payment is finalized only upon confirmed bank credit.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            8. Referral Programme Conditions
          </h2>
          <p>
            Each member receives an invitation code. Referral commission rates, eligible events, and validation criteria are pending administrator configuration and will be published when the programme is formally activated. Referral rewards will be granted solely upon authentic, compliant user participation.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            9. Disclaimers & Limitation of Liability
          </h2>
          <p>
            NARIVO is provided on an "as is" and "as available" basis without warranties of any kind. We explicitly disclaim any promises of guaranteed earnings, financial returns, or specific income. We are not liable for advertiser defaults, temporary network interruptions, or banking delays.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            10. Governing Law & Dispute Resolution
          </h2>
          <p>
            These Terms shall be interpreted in accordance with the laws of the Federal Republic of Nigeria. For questions or disputes regarding these Terms, contact <a href="mailto:support@narivo.site" className="text-emerald-400 underline">support@narivo.site</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
