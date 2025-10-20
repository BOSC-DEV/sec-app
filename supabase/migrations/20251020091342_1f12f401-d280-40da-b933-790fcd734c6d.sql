-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  profile_pic_url TEXT,
  bio TEXT,
  x_link TEXT,
  website_link TEXT,
  points INTEGER DEFAULT 0,
  sec_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create scammers table
CREATE TABLE IF NOT EXISTS public.scammers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  accused_of TEXT NOT NULL,
  wallet_addresses TEXT[],
  photo_url TEXT,
  aliases TEXT[],
  links TEXT[],
  accomplices TEXT[],
  official_response TEXT,
  bounty_amount NUMERIC DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bounty_contributions table
CREATE TABLE IF NOT EXISTS public.bounty_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scammer_id UUID REFERENCES public.scammers(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_signature TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create report_submissions table
CREATE TABLE IF NOT EXISTS public.report_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  scammer_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create announcement_reactions table
CREATE TABLE IF NOT EXISTS public.announcement_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(announcement_id, user_id, reaction_type)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_message_reactions table
CREATE TABLE IF NOT EXISTS public.chat_message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create reply_reactions table
CREATE TABLE IF NOT EXISTS public.reply_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reply_id, user_id, reaction_type)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scammers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bounty_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles (public read, users update own)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = (SELECT id FROM public.profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- RLS Policies for scammers (public read, authenticated users can create)
CREATE POLICY "Scammers are viewable by everyone" ON public.scammers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create scammers" ON public.scammers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update scammers" ON public.scammers FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for bounty_contributions
CREATE POLICY "Contributions viewable by everyone" ON public.bounty_contributions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add contributions" ON public.bounty_contributions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for report_submissions
CREATE POLICY "Reports viewable by everyone" ON public.report_submissions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can submit reports" ON public.report_submissions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for announcements
CREATE POLICY "Announcements viewable by everyone" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create announcements" ON public.announcements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own announcements" ON public.announcements FOR UPDATE USING (author_id = (SELECT id FROM public.profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));

-- RLS Policies for announcement_reactions
CREATE POLICY "Reactions viewable by everyone" ON public.announcement_reactions FOR SELECT USING (true);
CREATE POLICY "Users can add reactions" ON public.announcement_reactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own reactions" ON public.announcement_reactions FOR DELETE USING (user_id = (SELECT id FROM public.profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));

-- RLS Policies for chat_messages
CREATE POLICY "Messages viewable by everyone" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for chat_message_reactions
CREATE POLICY "Message reactions viewable by everyone" ON public.chat_message_reactions FOR SELECT USING (true);
CREATE POLICY "Users can add message reactions" ON public.chat_message_reactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own message reactions" ON public.chat_message_reactions FOR DELETE USING (user_id = (SELECT id FROM public.profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));

-- RLS Policies for replies
CREATE POLICY "Replies viewable by everyone" ON public.replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for reply_reactions
CREATE POLICY "Reply reactions viewable by everyone" ON public.reply_reactions FOR SELECT USING (true);
CREATE POLICY "Users can add reply reactions" ON public.reply_reactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own reply reactions" ON public.reply_reactions FOR DELETE USING (user_id = (SELECT id FROM public.profiles WHERE wallet_address = (SELECT raw_user_meta_data->>'wallet_address' FROM auth.users WHERE id = auth.uid())));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_scammers_updated_at BEFORE UPDATE ON public.scammers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create analytics functions
CREATE OR REPLACE FUNCTION public.get_daily_visitors()
RETURNS TABLE (date DATE, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT created_at::DATE as date, COUNT(*) as count
  FROM public.profiles
  GROUP BY created_at::DATE
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_country_stats()
RETURNS TABLE (country TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 'Unknown'::TEXT as country, COUNT(*) as count
  FROM public.profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;