
-- Create triggers to enforce rate limiting on various tables

-- 1. Report submissions rate limiting (5 per hour)
CREATE TRIGGER enforce_report_submission_rate_trigger
BEFORE INSERT ON public.report_submissions
FOR EACH ROW
EXECUTE FUNCTION public.enforce_report_submission_rate();

-- 2. Bounty contributions rate limiting (10 per hour)
CREATE TRIGGER enforce_bounty_contribution_rate_trigger
BEFORE INSERT ON public.bounty_contributions
FOR EACH ROW
EXECUTE FUNCTION public.enforce_bounty_contribution_rate();

-- 3. Chat messages rate limiting (30 per minute)
CREATE TRIGGER enforce_chat_message_rate_trigger
BEFORE INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.enforce_chat_message_rate();

-- 4. Announcements rate limiting (3 per day, except whales)
CREATE TRIGGER enforce_announcement_rate_trigger
BEFORE INSERT ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.enforce_announcement_rate();
