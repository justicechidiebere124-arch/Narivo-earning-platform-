/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'standard' | 'highlight';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'standard',
  className = '',
}) => {
  return (
    <div
      className={`
        p-4 sm:p-5 rounded-2xl border transition-all duration-150 space-y-2
        ${variant === 'highlight' 
          ? 'bg-gradient-to-br from-[#063124] to-[#031c14] border-emerald-500/30' 
          : 'bg-[#0b1016] border-white/[0.07]'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs font-semibold tracking-tight text-slate-400">
          {label}
        </span>
        {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      </div>

      <div className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white tracking-tight">
        {value}
      </div>

      {subtext && (
        <p className="text-[11px] text-slate-400 leading-tight">
          {subtext}
        </p>
      )}
    </div>
  );
};
