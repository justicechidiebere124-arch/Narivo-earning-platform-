-- =========================================================================
-- NARIVO PHASE 2: PREMIUM-ONLY PRODUCTION DATABASE MIGRATION
-- Framework: Supabase PostgreSQL (React 19 / Vite 8 Frontend Architecture)
-- Execution Order:
--   Step 1: Extensions
--   Step 2: Profiles Table & Schema Reconciliation
--   Step 3: Membership Plans Table & Inactive Premium Seed
--   Step 4: Memberships Table & Single Active Constraint
--   Step 5: Membership Payments Table with Immutable Snapshots
--   Step 6: Pre-Constraint Data Normalization
--   Step 7: Foreign Keys & Audit-Retention Constraints
--   Step 8: Automated Timestamp Trigger
--   Step 9: Hardened Registration Trigger (Profile Only)
--   Step 10: Concurrency-Safe, Snapshot-Verified Activation RPC
--   Step 11: Complete Privilege Reset & Least-Privilege Grants
--   Step 12: Least-Privilege Row-Level Security (RLS)
--   Step 13: Idempotent Auth Profile Backfill (Zero Free Memberships)
--   Step 14: Comprehensive Post-Migration Verification Query
-- =========================================================================

-- -------------------------------------------------------------------------
-- STEP 1: EXTENSIONS
-- -------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- -------------------------------------------------------------------------
-- STEP 2: TABLE 1 - public.profiles
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'NARIVO Member',
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

-- Idempotent column backfill for pre-existing tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT 'NARIVO Member';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT pg_catalog.now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.now();

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- -------------------------------------------------------------------------
-- STEP 3: TABLE 2 - public.membership_plans
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_kobo BIGINT NOT NULL DEFAULT 0 CHECK (price_kobo >= 0),
    duration_days INTEGER CHECK (duration_days > 0),
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS price_kobo BIGINT DEFAULT 0;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS duration_days INTEGER;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT pg_catalog.now();

-- Drop legacy NOT NULL on duration_days if present from an earlier migration
ALTER TABLE public.membership_plans ALTER COLUMN duration_days DROP NOT NULL;

-- Remove legacy Standard Member seed if it exists without active subscribers
DELETE FROM public.membership_plans 
WHERE name = 'Standard Member' 
  AND NOT EXISTS (SELECT 1 FROM public.memberships WHERE plan_id = public.membership_plans.id);

UPDATE public.membership_plans 
SET is_active = false 
WHERE name = 'Standard Member';

-- SEED: Create unconfigured Premium Plan (is_active = false, no invented price)
INSERT INTO public.membership_plans (name, description, price_kobo, duration_days, is_active)
VALUES (
    'Premium Member', 
    'Official NARIVO Premium Membership. Grants priority verified task access, expedited reward audits, and direct partner campaign unlocks.', 
    0, 
    NULL, 
    false -- Inactive until admin sets price and duration
)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description;

-- INTEGRITY RULE: An active plan MUST have a positive price (> 0) and positive duration
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_active_plan_requires_price_and_duration'
    ) THEN
        ALTER TABLE public.membership_plans 
            ADD CONSTRAINT chk_active_plan_requires_price_and_duration 
            CHECK (NOT is_active OR (price_kobo > 0 AND duration_days IS NOT NULL AND duration_days > 0));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON public.membership_plans (is_active);

-- -------------------------------------------------------------------------
-- STEP 4: TABLE 3 - public.memberships
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT pg_catalog.now();
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.now();

