/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePageSeo } from '../../hooks/usePageSeo';
import { ShieldCheck, Lock, FileText, AlertCircle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  usePageSeo({
    title: 'Privacy Policy – NARIVO Data Protection Nigeria',
    description: 'Understand how NARIVO collects, protects, and handles personal data, task verification proofs, and Nigerian bank details.',
    canonicalPath: '/privacy',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* 1. Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Data Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Last revised: November 2026. This policy describes how NARIVO collects, uses, stores, and safeguards your personal information when using https://narivo.site.
        </p>
      </div>

      {/* Notice of Transparency */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> This Privacy Policy outlines our transparent data handling practices and is made available for member review pending final legal certification prior to broad commercial release.
        </p>
      </div>

      {/* Policy Content */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            1. Information We Collect
          </h2>
          <p>
            When you interact with NARIVO, we collect information necessary to operate an accountable sponsored-task marketplace:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Account & Contact Data:</strong> Full legal name, email address, phone number, and Nigerian state of residence.</li>
            <li><strong>Banking Information:</strong> Nigerian commercial bank name, bank code, 10-digit NUBAN account number, and registered account holder name for payout disbursement.</li>
            <li><strong>Task Verification Data:</strong> Screenshots, proof URLs, username handles, and completion notes submitted to substantiate campaign participation.</li>
            <li><strong>Technical & Session Data:</strong> IP address, device type, browser information, and session authentication tokens managed via Supabase.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            2. How We Use Your Information
          </h2>
          <p>We use your information exclusively for legitimate platform purposes:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>To create and authenticate your member account profile.</li>
            <li>To audit task submissions against advertiser criteria and prevent duplicate or automated fraud.</li>
            <li>To calculate, record, and maintain your wallet balance and reward ledger.</li>
            <li>To review and execute bank withdrawal disbursements to your verified Nigerian account.</li>
            <li>To send critical operational notifications, including email verification links and security alerts.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            3. Data Sharing & Third Parties
          </h2>
          <p>
            We respect your privacy and never sell, rent, or trade your personal information to third-party data brokers or marketing list aggregators. Information is shared only in the following controlled contexts:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Sponsors & Advertisers:</strong> Only anonymized or sanitized proof submissions (such as screenshots or completion handles) are shared with campaign sponsors to verify task compliance. Private personal details are never exposed.</li>
            <li><strong>Financial & Banking Partners:</strong> Account name and 10-digit NUBAN numbers are utilized to execute validated bank transfers through Nigerian banking channels.</li>
            <li><strong>Legal & Regulatory Authorities:</strong> When required by applicable Nigerian law or court orders to prevent financial fraud or cybercrime.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            4. Data Security & Storage
          </h2>
          <p>
            All member data is secured through industry-standard encryption protocols. Authentication credentials and database access are strictly managed through Supabase with Row Level Security (RLS) policies enforcing that members can only query their own private data. Sensitive tokens are never stored in unencrypted client-accessible plain text.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            5. Data Retention
          </h2>
          <p>
            We retain account data and ledger history for as long as your account remains active or as required by Nigerian financial audit regulations. Task verification screenshots and temporary proof files may be archived or purged after the verification dispute window expires.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            6. Your Rights
          </h2>
          <p>
            You have the right to inspect, correct, update, or request deletion of your personal profile data. If you wish to update your bank details or request account deactivation, you can do so through your Profile screen or by contacting platform support.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white font-heading">
            7. Contact for Privacy Inquiries
          </h2>
          <p>
            For any inquiries, questions, or concerns regarding your privacy or data protection practices, please contact our privacy desk at <a href="mailto:privacy@narivo.site" className="text-emerald-400 underline">privacy@narivo.site</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
