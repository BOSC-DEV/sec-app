-- Rate limiting via BEFORE INSERT triggers
-- Limits:
-- - Report submissions: max 5 per hour per user
-- - Bounty contributions: max 10 per hour per user
-- - Chat messages: max 30 per minute per user
-- - Announcements: max 3 per day per non-whale (whales exempt)

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
AS $$
  SELECT COALESCE((SELECT sec_balance FROM public.profiles WHERE id = p_profile_id), 0) >= 10000;
$$;

-- Reports: 5 per hour
CREATE OR REPLACE FUNCTION public.enforce_report_submission_rate()
RETURNS trigger
LANGUAGE plpgsql
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
    RETURN NEW; -- exempt
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

DROP TRIGGER IF EXISTS trg_enforce_announcement_rate ON public.announcements;
CREATE TRIGGER trg_enforce_announcement_rate
BEFORE INSERT ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.enforce_announcement_rate();


