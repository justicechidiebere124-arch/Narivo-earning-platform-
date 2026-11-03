/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCw } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 min-h-[40px] gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 min-h-[48px] gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.35)]',
    secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.08]',
    outline: 'bg-transparent hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 border border-transparent',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30',
  };

  const effectiveLeftIcon = leftIcon || (iconPosition === 'left' ? icon : null);
  const effectiveRightIcon = rightIcon || (iconPosition === 'right' ? icon : null);

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <RotateCw className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {effectiveLeftIcon && <span className="shrink-0">{effectiveLeftIcon}</span>}
          <span>{children}</span>
          {effectiveRightIcon && <span className="shrink-0">{effectiveRightIcon}</span>}
        </>
      )}
    </button>
  );
};
