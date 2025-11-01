-- Admin support: report review fields and user moderation fields

-- Extend report_submissions with review workflow
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    CREATE TYPE public.report_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

ALTER TABLE public.report_submissions
  ADD COLUMN IF NOT EXISTS status public.report_status DEFAULT 'pending' NOT NULL,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolution text;

-- Add moderation fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS suspended_until timestamptz;

-- Prevent banned users from creating content via RLS
CREATE POLICY "Banned users cannot submit reports" 
ON public.report_submissions 
FOR INSERT 
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (
      SELECT id FROM public.profiles 
      WHERE wallet_address = (
        SELECT raw_user_meta_data->>'wallet_address' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
    AND (is_banned = true OR (suspended_until IS NOT NULL AND suspended_until > now()))
  )
);

CREATE POLICY "Banned users cannot send chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (
      SELECT id FROM public.profiles 
      WHERE wallet_address = (
        SELECT raw_user_meta_data->>'wallet_address' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
    AND (is_banned = true OR (suspended_until IS NOT NULL AND suspended_until > now()))
  )
);

CREATE POLICY "Banned users cannot make bounty contributions" 
ON public.bounty_contributions 
FOR INSERT 
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (
      SELECT id FROM public.profiles 
      WHERE wallet_address = (
        SELECT raw_user_meta_data->>'wallet_address' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
    AND (is_banned = true OR (suspended_until IS NOT NULL AND suspended_until > now()))
  )
);

CREATE POLICY "Banned users cannot create announcements" 
ON public.announcements 
FOR INSERT 
WITH CHECK (
  NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = (
      SELECT id FROM public.profiles 
      WHERE wallet_address = (
        SELECT raw_user_meta_data->>'wallet_address' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
    AND (is_banned = true OR (suspended_until IS NOT NULL AND suspended_until > now()))
  )
);