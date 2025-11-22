-- Fix search path for toggle_comment_reply_reaction function
DROP FUNCTION IF EXISTS toggle_comment_reply_reaction(uuid, text, text);

CREATE OR REPLACE FUNCTION toggle_comment_reply_reaction(
  p_reply_id uuid,
  p_user_id text,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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