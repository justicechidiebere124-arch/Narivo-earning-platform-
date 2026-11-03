/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { Modal, Input, Button, Badge } from '../ui';
import { 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Send
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      const result = await submitTaskProof(task.id, {
        proofUrl: proofUrl.trim() || (uploadedFileName ? `https://storage.narivo.internal/proofs/${uploadedFileName}` : undefined),
        proofUsername: proofUsername.trim() || undefined,
        proofNotes: proofNotes.trim() || undefined,
      });

      if (result.success) {
        setSelectedTaskForSubmission(null);
      } else {
        setErrorMsg(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  return (
    <Modal
      isOpen={Boolean(selectedTaskForSubmission)}
      onClose={() => setSelectedTaskForSubmission(null)}
      title={task.title}
      description={`${task.category} · Sponsored by ${task.sponsorName}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Reward and Window Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#063b2a]/40 to-[#04241a]/40 border border-emerald-500/30 flex items-center justify-between">
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
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 space-y-2">
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
            <Input
              label={task.proofRequirements.description || 'Your Social Media Handle or App User ID'}
              type="text"
              placeholder="@yourhandle or user_10492"
              value={proofUsername}
              onChange={(e) => setProofUsername(e.target.value)}
            />
          )}

          {/* Link URL requirement */}
          {(task.proofRequirements.type === 'link' || task.proofRequirements.type === 'multiple') && (
            <Input
              label="Verification URL / Proof Link"
              type="url"
              placeholder="https://..."
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
          )}

          {/* Screenshot file upload */}
          {(task.proofRequirements.type === 'screenshot' || task.proofRequirements.type === 'multiple') && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Screenshot Proof (PNG, JPG, or PDF)
              </label>
              <div className="relative border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-xl p-5 text-center transition-all bg-white/[0.02]">
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
                  <p className="text-[10px] text-slate-500 font-mono">Max file size 5MB</p>
                </div>
              </div>
            </div>
          )}

          {/* Optional Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Additional Verification Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Mention any specific confirmation codes, transaction IDs, or comments..."
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Anti-Fraud Disclaimer */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              Fraudulent proof, stolen screenshots, or fake reviews will lead to immediate account suspension and forfeiture of unapproved rewards.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setSelectedTaskForSubmission(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="flex-1"
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Proof'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