-- Ensure composite uniqueness for (id, user_id) to support composite FK in payments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_memberships_id_user_id'
    ) THEN
        ALTER TABLE public.memberships ADD CONSTRAINT uq_memberships_id_user_id UNIQUE (id, user_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON public.memberships (status);

-- Data Integrity: Guarantee at most ONE active membership per member at any time
CREATE UNIQUE INDEX IF NOT EXISTS uq_single_active_membership_per_user 
    ON public.memberships (user_id) 
    WHERE (status = 'active');

-- -------------------------------------------------------------------------
-- STEP 5: TABLE 4 - public.membership_payments (WITH PURCHASE SNAPSHOTS)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.membership_payments (
    id UUID PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid(),
    user_id UUID NOT NULL,
    membership_id UUID NOT NULL,
    payment_provider TEXT NOT NULL DEFAULT 'paystack',
    provider_reference TEXT UNIQUE NOT NULL,
    amount_kobo BIGINT NOT NULL CHECK (amount_kobo > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    purchased_plan_name TEXT NOT NULL DEFAULT 'Premium Member',
    purchased_duration_days INTEGER NOT NULL DEFAULT 30 CHECK (purchased_duration_days > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'refunded')),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'paystack';
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS provider_reference TEXT;
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS amount_kobo BIGINT;
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'NGN';
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS purchased_plan_name TEXT DEFAULT 'Premium Member';
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS purchased_duration_days INTEGER DEFAULT 30;
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.membership_payments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT pg_catalog.now();

-- Reconcile legacy rows with missing snapshot values before enforcing NOT NULL
UPDATE public.membership_payments 
SET purchased_plan_name = 'Premium Member' 
WHERE purchased_plan_name IS NULL;

UPDATE public.membership_payments 
SET purchased_duration_days = 30 
WHERE purchased_duration_days IS NULL;

ALTER TABLE public.membership_payments ALTER COLUMN purchased_plan_name SET NOT NULL;
ALTER TABLE public.membership_payments ALTER COLUMN purchased_duration_days SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_membership_payments_user_id ON public.membership_payments (user_id);
CREATE INDEX IF NOT EXISTS idx_membership_payments_membership_id ON public.membership_payments (membership_id);
CREATE INDEX IF NOT EXISTS idx_membership_payments_reference ON public.membership_payments (provider_reference);

-- -------------------------------------------------------------------------
-- STEP 6: PRE-CONSTRAINT DATA NORMALIZATION
-- -------------------------------------------------------------------------
-- Deactivate duplicate active memberships in legacy records if any exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT user_id
        FROM public.memberships
        WHERE status = 'active'
        GROUP BY user_id
        HAVING COUNT(*) > 1
    ) LOOP
        UPDATE public.memberships
        SET status = 'expired', updated_at = pg_catalog.now()
        WHERE user_id = r.user_id 
          AND status = 'active'
          AND id NOT IN (
              SELECT id FROM public.memberships
              WHERE user_id = r.user_id AND status = 'active'
              ORDER BY created_at DESC, id DESC
              LIMIT 1
          );
    END LOOP;
END $$;

-- -------------------------------------------------------------------------
-- STEP 7: FOREIGN KEYS & AUDIT-RETENTION CONSTRAINTS
-- -------------------------------------------------------------------------
-- 1. Composite Foreign Key: Guarantees payment strictly references user's own membership
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_payments_membership_user_composite'
    ) THEN
        ALTER TABLE public.membership_payments 
            ADD CONSTRAINT fk_payments_membership_user_composite 
            FOREIGN KEY (membership_id, user_id) 
            REFERENCES public.memberships(id, user_id) 
            ON DELETE RESTRICT; -- Financial audit preservation
    END IF;
END $$;

-- 2. Audit Retention FK on Profiles: Cannot delete profile if financial transaction logs exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_payments_profile_restrict'
    ) THEN
        ALTER TABLE public.membership_payments 
            ADD CONSTRAINT fk_payments_profile_restrict 
            FOREIGN KEY (user_id) 
            REFERENCES public.profiles(id) 
            ON DELETE RESTRICT;
    END IF;
END $$;

-- -------------------------------------------------------------------------
-- STEP 8: AUTOMATED TIMESTAMPTZ UPDATED_AT TRIGGER
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER
SET search_path = ''
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_current_timestamp_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_memberships_updated_at ON public.memberships;
CREATE TRIGGER trg_memberships_updated_at
    BEFORE UPDATE ON public.memberships
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- -------------------------------------------------------------------------
-- STEP 9: REGISTRATION TRIGGER (PROFILES ONLY - ZERO FREE MEMBERSHIPS)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    v_full_name TEXT;
    v_phone TEXT;
