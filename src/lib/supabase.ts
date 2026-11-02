/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Vite-injected public environment variables with fallback to user's configured project
const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const envKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
)?.trim();

export const SUPABASE_URL: string =
  envUrl && !envUrl.includes('your-project-id')
    ? envUrl
    : 'https://jokteutbbqxwmwtzzoms.supabase.co';

export const SUPABASE_ANON_KEY: string =
  envKey && !envKey.includes('your-anon-publishable-key')
    ? envKey
    : 'sb_publishable_HhSks_J_-BkxZ3Mf7OKLvA_kI7RZHIZ';

// Verify credentials exist and are valid non-placeholder strings
export const isSupabaseConfigured: boolean = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project-id') &&
  !SUPABASE_ANON_KEY.includes('your-anon-publishable-key')
);

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  supabaseUrl?: string;
  hasAnonKey: boolean;
  missingSteps: string[];
}

export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const missing: string[] = [];
  if (!SUPABASE_URL || SUPABASE_URL.includes('your-project-id')) {
    missing.push('Missing VITE_SUPABASE_URL environment variable');
  }
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('your-anon-publishable-key')) {
    missing.push('Missing VITE_SUPABASE_ANON_KEY environment variable');
  }

  return {
    isConfigured: isSupabaseConfigured,
    supabaseUrl: SUPABASE_URL,
    hasAnonKey: Boolean(SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('your-anon-publishable-key')),
    missingSteps: missing,
  };
};

export const isSupabaseConnected = (): boolean => {
  return isSupabaseConfigured;
};

/**
 * Singleton Supabase Client with browser session persistence
 * Uses the live project credentials and automatic token refresh
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'narivo_sb_auth_token',
    },
  }
);
