-- Create comment_replies table for threaded conversations
CREATE TABLE IF NOT EXISTS public.comment_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  author uuid NOT NULL REFERENCES public.profiles(id),
  content text NOT NULL,
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  author_name text,
  author_profile_pic text
);

-- Enable RLS
ALTER TABLE public.comment_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Comment replies are viewable by everyone"
  ON public.comment_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comment replies"
  ON public.comment_replies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comment replies"
  ON public.comment_replies FOR UPDATE
  USING (author = (SELECT profiles.id FROM profiles WHERE profiles.wallet_address = (SELECT users.raw_user_meta_data->>'wallet_address' FROM auth.users WHERE users.id = auth.uid())));

CREATE POLICY "Users can delete own comment replies"
  ON public.comment_replies FOR DELETE
  USING (author = (SELECT profiles.id FROM profiles WHERE profiles.wallet_address = (SELECT users.raw_user_meta_data->>'wallet_address' FROM auth.users WHERE users.id = auth.uid())));

-- Create indexes for faster queries
CREATE INDEX idx_comment_replies_comment_id ON public.comment_replies(comment_id);
CREATE INDEX idx_comment_replies_author ON public.comment_replies(author);

-- Create comment_reply_reactions table
CREATE TABLE IF NOT EXISTS public.comment_reply_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id uuid REFERENCES public.comment_replies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  reaction_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for reactions
ALTER TABLE public.comment_reply_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reply reactions viewable by everyone"
  ON public.comment_reply_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can add reply reactions"
  ON public.comment_reply_reactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own reply reactions"
  ON public.comment_reply_reactions FOR DELETE
  USING (user_id = (SELECT profiles.id FROM profiles WHERE profiles.wallet_address = (SELECT users.raw_user_meta_data->>'wallet_address' FROM auth.users WHERE users.id = auth.uid())));

-- Create index for reactions
CREATE INDEX idx_comment_reply_reactions_reply_id ON public.comment_reply_reactions(reply_id);

-- Create function to toggle reply reactions
CREATE OR REPLACE FUNCTION toggle_comment_reply_reaction(
  p_reply_id uuid,
  p_user_id text,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile_id uuid;
  v_existing_reaction text;
  v_likes integer;
  v_dislikes integer;
BEGIN
  -- Get profile ID
  SELECT id INTO v_profile_id FROM profiles WHERE id = p_user_id::uuid;
  
  -- Check existing reaction
  SELECT reaction_type INTO v_existing_reaction
  FROM comment_reply_reactions
  WHERE reply_id = p_reply_id AND user_id = v_profile_id;
  
  -- Handle reaction logic
  IF v_existing_reaction IS NULL THEN
    INSERT INTO comment_reply_reactions (reply_id, user_id, reaction_type)
    VALUES (p_reply_id, v_profile_id, p_reaction_type);
    
    IF p_reaction_type = 'like' THEN
      UPDATE comment_replies SET likes = likes + 1 WHERE id = p_reply_id;
    ELSE
      UPDATE comment_replies SET dislikes = dislikes + 1 WHERE id = p_reply_id;
    END IF;
  ELSIF v_existing_reaction = p_reaction_type THEN
    DELETE FROM comment_reply_reactions WHERE reply_id = p_reply_id AND user_id = v_profile_id;
    
    IF p_reaction_type = 'like' THEN
      UPDATE comment_replies SET likes = GREATEST(likes - 1, 0) WHERE id = p_reply_id;
    ELSE
      UPDATE comment_replies SET dislikes = GREATEST(dislikes - 1, 0) WHERE id = p_reply_id;
    END IF;
  ELSE
    UPDATE comment_reply_reactions SET reaction_type = p_reaction_type
    WHERE reply_id = p_reply_id AND user_id = v_profile_id;
    
    IF p_reaction_type = 'like' THEN
      UPDATE comment_replies SET likes = likes + 1, dislikes = GREATEST(dislikes - 1, 0) WHERE id = p_reply_id;
    ELSE
      UPDATE comment_replies SET dislikes = dislikes + 1, likes = GREATEST(likes - 1, 0) WHERE id = p_reply_id;
    END IF;
  END IF;
  
  -- Get updated counts
  SELECT likes, dislikes INTO v_likes, v_dislikes FROM comment_replies WHERE id = p_reply_id;
  
  RETURN json_build_object('likes', v_likes, 'dislikes', v_dislikes);
END;
$$;