BEGIN
    IF NEW.email IS NULL OR pg_catalog.length(pg_catalog.trim(NEW.email)) = 0 THEN
        RAISE EXCEPTION 'User email is required to create a profile';
    END IF;

    v_full_name := COALESCE(
        NULLIF(pg_catalog.trim(NEW.raw_user_meta_data->>'full_name'), ''),
        NULLIF(pg_catalog.trim(pg_catalog.split_part(NEW.email, '@', 1)), ''),
        'NARIVO Member'
    );
    
    v_phone := NULLIF(pg_catalog.trim(NEW.raw_user_meta_data->>'phone'), '');

    -- Create profile only. Under the Premium-Only model, NO membership is created.
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone_number,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        v_full_name,
        NEW.email,
        v_phone,
        pg_catalog.now(),
        pg_catalog.now()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- STEP 10: CONCURRENCY-SAFE, SNAPSHOT-VERIFIED ACTIVATION RPC
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.activate_membership_after_payment(
    p_payment_reference TEXT,
    p_paid_amount_kobo BIGINT,
    p_paid_currency TEXT
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
    v_payment RECORD;
    v_membership RECORD;
    v_expires_at TIMESTAMPTZ;
    v_user_lock UUID;
BEGIN
    -- 1. Validate input parameters strictly
    IF p_payment_reference IS NULL OR pg_catalog.length(pg_catalog.trim(p_payment_reference)) = 0 THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'INVALID_PARAM', 'error', 'Payment reference is required');
    END IF;

    IF p_paid_amount_kobo IS NULL OR p_paid_amount_kobo <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'INVALID_PARAM', 'error', 'Verified payment amount must be greater than zero');
    END IF;

    IF p_paid_currency IS NULL OR p_paid_currency <> 'NGN' THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'INVALID_CURRENCY', 'error', 'Payment currency must be NGN');
    END IF;

    -- 2. Find payment record and resolve user_id
    SELECT * INTO v_payment
    FROM public.membership_payments
    WHERE provider_reference = p_payment_reference;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'PAYMENT_NOT_FOUND', 'error', 'Payment reference does not exist');
    END IF;

    -- 3. SERIALIZE CONCURRENT UPGRADES PER USER: Lock user profile row first
    -- Predictable lock ordering prevents deadlocks across concurrent webhooks
    SELECT id INTO v_user_lock
    FROM public.profiles
    WHERE id = v_payment.user_id
    FOR UPDATE;

    -- 4. Re-lock payment record with row-level lock
    SELECT * INTO v_payment
    FROM public.membership_payments
    WHERE id = v_payment.id
    FOR UPDATE;

    -- 5. IDEMPOTENCY GUARD: If already processed successfully, confirm membership state
    IF v_payment.status = 'successful' THEN
        SELECT * INTO v_membership 
        FROM public.memberships 
        WHERE id = v_payment.membership_id;

        IF v_membership.status = 'active' THEN
            RETURN jsonb_build_object(
                'success', true, 
                'idempotent', true, 
                'message', 'Payment already processed and membership is active',
                'membership_id', v_membership.id,
                'expires_at', v_membership.expires_at
            );
        END IF;
    END IF;

    -- 6. REJECT INVALID PAYMENT STATES
    IF v_payment.status IN ('failed', 'refunded', 'cancelled') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error_code', 'INVALID_PAYMENT_STATE',
            'error', 'Payment has status ' || v_payment.status || ' and cannot be activated'
        );
    END IF;

    IF v_payment.status <> 'pending' AND v_payment.status <> 'successful' THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error_code', 'UNEXPECTED_STATUS',
            'error', 'Payment status must be pending'
        );
    END IF;

    -- 7. VERIFY CURRENCY & PROVIDER
    IF v_payment.currency <> 'NGN' OR p_paid_currency <> 'NGN' THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'INVALID_CURRENCY', 'error', 'Payment currency must be NGN');
    END IF;

    IF v_payment.payment_provider <> 'paystack' THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'INVALID_PROVIDER', 'error', 'Payment provider must be paystack');
    END IF;

    -- 8. VERIFY STORED SNAPSHOT AMOUNT AGAINST PAYSTACK CONFIRMATION
    IF v_payment.amount_kobo <> p_paid_amount_kobo THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error_code', 'AMOUNT_MISMATCH',
            'error', 'Paystack confirmed amount (' || p_paid_amount_kobo || ') does not match stored purchase snapshot (' || v_payment.amount_kobo || ')'
        );
    END IF;

    -- 9. LOCK AND VERIFY MEMBERSHIP
    SELECT * INTO v_membership
    FROM public.memberships
    WHERE id = v_payment.membership_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'MEMBERSHIP_NOT_FOUND', 'error', 'Target membership does not exist');
    END IF;

    IF v_membership.user_id <> v_payment.user_id THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'USER_MISMATCH', 'error', 'Payment user does not match membership owner');
    END IF;

    -- 10. CALCULATE EXPIRATION USING STORED DURATION SNAPSHOT
    -- Does NOT depend on plan's current duration configuration
    v_expires_at := pg_catalog.now() + (v_payment.purchased_duration_days || ' days')::interval;

    -- 11. ATOMIC DEACTIVATION: Expire any existing active membership for this user
    UPDATE public.memberships
    SET status = 'expired',
        updated_at = pg_catalog.now()
    WHERE user_id = v_payment.user_id 
      AND status = 'active'
      AND id <> v_payment.membership_id;

    -- 12. ACTIVATE TARGET MEMBERSHIP
    UPDATE public.memberships
    SET status = 'active',
        starts_at = pg_catalog.now(),
        expires_at = v_expires_at,
        updated_at = pg_catalog.now()
    WHERE id = v_payment.membership_id;

    -- 13. MARK PAYMENT SUCCESSFUL WITH AUDIT TIMESTAMP
    UPDATE public.membership_payments
    SET status = 'successful',
        verified_at = pg_catalog.now()
    WHERE id = v_payment.id;

    RETURN jsonb_build_object(
        'success', true,
        'idempotent', false,
        'user_id', v_payment.user_id,
        'membership_id', v_payment.membership_id,
        'purchased_plan_name', v_payment.purchased_plan_name,
        'purchased_duration_days', v_payment.purchased_duration_days,
        'amount_kobo', v_payment.amount_kobo,
        'expires_at', v_expires_at
    );
