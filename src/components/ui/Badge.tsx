/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'emerald';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    neutral: 'bg-white/[0.05] text-slate-400 border-white/[0.08]',
  };

  const sizeStyles = {
    sm: 'text-[9px] sm:text-[10px] px-2 py-0.5 rounded',
    md: 'text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-lg',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border font-semibold tracking-tight uppercase whitespace-nowrap shrink-0
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
