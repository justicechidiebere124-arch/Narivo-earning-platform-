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
    standard: 'bg-[#0b1016] border-white/[0.07] text-slate-200',
    elevated: 'bg-[#0f1720] border-white/[0.1] shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-slate-100',
    balance: 'bg-gradient-to-br from-[#063124] via-[#042017] to-[#02130e] border-emerald-500/35 shadow-[0_12px_40px_rgba(4,32,23,0.6)] text-white',
    interactive: 'bg-[#0b1016] border-white/[0.07] hover:border-emerald-500/30 hover:bg-[#0e151d] cursor-pointer text-slate-200 active:scale-[0.99]',
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
