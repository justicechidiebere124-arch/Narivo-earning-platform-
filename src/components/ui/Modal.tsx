/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  children,
  footer,
  maxWidth,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const effectiveSize = maxWidth || size;
  const effectiveSubtitle = description || subtitle;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 selection:bg-emerald-400 selection:text-slate-950"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`
          w-full ${maxWidthStyles[effectiveSize]} rounded-3xl bg-[#032a20]/95 backdrop-blur-2xl border border-emerald-400/30
          shadow-[0_25px_60px_rgba(1,26,20,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)]
          flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150 relative
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular sheen */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-emerald-400/20 flex items-center justify-between shrink-0">
          <div className="space-y-0.5 min-w-0 pr-4">
            <h3 className="text-base sm:text-lg font-bold text-white font-heading truncate">
              {title}
            </h3>
            {effectiveSubtitle && (
              <p className="text-xs text-slate-300 truncate">
                {effectiveSubtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-200">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-emerald-400/20 bg-black/30 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
