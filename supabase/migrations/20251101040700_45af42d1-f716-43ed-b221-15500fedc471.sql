-- Migration helper for legacy user passwords
-- This creates a function to assist with migrating users from base64 signatures (>72 chars)
-- to the new hashed password format (64-char hex)

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
  
  -- Hash the signature to 64-char hex (SHA-256)
  v_signature_hash := encode(digest(p_signature_base64, 'sha256'), 'hex');
  
  -- Note: Actual password update must be done via Supabase Auth Admin API
  -- This function validates the user exists and prepares the hash
  
  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.migrate_user_password IS 
'Helper function for password migration. Validates user exists and generates password hash. Actual password update must be done via Supabase Admin API with service role key.';