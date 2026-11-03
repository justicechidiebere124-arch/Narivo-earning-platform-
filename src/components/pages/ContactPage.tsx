/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePageSeo } from '../../hooks/usePageSeo';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  Building2,
  ShieldCheck
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePageSeo({
    title: 'Contact NARIVO – Member Support and Inquiries Nigeria',
    description: 'Get in touch with NARIVO platform support for task verification questions, advertiser inquiries, and member account assistance.',
    canonicalPath: '/contact',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 15) {
      setError('Please provide a detailed message (at least 15 characters).');
      return;
    }

    setLoading(true);
    // Simulate safe client-side contact submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* 1. Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-white/[0.06] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Support & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
          Get in Touch with the NARIVO Team
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Have a question about task audits, your member account, or advertising campaigns? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column: Contact Channels */}
        <div className="md:col-span-2 space-y-5">
          <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] space-y-4">
            <h2 className="text-base font-bold text-white font-heading">
              Official Communication
            </h2>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">General & Member Support</span>
                <a 
                  href="mailto:support@narivo.site" 
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-sm block"
                >
                  support@narivo.site
                </a>
                <span className="text-[11px] text-slate-400">Account issues, task audit inquiries, and withdrawals.</span>
              </div>

              <div className="space-y-1 pt-3 border-t border-white/[0.06]">
                <span className="text-slate-400 block font-semibold">Advertiser Partnerships</span>
                <a 
                  href="mailto:advertisers@narivo.site" 
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-sm block"
                >
                  advertisers@narivo.site
                </a>
                <span className="text-[11px] text-slate-400">Campaign onboarding, task budgeting, and brand sponsorships.</span>
              </div>

              <div className="space-y-1 pt-3 border-t border-white/[0.06]">
                <span className="text-slate-400 block font-semibold">Privacy & Compliance</span>
                <a 
                  href="mailto:privacy@narivo.site" 
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-sm block"
                >
                  privacy@narivo.site
                </a>
                <span className="text-[11px] text-slate-400">Data protection, terms compliance, and policy inquiries.</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#090f15] border border-white/[0.08] text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Response Window</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our support team operates remotely across Nigeria. Inquiries are typically reviewed and answered within 24 to 48 business hours.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="md:col-span-3">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08] space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-white font-heading">
              Send a Direct Message
            </h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Message Received</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out. A platform representative will review your message and reply to <strong className="text-white">{email}</strong> within 24–48 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setName('');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chinedu Okafor"
                    className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@domain.com"
                    className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Inquiry Category</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#090f14] border border-white/[0.08] focus:border-emerald-500 text-white outline-none cursor-pointer"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Task Proof / Audit">Task Proof / Verification Audit</option>
                    <option value="Withdrawals & Balance">Bank Withdrawals & Balance</option>
                    <option value="Advertiser Campaign">Advertiser Campaign Sponsoring</option>
                    <option value="Bug or Issue">Bug Report or Technical Issue</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Message Details</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide relevant details regarding your inquiry..."
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/[0.08] focus:border-emerald-500 text-white outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl btn-emerald-primary text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
