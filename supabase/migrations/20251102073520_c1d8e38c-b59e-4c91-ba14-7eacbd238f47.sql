-- Add actor columns to notifications table
-- These columns store information about who triggered the notification

-- Add actor columns to notifications
ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS actor_id TEXT,
  ADD COLUMN IF NOT EXISTS actor_name TEXT,
  ADD COLUMN IF NOT EXISTS actor_username TEXT,
  ADD COLUMN IF NOT EXISTS actor_profile_pic TEXT;

COMMENT ON COLUMN public.notifications.actor_id IS 'ID of the user who triggered the notification (wallet address)';
COMMENT ON COLUMN public.notifications.actor_name IS 'Display name of the user who triggered the notification';
COMMENT ON COLUMN public.notifications.actor_username IS 'Username of the user who triggered the notification';
COMMENT ON COLUMN public.notifications.actor_profile_pic IS 'Profile picture URL of the user who triggered the notification';