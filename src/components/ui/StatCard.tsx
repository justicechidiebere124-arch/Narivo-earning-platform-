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
          ? 'bg-gradient-to-br from-[#064e3b]/80 to-[#032a20]/90 backdrop-blur-xl border-emerald-400/35 shadow-[0_12px_32px_rgba(1,26,20,0.6)]' 
          : 'bg-[#064e3b]/30 backdrop-blur-xl border-emerald-400/20 shadow-[0_8px_24px_rgba(1,26,20,0.4)]'}
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
