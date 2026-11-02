/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  X, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Building2, 
  FileText,
  Send,
  Sparkles
} from 'lucide-react';

export const TaskSubmitModal: React.FC = () => {
  const { selectedTaskForSubmission, setSelectedTaskForSubmission, submitTaskProof } = useApp();
  const [proofUsername, setProofUsername] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!selectedTaskForSubmission) return null;

  const task = selectedTaskForSubmission;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation based on proof requirement
    if (task.proofRequirements.type === 'username' && !proofUsername.trim()) {
      setErrorMsg('Please enter your handle, username, or completion code.');
      return;
    }
    if (task.proofRequirements.type === 'link' && !proofUrl.trim()) {
      setErrorMsg('Please provide the direct public URL.');
      return;
    }
    if ((task.proofRequirements.type === 'screenshot' || task.proofRequirements.type === 'multiple') && !uploadedFileName && !proofUsername.trim() && !proofUrl.trim()) {
      setErrorMsg('Please upload a screenshot or provide the verification identifier.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = submitTaskProof(task.id, {
        proofUrl: proofUrl.trim() || (uploadedFileName ? `https://storage.narivo.internal/proofs/${uploadedFileName}` : undefined),
        proofUsername: proofUsername.trim() || undefined,
        proofNotes: proofNotes.trim() || undefined,
      });

      setIsSubmitting(false);
      if (result.success) {
        setSelectedTaskForSubmission(null);
      } else {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleSimulateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/[0.12] relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 sticky top-0 bg-[#0c131a]/95 backdrop-blur-xl z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span>{task.category}</span>
              <span>·</span>
              <span>{task.sponsorName}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-snug">
              {task.title}
            </h3>
          </div>
          <button
            onClick={() => setSelectedTaskForSubmission(null)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Reward and Window Callout */}
          <div className="p-4 rounded-2xl glass-panel-emerald border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-heading">
                Reward Upon Approval
              </span>
              <span className="text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                {formatNaira(task.rewardNaira)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Audit Window</span>
              </span>
              <span className="text-xs font-bold text-slate-200">
                24–48 Hours
              </span>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">
              Task Execution Instructions
            </h4>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 space-y-2">
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                {task.instructions.map((inst, index) => (
                  <li key={index} className="text-slate-300">
                    {inst}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Handle / Username requirement */}
            {(task.proofRequirements.type === 'username' || task.proofRequirements.type === 'multiple') && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {task.proofRequirements.description || 'Your Social Media Handle or App User ID'}
                </label>
                <input
                  type="text"
                  placeholder="@yourhandle or user_10492"
                  value={proofUsername}
                  onChange={(e) => setProofUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            )}

            {/* Link URL requirement */}
            {(task.proofRequirements.type === 'link' || task.proofRequirements.type === 'multiple') && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Verification URL / Proof Link
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
              </div>
            )}

            {/* Screenshot file upload simulation */}
            {(task.proofRequirements.type === 'screenshot' || task.proofRequirements.type === 'multiple') && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Screenshot Proof (PNG, JPG, or PDF)
                </label>
                <div className="relative border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 text-center transition-all bg-white/[0.02]">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSimulateFile}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1 text-slate-400">
                    <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">
                      {uploadedFileName ? (
                        <span className="text-emerald-400 font-semibold">{uploadedFileName}</span>
                      ) : (
                        'Tap to upload screenshot'
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">Max file size 5MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Additional Verification Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention any specific confirmation codes, transaction IDs, or comments..."
                value={proofNotes}
                onChange={(e) => setProofNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
              />
            </div>

            {/* Anti-Fraud Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                Fraudulent proof, stolen screenshots, or fake reviews will lead to immediate account suspension and forfeiture of unapproved rewards.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl btn-emerald-primary text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Encrypting & Submitting Proof...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Proof for Sponsor Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
