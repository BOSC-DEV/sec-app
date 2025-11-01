-- Migration script to fix legacy user passwords
-- This script helps migrate users who signed up with base64 signatures (>72 chars)
-- to the new hashed password format (64-char hex)
--
-- NOTE: This requires admin access to Supabase Auth
-- Run this via Supabase Dashboard SQL Editor or CLI
--
-- WARNING: This will invalidate existing sessions. Users will need to sign in again.

-- Step 1: Identify users with old password format (optional - for logging)
-- SELECT 
--   id, 
--   email, 
--   created_at,
--   raw_user_meta_data->>'wallet_address' as wallet_address
-- FROM auth.users
-- WHERE email LIKE '%@sec.digital'
-- ORDER BY created_at;

-- Step 2: Reset passwords for affected users
-- This requires Supabase Admin API or manual password reset flow
-- 
-- For Supabase Admin API (use in your backend/admin tool):
-- 
-- ```javascript
-- import { createClient } from '@supabase/supabase-js'
-- 
-- const adminClient = createClient(
--   process.env.SUPABASE_URL,
--   process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key (admin)
-- )
-- 
-- // Get all users
-- const { data: users } = await adminClient.auth.admin.listUsers()
-- 
-- for (const user of users.users) {
--   if (user.email?.endsWith('@sec.digital')) {
--     const walletAddress = user.email.split('@')[0]
--     // Generate a new signature message for migration
--     const message = `Migrate password for ${walletAddress} at ${Date.now()}`
--     // User will need to sign this with their wallet
--     // Then hash it: SHA256(signature) -> 64-char hex
--     // Then update password:
--     // await adminClient.auth.admin.updateUserById(user.id, { password: hashedPassword })
--   }
-- }
-- ```
--
-- OR use Supabase Dashboard -> Authentication -> Users -> Reset Password

-- Step 3: Alternative - Create a function users can call after signing a message
CREATE OR REPLACE FUNCTION public.migrate_user_password(
  p_wallet_address text,
  p_signature_base64 text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_signature_hash text;
BEGIN
  -- Find user by wallet address
  SELECT u.id INTO v_user_id
  FROM auth.users u
  WHERE u.email = lower(p_wallet_address || '@sec.digital')
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Hash the signature (64-char hex)
  -- Note: This is a placeholder - actual hashing should be done in application code
  -- This function assumes the hashed password is provided
  v_signature_hash := encode(digest(p_signature_base64, 'sha256'), 'hex');
  
  -- Update password via Supabase Auth Admin API (requires service role)
  -- This cannot be done directly in SQL - must be done via API
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.migrate_user_password IS 
'Helper function for password migration. Actual password update must be done via Supabase Admin API with service role key.';

-- For immediate fix: Users can manually reset their password via Supabase Dashboard
-- Or use Supabase Auth Admin API to bulk update passwords

