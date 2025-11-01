-- Enforce uniqueness and validation rules for profiles

-- 1) Case-insensitive unique constraint on username
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_ci_unique
ON public.profiles (lower(username))
WHERE username IS NOT NULL;

-- 2) Ensure wallet_address is NOT NULL (should already be) and unique (should already be)
ALTER TABLE public.profiles
  ALTER COLUMN wallet_address SET NOT NULL;

-- 3) Lightweight CHECK constraints for format/length (using DO blocks to handle IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'username_format') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT username_format
      CHECK (username IS NULL OR username ~ '^[A-Za-z0-9_]{3,32}$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'display_name_length') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT display_name_length
      CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wallet_address_format') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT wallet_address_format
      CHECK (wallet_address ~ '^[1-9A-HJ-NP-Za-km-z]{32,44}$');
  END IF;
END $$;

-- 4) BEFORE trigger to normalize and provide friendly errors
CREATE OR REPLACE FUNCTION public.enforce_profile_constraints()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
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
        ERRCODE = '22023',
        MESSAGE = 'Username must be 3-32 chars: letters, numbers, underscore';
    END IF;

    -- Case-insensitive uniqueness check with clearer message
    IF EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id <> COALESCE(NEW.id, gen_random_uuid())
        AND lower(p.username) = lower(NEW.username)
    ) THEN
      RAISE EXCEPTION USING
        ERRCODE = '23505',
        MESSAGE = 'Username is already taken';
    END IF;
  END IF;

  -- Validate display_name length
  IF NEW.display_name IS NOT NULL AND char_length(NEW.display_name) > 50 THEN
    RAISE EXCEPTION USING
      ERRCODE = '22001',
      MESSAGE = 'Display name must be at most 50 characters';
  END IF;

  -- Validate wallet_address basic shape (do not alter case)
  IF NEW.wallet_address IS NULL OR NEW.wallet_address = '' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23502',
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

-- Rate limiting via BEFORE INSERT triggers

-- Helper: map current auth user to profiles.id
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id
  FROM public.profiles p
  WHERE p.wallet_address = (
    SELECT u.raw_user_meta_data->>'wallet_address'
    FROM auth.users u
    WHERE u.id = auth.uid()
  )
  LIMIT 1;
$$;

-- Helper: whale check (tweak threshold as needed)
CREATE OR REPLACE FUNCTION public.is_whale(p_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT sec_balance FROM public.profiles WHERE id = p_profile_id), 0) >= 10000;
$$;

-- Reports: 5 per hour
CREATE OR REPLACE FUNCTION public.enforce_report_submission_rate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_profile_id uuid;
  v_count int;
BEGIN
  v_profile_id := COALESCE(NEW.user_id, public.current_profile_id());
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '23502', MESSAGE = 'Authentication required';
  END IF;
  SELECT COUNT(*) INTO v_count
  FROM public.report_submissions rs
  WHERE rs.user_id = v_profile_id
    AND rs.created_at > now() - interval '1 hour';
  IF v_count >= 5 THEN
    RAISE EXCEPTION USING ERRCODE = '45000', MESSAGE = 'Rate limit exceeded: max 5 reports per hour';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_report_submission_rate ON public.report_submissions;
CREATE TRIGGER trg_enforce_report_submission_rate
BEFORE INSERT ON public.report_submissions
FOR EACH ROW EXECUTE FUNCTION public.enforce_report_submission_rate();

-- Bounty contributions: 10 per hour
CREATE OR REPLACE FUNCTION public.enforce_bounty_contribution_rate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_profile_id uuid;
  v_count int;
BEGIN
  v_profile_id := COALESCE(NEW.contributor_id, public.current_profile_id());
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '23502', MESSAGE = 'Authentication required';
  END IF;
  SELECT COUNT(*) INTO v_count
  FROM public.bounty_contributions bc
  WHERE bc.contributor_id = v_profile_id
    AND bc.created_at > now() - interval '1 hour';
  IF v_count >= 10 THEN
    RAISE EXCEPTION USING ERRCODE = '45000', MESSAGE = 'Rate limit exceeded: max 10 bounty contributions per hour';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_bounty_contribution_rate ON public.bounty_contributions;
CREATE TRIGGER trg_enforce_bounty_contribution_rate
BEFORE INSERT ON public.bounty_contributions
FOR EACH ROW EXECUTE FUNCTION public.enforce_bounty_contribution_rate();

-- Chat messages: 30 per minute
CREATE OR REPLACE FUNCTION public.enforce_chat_message_rate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_profile_id uuid;
  v_count int;
BEGIN
  v_profile_id := COALESCE(NEW.author_id, NEW.user_id, public.current_profile_id());
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '23502', MESSAGE = 'Authentication required';
  END IF;
  SELECT COUNT(*) INTO v_count
  FROM public.chat_messages cm
  WHERE COALESCE(cm.author_id, cm.user_id) = v_profile_id
    AND cm.created_at > now() - interval '1 minute';
  IF v_count >= 30 THEN
    RAISE EXCEPTION USING ERRCODE = '45000', MESSAGE = 'Rate limit exceeded: max 30 chat messages per minute';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_chat_message_rate ON public.chat_messages;
CREATE TRIGGER trg_enforce_chat_message_rate
BEFORE INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.enforce_chat_message_rate();

-- Announcements: 3 per day for non-whales (whales exempt)
CREATE OR REPLACE FUNCTION public.enforce_announcement_rate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_profile_id uuid;
  v_count int;
  v_is_whale boolean;
BEGIN
  v_profile_id := COALESCE(NEW.author_id, public.current_profile_id());
  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '23502', MESSAGE = 'Authentication required';
  END IF;
  SELECT public.is_whale(v_profile_id) INTO v_is_whale;
  IF v_is_whale THEN
    RETURN NEW;
  END IF;
  SELECT COUNT(*) INTO v_count
  FROM public.announcements a
  WHERE a.author_id = v_profile_id
    AND a.created_at::date = now()::date;
  IF v_count >= 3 THEN
    RAISE EXCEPTION USING ERRCODE = '45000', MESSAGE = 'Rate limit exceeded: max 3 announcements per day';
  END IF;
  RETURN NEW;
END;
$$;