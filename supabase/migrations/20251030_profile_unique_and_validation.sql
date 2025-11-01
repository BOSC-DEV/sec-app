-- Enforce uniqueness and validation rules for profiles

-- 1) Case-insensitive unique constraint on username
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_ci_unique
ON public.profiles (lower(username))
WHERE username IS NOT NULL;

-- 2) Ensure wallet_address is NOT NULL (should already be) and unique (should already be)
ALTER TABLE public.profiles
  ALTER COLUMN wallet_address SET NOT NULL;

-- 3) Lightweight CHECK constraints for format/length
ALTER TABLE public.profiles
  ADD CONSTRAINT IF NOT EXISTS username_format
  CHECK (username IS NULL OR username ~ '^[A-Za-z0-9_]{3,32}$');

ALTER TABLE public.profiles
  ADD CONSTRAINT IF NOT EXISTS display_name_length
  CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 50);

-- Optional basic wallet format sanity (Base58-ish 32-44 chars)
ALTER TABLE public.profiles
  ADD CONSTRAINT IF NOT EXISTS wallet_address_format
  CHECK (
    wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$'
  );

-- 4) BEFORE trigger to normalize and provide friendly errors
CREATE OR REPLACE FUNCTION public.enforce_profile_constraints()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Trim textual fields
  IF NEW.username IS NOT NULL THEN
    NEW.username := btrim(NEW.username);
    IF NEW.username = '' THEN NEW.username := NULL; END IF;
  END IF;

  IF NEW.display_name IS NOT NULL THEN
    NEW.display_name := NULLIF(btrim(NEW.display_name), '');
  END IF;

  -- Validate username
  IF NEW.username IS NOT NULL THEN
    IF NOT (NEW.username ~ '^[A-Za-z0-9_]{3,32}$') THEN
      RAISE EXCEPTION USING
        ERRCODE = '22023', -- invalid_parameter_value
        MESSAGE = 'Username must be 3-32 chars: letters, numbers, underscore';
    END IF;

    -- Case-insensitive uniqueness check with clearer message
    IF EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id <> COALESCE(NEW.id, gen_random_uuid())
        AND lower(p.username) = lower(NEW.username)
    ) THEN
      RAISE EXCEPTION USING
        ERRCODE = '23505', -- unique_violation
        MESSAGE = 'Username is already taken';
    END IF;
  END IF;

  -- Validate display_name length
  IF NEW.display_name IS NOT NULL AND char_length(NEW.display_name) > 50 THEN
    RAISE EXCEPTION USING
      ERRCODE = '22001', -- string_data_right_truncation
      MESSAGE = 'Display name must be at most 50 characters';
  END IF;

  -- Validate wallet_address basic shape (do not alter case)
  IF NEW.wallet_address IS NULL OR NEW.wallet_address = '' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23502', -- not_null_violation
      MESSAGE = 'Wallet address is required';
  END IF;
  IF NOT (NEW.wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$') THEN
    RAISE EXCEPTION USING
      ERRCODE = '22023',
      MESSAGE = 'Wallet address format is invalid';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_constraints ON public.profiles;
CREATE TRIGGER trg_enforce_profile_constraints
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_profile_constraints();


