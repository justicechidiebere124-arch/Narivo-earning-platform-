/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  leftIcon,
  rightIcon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const effectiveLeftIcon = leftIcon || icon;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {effectiveLeftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-500 flex items-center">
            {effectiveLeftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={effectiveType}
          className={`
            w-full h-11 px-3.5 rounded-xl bg-black/40 border text-xs text-white placeholder:text-slate-500
            transition-all duration-150 outline-none
            focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${effectiveLeftIcon ? 'pl-10' : ''}
            ${isPassword || rightIcon ? 'pr-10' : ''}
            ${error ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/[0.08]'}
            ${className}
          `}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3.5 pointer-events-none text-slate-500 flex items-center">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
