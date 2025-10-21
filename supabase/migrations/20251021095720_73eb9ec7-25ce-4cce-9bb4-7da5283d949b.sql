-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (recipient_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.wallet_address = (
      SELECT users.raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE users.id = auth.uid()
    )
  ));

CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (recipient_id = (
    SELECT profiles.id FROM profiles 
    WHERE profiles.wallet_address = (
      SELECT users.raw_user_meta_data->>'wallet_address' 
      FROM auth.users 
      WHERE users.id = auth.uid()
    )
  ));

-- Create scammer_views table for tracking unique views
CREATE TABLE IF NOT EXISTS public.scammer_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scammer_id UUID REFERENCES public.scammers(id),
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(scammer_id, visitor_id)
);

-- Enable RLS on scammer_views
ALTER TABLE public.scammer_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for scammer_views
CREATE POLICY "Scammer views are viewable by everyone"
  ON public.scammer_views
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can track views"
  ON public.scammer_views
  FOR INSERT
  WITH CHECK (true);

-- Create function to check for duplicate views
CREATE OR REPLACE FUNCTION public.is_duplicate_view(p_scammer_id UUID, p_visitor_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.scammer_views
    WHERE scammer_id = p_scammer_id AND visitor_id = p_visitor_id
  );
END;
$$;