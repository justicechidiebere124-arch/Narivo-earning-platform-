/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Standard Nigerian Naira currency formatter for NARIVO.
 * Formats numbers into ₦X,XXX.XX standard format.
 */
export const formatNaira = (amount: number): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return '₦' + safeAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
