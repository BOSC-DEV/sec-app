# 🚨 Fix Profile RLS Permission Denied Error

## Problem

Getting this error when trying to create a profile:
```
Error: new row violates row-level security policy for table "profiles"
Code: 42501
```

## Root Cause

The INSERT policy is trying to match `wallet_address` from `raw_user_meta_data` in the auth.users table, but this field may be missing or have a case mismatch.

## Solution

Run this migration in Supabase SQL Editor:

**Copy and paste this into Supabase Dashboard → SQL Editor → RUN:**

```sql
-- Fix profiles INSERT RLS policy to work with email-based auth
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  SPLIT_PART(auth.jwt()->>'email', '@', 1) = LOWER(wallet_address)
);

COMMENT ON POLICY "Users can insert own profile" ON public.profiles IS 
'Users can create their own profile by matching wallet_address extracted from their email (case-insensitive)';
```

## Why This Works

The policy now extracts the wallet address directly from the user's email (which is already in the format `wallet@sec.digital`) instead of relying on `raw_user_meta_data` which may not be set for older users. It also uses `LOWER()` to handle any case mismatches between the email (lowercase) and wallet_address (might be mixed case).

## After Running This

1. Refresh the browser
2. Try creating your profile again
3. It should work now!

## Files

The migration file is at:
`supabase/migrations/20251102_fix_profile_rls_insert.sql`

