/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`
        p-8 sm:p-12 rounded-2xl bg-[#0b1016] border border-white/[0.07] text-center
        flex flex-col items-center justify-center space-y-3.5
        ${className}
      `}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-slate-400 flex items-center justify-center">
        {icon}
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-sm sm:text-base font-bold text-white font-heading">
          {title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
