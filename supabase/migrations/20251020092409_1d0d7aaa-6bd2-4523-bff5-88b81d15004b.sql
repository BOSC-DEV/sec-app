-- Add missing columns to chat_messages
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS author_name text,
ADD COLUMN IF NOT EXISTS author_username text,
ADD COLUMN IF NOT EXISTS author_profile_pic text,
ADD COLUMN IF NOT EXISTS author_sec_balance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0;

-- Add missing columns to bounty_contributions
ALTER TABLE bounty_contributions
ADD COLUMN IF NOT EXISTS contributor_name text,
ADD COLUMN IF NOT EXISTS contributor_profile_pic text,
ADD COLUMN IF NOT EXISTS comment text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS transferred_from_id uuid,
ADD COLUMN IF NOT EXISTS transferred_to_id uuid;

-- Add missing columns to scammers
ALTER TABLE scammers
ADD COLUMN IF NOT EXISTS added_by uuid REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS date_added timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Add missing columns to announcements
ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS author_name text,
ADD COLUMN IF NOT EXISTS author_username text,
ADD COLUMN IF NOT EXISTS author_profile_pic text,
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS survey_data jsonb;

-- Add missing columns to replies
ALTER TABLE replies
ADD COLUMN IF NOT EXISTS author_name text,
ADD COLUMN IF NOT EXISTS author_username text,
ADD COLUMN IF NOT EXISTS author_profile_pic text,
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scammer_id uuid REFERENCES scammers(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  author uuid REFERENCES profiles(id) NOT NULL,
  author_name text,
  author_profile_pic text,
  created_at timestamp with time zone DEFAULT now(),
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  views integer DEFAULT 0
);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments RLS policies
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (author = (SELECT id FROM profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));

CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (author = (SELECT id FROM profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));

-- Create analytics functions
CREATE OR REPLACE FUNCTION track_visitor(visitor_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This is a placeholder for visitor tracking
  -- In a real implementation, you would store this data
  RETURN;
END;
$$;

CREATE OR REPLACE FUNCTION track_pageview(pageview_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This is a placeholder for pageview tracking
  -- In a real implementation, you would store this data
  RETURN;
END;
$$;