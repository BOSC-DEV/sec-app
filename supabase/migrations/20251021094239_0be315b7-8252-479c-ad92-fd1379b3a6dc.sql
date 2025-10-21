-- Add missing is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create user_scammer_interactions table
CREATE TABLE IF NOT EXISTS public.user_scammer_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  scammer_id UUID REFERENCES public.scammers(id),
  liked BOOLEAN DEFAULT false,
  disliked BOOLEAN DEFAULT false,
  bookmarked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_scammer_interactions
ALTER TABLE public.user_scammer_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_scammer_interactions
CREATE POLICY "Users can view their own interactions"
  ON public.user_scammer_interactions
  FOR SELECT
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.wallet_address = (
      SELECT users.raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE users.id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert their own interactions"
  ON public.user_scammer_interactions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own interactions"
  ON public.user_scammer_interactions
  FOR UPDATE
  USING (user_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.wallet_address = (
      SELECT users.raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE users.id = auth.uid()
    )
  ));

-- Create increment_announcement_views function
CREATE OR REPLACE FUNCTION public.increment_announcement_views(announcement_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.announcements
  SET views = COALESCE(views, 0) + 1
  WHERE id = announcement_id_param;
END;
$$;

-- Update track_visitor function to accept proper parameters
CREATE OR REPLACE FUNCTION public.track_visitor(visitor_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Placeholder for visitor tracking
  -- Data structure: { visitor_id, timestamp, user_agent, country, etc. }
  RETURN;
END;
$$;

-- Update track_pageview function to accept proper parameters  
CREATE OR REPLACE FUNCTION public.track_pageview(pageview_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Placeholder for pageview tracking
  -- Data structure: { visitor_id, page_path, timestamp, referrer, etc. }
  RETURN;
END;
$$;