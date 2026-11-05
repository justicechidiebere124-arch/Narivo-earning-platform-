/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'elevated' | 'balance' | 'interactive' | 'default';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-150';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const effectiveVariant = variant === 'default' ? 'standard' : variant;

  const variantStyles = {
    standard: 'bg-[#064e3b]/35 backdrop-blur-xl border border-emerald-400/20 text-slate-100 shadow-[0_8px_30px_rgba(1,26,20,0.5)]',
    elevated: 'bg-[#064e3b]/50 backdrop-blur-2xl border border-emerald-400/30 shadow-[0_16px_40px_rgba(1,26,20,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] text-slate-100',
    balance: 'bg-gradient-to-br from-[#064e3b]/85 via-[#043d2e]/90 to-[#022c22]/95 backdrop-blur-2xl border border-emerald-400/40 shadow-[0_20px_50px_rgba(1,26,20,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white',
    interactive: 'bg-[#064e3b]/30 backdrop-blur-xl border border-emerald-400/20 hover:border-emerald-400/45 hover:bg-[#064e3b]/50 text-slate-100 active:scale-[0.99] transition-all cursor-pointer',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${paddingStyles[padding]}
        ${variantStyles[effectiveVariant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
