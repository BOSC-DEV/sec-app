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

-- Optional: prevent banned users from inserting chat/report/contributions via RLS checks
-- (kept minimal here; triggers already enforce rates)




