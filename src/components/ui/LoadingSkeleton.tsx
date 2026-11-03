/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = 'h-10 w-full' }) => {
  return (
    <div
      className={`bg-white/[0.04] rounded-xl animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
};
