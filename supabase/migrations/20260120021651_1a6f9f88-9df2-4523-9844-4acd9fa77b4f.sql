-- Add author_bounties_raised column to chat_messages table
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS author_bounties_raised numeric DEFAULT 0;