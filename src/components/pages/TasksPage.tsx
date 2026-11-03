/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { 
  Search, 
  RotateCw, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Crown,
  ShieldCheck
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
    showToast('Task marketplace synchronized with database.');
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
          <span className="text-xs font-semibold text-emerald-400 block">
            Campaign Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading mt-0.5">
            Sponsored Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Browse advertiser-funded tasks, follow instructions, submit genuine proof and track approved Naira rewards.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing || tasksLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          title="Refresh tasks from database"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing || tasksLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Database Error Banner */}
      {tasksError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Unable to retrieve campaigns from database.</span>
          </div>
          <Button variant="secondary" size="sm" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      {/* Segmented Controls & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0b1016] border border-white/[0.07] text-xs">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Submissions ({submissions.length})
          </button>
        </div>

        {activeTab === 'available' && tasks.length > 0 && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#0b1016] border border-white/[0.07] text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3.5 pointer-events-none" />
          </div>
        )}
      </div>

      {/* TAB 1: AVAILABLE TASKS */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {tasksLoading ? (
            <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Querying verified campaigns from database...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={<FileCheck2 className="w-6 h-6 text-slate-400" />}
              title="No sponsored tasks are available right now. Please check back later."
              description="New campaigns are published directly by verified corporate sponsors. Check back soon for new task opportunities."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  variant="standard"
                  padding="md"
                  className="flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {task.sponsorName}
                      </span>
                      <Badge variant="emerald">
                        Verified Campaign
                      </Badge>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                      {task.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                      {task.instructions.slice(0, 2).map((inst, idx) => (
                        <p key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{inst}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">Reward</span>
                      <span className="text-base sm:text-lg font-black font-mono text-emerald-400 tabular-nums">
                        {formatNaira(task.rewardNaira)}
                      </span>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setCurrentScreen('login');
                        } else {
                          setSelectedTaskForSubmission(task);
                        }
                      }}
                    >
                      View & Submit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY SUBMISSIONS */}
      {activeTab === 'submitted' && (
        <div className="space-y-3">
          {submissionsLoading ? (
            <div className="py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Loading submissions from database...</span>
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-6 h-6 text-slate-400" />}
              title="No task submissions recorded yet."
              description="When you complete sponsored tasks and submit verification proof, audit tracking will appear here."
              actionLabel="Explore Available Tasks"
              onAction={() => setActiveTab('available')}
            />
          ) : (
            <div className="space-y-2.5">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-[#0b1016] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          sub.status === 'approved' 
                            ? 'success' 
                            : sub.status === 'rejected' 
                              ? 'danger' 
                              : 'warning'
                        }
                      >
                        {sub.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-[11px] text-slate-500">
                        Submitted {sub.submittedAt}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {sub.taskTitle}
                    </h4>

                    {sub.proofUrl && (
                      <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                        Proof: {sub.proofUrl}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-bold font-mono text-emerald-400 tabular-nums">
                      +{formatNaira(sub.rewardNaira)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {sub.status === 'approved' ? 'Credited to available' : 'Under sponsor audit'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
