/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCategory } from '../../types';
import { formatNaira } from '../../utils/formatters';
import { 
  Search, 
  Clock, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Building2,
  Sparkles,
  Filter,
  Check,
  ExternalLink
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, submissions, setSelectedTaskForSubmission, isAuthenticated, setCurrentScreen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<'all' | 'verified' | 'sample'>('all');
  const [activeTab, setActiveTab] = useState<'available' | 'submitted'>('available');

  const categories: TaskCategory[] = [
    'All',
    'Social Engagement',
    'App Testing',
    'Surveys & Feedback',
    'Content Creation',
    'Channel Follow',
  ];

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sponsorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = 
      campaignTypeFilter === 'all' ||
      (campaignTypeFilter === 'verified' && task.campaignType === 'verified_sponsor') ||
      (campaignTypeFilter === 'sample' && task.campaignType === 'sample_demo');
    return matchesCategory && matchesSearch && matchesType;
  });

  const getSubmissionForTask = (taskId: string) => {
    return submissions.find((s) => s.taskId === taskId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header & View Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">Exchange Catalog</span>
            <span>·</span>
            <span>Genuine Advertiser Campaigns</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
            Sponsored Tasks Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Earn approved rewards in Naira (₦) by completing authenticated brand tasks or previewing sample campaigns.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/[0.08] shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'available'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {activeTab === 'available' ? (
        <>
          {/* 2. Verification Disclaimer Pill */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/[0.08]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs font-bold block">
                  Authenticity & Audit Standard
                </strong>
                <span className="text-slate-400 text-xs leading-relaxed">
                  Campaigns are clearly distinguished between <strong className="text-emerald-300">[Verified Sponsor Campaign]</strong> funded by verified advertisers and <strong className="text-amber-300">[Sample Demo Task]</strong> for previewing the submission workflow.
                </span>
              </div>
            </div>

            {/* Campaign Authenticity Filter */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.07] shrink-0">
              <button
                onClick={() => setCampaignTypeFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  campaignTypeFilter === 'all'
                    ? 'bg-white/[0.1] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCampaignTypeFilter('verified')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  campaignTypeFilter === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Verified Only
              </button>
              <button
                onClick={() => setCampaignTypeFilter('sample')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  campaignTypeFilter === 'sample'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sample Only
              </button>
            </div>
          </div>

          {/* 3. Search and Category Segmented Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search campaigns by brand, app name, or task description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.09] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white/[0.07] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Task Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full py-16 text-center glass-panel rounded-3xl p-8 space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-heading">
                  No matching tasks found
                </h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query, selecting another category, or clearing the filter.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setCampaignTypeFilter('all'); }}
                  className="px-4 py-2 rounded-xl btn-emerald-primary text-white text-xs font-bold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const submission = getSubmissionForTask(task.id);
                const percentRemaining = Math.round((task.remainingSlots / task.totalSlots) * 100);

                return (
                  <div
                    key={task.id}
                    className="glass-panel rounded-3xl p-6 glass-card-interactive flex flex-col justify-between space-y-5 border border-white/[0.08]"
                  >
                    <div className="space-y-3.5">
                      {/* Top Badges & Reward */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-block">
                            {task.category}
                          </span>
                          <div className="text-[10px] font-semibold">
                            {task.campaignType === 'verified_sponsor' ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified Sponsor Campaign</span>
                              </span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Sample Demo Task</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xl font-black font-mono text-emerald-300">
                            {formatNaira(task.rewardNaira)}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Per verified submission</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h2 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                          {task.title}
                        </h2>
                        <p className="text-xs text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">
                          {task.instructions[0] || task.proofRequirements.description}
                        </p>
                      </div>

                      {/* Sponsor & Estimated Time */}
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-slate-300 truncate">{task.sponsorName}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0 font-medium text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>~{task.estimatedMinutes} mins</span>
                        </span>
                      </div>

                      {/* Slots Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Slots Remaining</span>
                          <span className="font-bold text-slate-300">
                            {task.remainingSlots} of {task.totalSlots} slots
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                            style={{ width: `${percentRemaining}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {submission ? (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                          <span className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Proof Submitted (Under Sponsor Audit)</span>
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedTaskForSubmission(task)}
                          className="w-full py-3 rounded-xl btn-emerald-primary text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <span>Start Task & Submit Proof</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* 5. My Submissions Tab */
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.08]">
            <h2 className="text-lg font-bold text-white font-heading">
              Your Task Submissions & Verification Status
            </h2>
            <p className="text-xs text-slate-400">
              Submitted proofs are audited within 24-48 hours by the campaign sponsor. Approved tasks credit directly to your Available Balance.
            </p>

            {submissions.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  You have not submitted proof for any sponsored tasks yet.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-4 py-2 rounded-xl btn-emerald-primary text-white text-xs font-bold cursor-pointer"
                >
                  Browse Available Tasks
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-white truncate">
                          {sub.taskTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          · {sub.sponsorName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                        <span>Submitted on: {sub.submittedAt}</span>
                        {sub.proofUsername && <span>· User handle: {sub.proofUsername}</span>}
                      </div>
                      {sub.proofNotes && (
                        <p className="text-[11px] text-slate-500 italic mt-1">
                          "{sub.proofNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-base font-black font-mono text-emerald-400">
                        {formatNaira(sub.rewardNaira)}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        sub.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : sub.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
