/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  Search, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  ExternalLink,
  Info
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { 
    tasks, 
    tasksLoading, 
    tasksError, 
    submissions, 
    setSelectedTaskForSubmission, 
    isMembershipActive,
    refreshAllData,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available' | 'submitted'>('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAllData();
    setIsRefreshing(false);
    showToast('Task catalog synchronized with database.');
  };

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.sponsorName.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-400/20">
        <div>
          <span className="text-xs font-semibold text-emerald-300 block">
            Advertiser Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Sponsored Tasks
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Complete verified digital marketing, application testing, and feedback campaigns to earn Naira rewards.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || tasksLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-emerald-400/25 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh tasks from database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || tasksLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {tasksError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Database notice: {tasksError}</span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Controls & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-emerald-400/20 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('available')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Available Tasks ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submitted')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            My Submissions ({submissions.length})
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === 'available' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-emerald-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-black/40 border border-emerald-400/20 text-xs text-white placeholder:text-slate-400 outline-none focus:border-emerald-400"
            />
          </div>
        )}
      </div>

      {/* 3. TASK CONTENT */}
      {activeTab === 'available' ? (
        filteredTasks.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#064e3b]/25 backdrop-blur-xl border border-emerald-400/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-heading">
                No Sponsored Tasks Currently Available
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                All advertiser task quotas are currently fulfilled. New sponsored campaigns are published regularly as brand budgets are approved.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const alreadySubmitted = submissions.some((s) => s.taskId === task.id);
              return (
                <div
                  key={task.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/25 space-y-4 shadow-[0_12px_36px_rgba(1,26,20,0.5)] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                        <span>{task.sponsorName}</span>
                        <span className="text-emerald-400/30">·</span>
                        <span className="text-slate-300">Est. {task.estimatedMinutes} mins</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                        {task.title}
                      </h2>
                    </div>

                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 shrink-0">
                      <span className="text-[11px] text-emerald-300 uppercase font-semibold">Reward</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                        {formatNaira(task.rewardNaira)}
                      </span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-3.5 rounded-2xl bg-black/35 border border-emerald-400/15 text-xs text-slate-300 space-y-1.5">
                    <span className="font-bold text-emerald-300 block text-[11px]">Instructions:</span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                      {task.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions & Status */}
                  <div className="pt-2 border-t border-emerald-400/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Verification Window: {task.verificationWindowHours} hours</span>
                    </div>

                    {alreadySubmitted ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Proof Submitted — Awaiting Review</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedTaskForSubmission(task)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-md active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
                      >
                        <span>Submit Proof</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* MY SUBMISSIONS TAB */
        submissions.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#064e3b]/25 backdrop-blur-xl border border-emerald-400/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-heading">
                No Submissions Yet
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                When you complete a task and submit verification proof, your submission review progress will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-3xl bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-emerald-300 font-bold">{formatNaira(sub.rewardNaira)}</span>
                    <span className="text-emerald-400/40">·</span>
                    <span className="text-slate-400 text-[11px]">{sub.submittedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{sub.taskTitle}</h4>
                  {sub.proofUrl && (
                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                      Proof: {sub.proofUrl}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
                    sub.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : sub.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}>
                    {sub.status === 'pending_review' ? 'Pending Audit' : sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