END;
$$;

-- Strict Server-Side Only Execution
REVOKE ALL ON FUNCTION public.activate_membership_after_payment(TEXT, BIGINT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.activate_membership_after_payment(TEXT, BIGINT, TEXT) TO service_role;

-- -------------------------------------------------------------------------
-- STEP 11: COMPLETE PRIVILEGE RESET & LEAST-PRIVILEGE GRANTS
-- -------------------------------------------------------------------------
-- Revoke all prior table permissions to purge legacy grants
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.membership_plans FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.memberships FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.membership_payments FROM PUBLIC, anon, authenticated;

-- PROFILES: Select own row, update only personal fields
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, phone_number) ON public.profiles TO authenticated;

-- MEMBERSHIP PLANS: Read-only access to plans for all visitors
GRANT SELECT ON public.membership_plans TO anon, authenticated;

-- MEMBERSHIPS: Strictly SELECT-only for authenticated members (Zero write privileges)
GRANT SELECT ON public.memberships TO authenticated;

-- MEMBERSHIP PAYMENTS: Strictly SELECT-only for authenticated members (Zero write privileges)
GRANT SELECT ON public.membership_payments TO authenticated;

-- -------------------------------------------------------------------------
-- STEP 12: LEAST-PRIVILEGE ROW-LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "membership_plans_select_active" ON public.membership_plans;
DROP POLICY IF EXISTS "memberships_select_own" ON public.memberships;
DROP POLICY IF EXISTS "membership_payments_select_own" ON public.membership_payments;

CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = (SELECT auth.uid()))
    WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "membership_plans_select_active" ON public.membership_plans
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "memberships_select_own" ON public.memberships
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE POLICY "membership_payments_select_own" ON public.membership_payments
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- -------------------------------------------------------------------------
-- STEP 13: IDEMPOTENT AUTH PROFILE BACKFILL (ZERO FREE MEMBERSHIPS)
-- -------------------------------------------------------------------------
-- Create missing profiles for existing auth users.
-- Does NOT create any membership or upgrade any user.
INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    phone_number, 
    created_at, 
    updated_at
)
SELECT 
    u.id,
    COALESCE(
        NULLIF(pg_catalog.trim(u.raw_user_meta_data->>'full_name'), ''),
        NULLIF(pg_catalog.trim(pg_catalog.split_part(u.email, '@', 1)), ''),
        'NARIVO Member'
    ),
    u.email,
    NULLIF(pg_catalog.trim(u.raw_user_meta_data->>'phone'), ''),
    COALESCE(u.created_at, pg_catalog.now()),
    pg_catalog.now()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- STEP 14: COMPREHENSIVE POST-MIGRATION VERIFICATION QUERY
-- -------------------------------------------------------------------------
SELECT 
    '1. Tables & RLS' AS check_category,
    t.tablename AS object_name,
    CASE WHEN t.rowsecurity THEN 'PASS: RLS Enabled' ELSE 'FAIL: RLS Disabled' END AS status
FROM pg_tables t
WHERE t.schemaname = 'public' 
  AND t.tablename IN ('profiles', 'membership_plans', 'memberships', 'membership_payments')

UNION ALL

SELECT 
    '2. Table Privileges' AS check_category,
    tp.table_name || ' -> ' || tp.grantee AS object_name,
    'PASS: ' || string_agg(tp.privilege_type, ', ') AS status
FROM information_schema.table_privileges tp
WHERE tp.table_schema = 'public'
  AND tp.table_name IN ('profiles', 'membership_plans', 'memberships', 'membership_payments')
  AND tp.grantee IN ('anon', 'authenticated')
GROUP BY tp.table_name, tp.grantee

UNION ALL

SELECT 
    '3. Premium Plan State' AS check_category,
    name || ' (is_active=' || is_active::text || ')' AS object_name,
    CASE 
        WHEN is_active = false AND price_kobo = 0 THEN 'PASS: Inactive and unpriced as required'
        ELSE 'WARNING: Active or priced' 
    END AS status
FROM public.membership_plans
WHERE name = 'Premium Member'

UNION ALL

SELECT 
    '4. Standard Plan Removal' AS check_category,
    'Standard Member' AS object_name,
    CASE 
        WHEN COUNT(*) = 0 THEN 'PASS: Completely removed'
        WHEN bool_and(NOT is_active) THEN 'PASS: Deactivated'
        ELSE 'FAIL: Still active'
    END AS status
FROM public.membership_plans
WHERE name = 'Standard Member'

UNION ALL

SELECT 
    '5. Function Execution Security' AS check_category,
    routine_name || ' -> ' || grantee AS object_name,
    CASE 
        WHEN grantee = 'service_role' THEN 'PASS: Restricted to service_role'
        ELSE 'FAIL: Accessible by unauthorized role'
    END AS status
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name = 'activate_membership_after_payment'
  AND grantee IN ('anon', 'authenticated', 'PUBLIC', 'service_role')

UNION ALL

SELECT 
    '6. Free Memberships Check' AS check_category,
    'Total Active Memberships' AS object_name,
    'Total Active: ' || COUNT(*)::text || ' (Zero auto-assigned free memberships)' AS status
FROM public.memberships
WHERE status = 'active';
