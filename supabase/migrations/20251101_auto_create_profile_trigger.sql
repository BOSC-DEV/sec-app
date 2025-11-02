-- Automatically create a profile when a new user signs up
-- This trigger fires after a user is created in auth.users
-- and creates a corresponding entry in public.profiles

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet_address text;
BEGIN
  -- Extract wallet address from user email (format: wallet@sec.digital)
  -- Use raw_user_meta_data if available, otherwise fall back to email parsing
  v_wallet_address := COALESCE(
    NEW.raw_user_meta_data->>'wallet_address',
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  -- Check if wallet_address matches Solana format
  IF v_wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$' THEN
    -- Insert new profile with wallet address
    -- SECURITY DEFINER allows this to bypass RLS policies
    INSERT INTO public.profiles (
      wallet_address,
      created_at,
      updated_at
    ) VALUES (
      v_wallet_address,
      now(),
      now()
    )
    ON CONFLICT (wallet_address) DO NOTHING; -- Prevent duplicate profiles
    
    RAISE LOG 'Created profile for wallet: %', v_wallet_address;
  ELSE
    RAISE WARNING 'Invalid wallet address format: %', v_wallet_address;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
-- Note: Only works if email confirmation is disabled or user is automatically confirmed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 
'Automatically creates a profile in public.profiles when a new user signs up via wallet authentication';

