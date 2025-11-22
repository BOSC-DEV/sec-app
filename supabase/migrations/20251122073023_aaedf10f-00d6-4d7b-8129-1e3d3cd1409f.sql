-- Create atomic function for announcement reactions
CREATE OR REPLACE FUNCTION public.toggle_announcement_reaction(
  p_announcement_id uuid,
  p_user_id uuid,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_reaction text;
  v_likes int;
  v_dislikes int;
BEGIN
  -- Get existing reaction if any
  SELECT reaction_type INTO v_existing_reaction
  FROM announcement_reactions
  WHERE announcement_id = p_announcement_id 
    AND user_id = p_user_id
    AND reaction_type IN ('like', 'dislike');

  -- Handle the reaction logic
  IF v_existing_reaction = p_reaction_type THEN
    -- Same reaction: remove it
    DELETE FROM announcement_reactions
    WHERE announcement_id = p_announcement_id 
      AND user_id = p_user_id 
      AND reaction_type = p_reaction_type;
    
    -- Decrement count
    IF p_reaction_type = 'like' THEN
      UPDATE announcements 
      SET likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_announcement_id;
    ELSE
      UPDATE announcements 
      SET dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_announcement_id;
    END IF;
  ELSIF v_existing_reaction IS NOT NULL THEN
    -- Opposite reaction: switch it
    UPDATE announcement_reactions
    SET reaction_type = p_reaction_type
    WHERE announcement_id = p_announcement_id 
      AND user_id = p_user_id;
    
    -- Update both counts
    IF p_reaction_type = 'like' THEN
      UPDATE announcements 
      SET likes = COALESCE(likes, 0) + 1,
          dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_announcement_id;
    ELSE
      UPDATE announcements 
      SET dislikes = COALESCE(dislikes, 0) + 1,
          likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_announcement_id;
    END IF;
  ELSE
    -- No reaction: add new one
    INSERT INTO announcement_reactions (announcement_id, user_id, reaction_type)
    VALUES (p_announcement_id, p_user_id, p_reaction_type);
    
    -- Increment count
    IF p_reaction_type = 'like' THEN
      UPDATE announcements 
      SET likes = COALESCE(likes, 0) + 1
      WHERE id = p_announcement_id;
    ELSE
      UPDATE announcements 
      SET dislikes = COALESCE(dislikes, 0) + 1
      WHERE id = p_announcement_id;
    END IF;
  END IF;

  -- Get final counts
  SELECT COALESCE(likes, 0), COALESCE(dislikes, 0)
  INTO v_likes, v_dislikes
  FROM announcements
  WHERE id = p_announcement_id;

  RETURN json_build_object('likes', v_likes, 'dislikes', v_dislikes);
END;
$$;

-- Create atomic function for reply reactions
CREATE OR REPLACE FUNCTION public.toggle_reply_reaction(
  p_reply_id uuid,
  p_user_id uuid,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_reaction text;
  v_likes int;
  v_dislikes int;
BEGIN
  -- Get existing reaction if any
  SELECT reaction_type INTO v_existing_reaction
  FROM reply_reactions
  WHERE reply_id = p_reply_id 
    AND user_id = p_user_id
    AND reaction_type IN ('like', 'dislike');

  -- Handle the reaction logic
  IF v_existing_reaction = p_reaction_type THEN
    -- Same reaction: remove it
    DELETE FROM reply_reactions
    WHERE reply_id = p_reply_id 
      AND user_id = p_user_id 
      AND reaction_type = p_reaction_type;
    
    -- Decrement count
    IF p_reaction_type = 'like' THEN
      UPDATE replies 
      SET likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_reply_id;
    ELSE
      UPDATE replies 
      SET dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_reply_id;
    END IF;
  ELSIF v_existing_reaction IS NOT NULL THEN
    -- Opposite reaction: switch it
    UPDATE reply_reactions
    SET reaction_type = p_reaction_type
    WHERE reply_id = p_reply_id 
      AND user_id = p_user_id;
    
    -- Update both counts
    IF p_reaction_type = 'like' THEN
      UPDATE replies 
      SET likes = COALESCE(likes, 0) + 1,
          dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_reply_id;
    ELSE
      UPDATE replies 
      SET dislikes = COALESCE(dislikes, 0) + 1,
          likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_reply_id;
    END IF;
  ELSE
    -- No reaction: add new one
    INSERT INTO reply_reactions (reply_id, user_id, reaction_type)
    VALUES (p_reply_id, p_user_id, p_reaction_type);
    
    -- Increment count
    IF p_reaction_type = 'like' THEN
      UPDATE replies 
      SET likes = COALESCE(likes, 0) + 1
      WHERE id = p_reply_id;
    ELSE
      UPDATE replies 
      SET dislikes = COALESCE(dislikes, 0) + 1
      WHERE id = p_reply_id;
    END IF;
  END IF;

  -- Get final counts
  SELECT COALESCE(likes, 0), COALESCE(dislikes, 0)
  INTO v_likes, v_dislikes
  FROM replies
  WHERE id = p_reply_id;

  RETURN json_build_object('likes', v_likes, 'dislikes', v_dislikes);
END;
$$;

-- Create atomic function for chat message reactions
CREATE OR REPLACE FUNCTION public.toggle_chat_message_reaction(
  p_message_id uuid,
  p_user_id uuid,
  p_reaction_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_reaction text;
  v_likes int;
  v_dislikes int;
BEGIN
  -- Get existing reaction if any
  SELECT reaction_type INTO v_existing_reaction
  FROM chat_message_reactions
  WHERE message_id = p_message_id 
    AND user_id = p_user_id
    AND reaction_type IN ('like', 'dislike');

  -- Handle the reaction logic
  IF v_existing_reaction = p_reaction_type THEN
    -- Same reaction: remove it
    DELETE FROM chat_message_reactions
    WHERE message_id = p_message_id 
      AND user_id = p_user_id 
      AND reaction_type = p_reaction_type;
    
    -- Decrement count
    IF p_reaction_type = 'like' THEN
      UPDATE chat_messages 
      SET likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_message_id;
    ELSE
      UPDATE chat_messages 
      SET dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_message_id;
    END IF;
  ELSIF v_existing_reaction IS NOT NULL THEN
    -- Opposite reaction: switch it
    UPDATE chat_message_reactions
    SET reaction_type = p_reaction_type
    WHERE message_id = p_message_id 
      AND user_id = p_user_id;
    
    -- Update both counts
    IF p_reaction_type = 'like' THEN
      UPDATE chat_messages 
      SET likes = COALESCE(likes, 0) + 1,
          dislikes = GREATEST(0, COALESCE(dislikes, 0) - 1)
      WHERE id = p_message_id;
    ELSE
      UPDATE chat_messages 
      SET dislikes = COALESCE(dislikes, 0) + 1,
          likes = GREATEST(0, COALESCE(likes, 0) - 1)
      WHERE id = p_message_id;
    END IF;
  ELSE
    -- No reaction: add new one
    INSERT INTO chat_message_reactions (message_id, user_id, reaction_type)
    VALUES (p_message_id, p_user_id, p_reaction_type);
    
    -- Increment count
    IF p_reaction_type = 'like' THEN
      UPDATE chat_messages 
      SET likes = COALESCE(likes, 0) + 1
      WHERE id = p_message_id;
    ELSE
      UPDATE chat_messages 
      SET dislikes = COALESCE(dislikes, 0) + 1
      WHERE id = p_message_id;
    END IF;
  END IF;

  -- Get final counts
  SELECT COALESCE(likes, 0), COALESCE(dislikes, 0)
  INTO v_likes, v_dislikes
  FROM chat_messages
  WHERE id = p_message_id;

  RETURN json_build_object('likes', v_likes, 'dislikes', v_dislikes);
END;
$$;