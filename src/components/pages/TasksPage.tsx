/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Crown,
  FileCheck2,
  RotateCw,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { 
    tasks, 
    tasksLoading, 
    tasksError, 
    submissions, 
    submissionsLoading, 
    setSelectedTaskForSubmission, 
    isAuthenticated, 
    isMembershipActive,
    setCurrentScreen,
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
    showToast('Task marketplace refreshed from database.');
  };

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.sponsorName.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">Sponsored Marketplace</span>
            <span>·</span>
            <span>Verified Brand Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Campaign Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete eligible sponsor activities, submit verification evidence, and earn approved Naira rewards.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || tasksLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh tasks from Supabase"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || tasksLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Premium Policy Notice Banner */}
      {!isMembershipActive && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[11px] leading-relaxed">
              Task submissions require an active Premium membership. Premium registration is currently inactive while pricing is finalized.
            </span>
          </div>
          <button
            onClick={() => setCurrentScreen('membership')}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-100 underline shrink-0 cursor-pointer text-left sm:text-right"
          >
            View Tier Status
          </button>
        </div>
      )}

      {/* Database Error Banner */}
      {tasksError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Failed to load tasks from Supabase: {tasksError}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* View Switcher: Available Tasks vs My Submissions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Submissions ({submissions.length})
          </button>
        </div>

        {activeTab === 'available' && tasks.length > 0 && (
          <div className="relative w-48 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-black/30 border border-white/[0.06] text-xs text-white outline-none focus:border-emerald-500 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
          </div>
        )}
      </div>

      {/* Tab 1: Available Tasks */}
      {activeTab === 'available' && (
        <div className="space-y-3">
          {tasksLoading ? (
            <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Querying verified campaigns from Supabase...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center space-y-3 border border-white/[0.08]">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                  No tasks available right now.
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Active campaigns will appear here once verified advertisers publish new opportunities to the platform.
                </p>
              </div>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {task.sponsorName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {task.title}
                  </h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    {task.instructions.slice(0, 2).map((inst, i) => (
                      <p key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                        <span>{inst}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
                    {formatNaira(task.rewardNaira)}
                  </span>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setCurrentScreen('login');
                      } else {
                        setSelectedTaskForSubmission(task);
                      }
                    }}
                    className="px-4 py-2 rounded-xl btn-emerald-primary text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    View & Submit Proof
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: My Submissions */}
      {activeTab === 'submitted' && (
        <div className="space-y-3">
          {submissionsLoading ? (
            <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Loading your submissions from Supabase...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center space-y-3 border border-white/[0.08]">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                  No task submissions recorded
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  When you submit proof for sponsored campaigns, your audit status will appear here.
                </p>
              </div>
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                      sub.status === 'approved'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : sub.status === 'rejected'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Submitted {sub.submittedAt}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {sub.taskTitle}
                  </h4>
                  {sub.proofUrl && (
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                      Proof: {sub.proofUrl}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                    +{formatNaira(sub.rewardNaira)}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {sub.status === 'approved' ? 'Credited to Available' : 'Audit Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
