-- Make yourself admin in the database
-- This works with case-insensitive matching

-- Update using case-insensitive match
UPDATE public.profiles
SET is_admin = true
WHERE wallet_address ILIKE '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';

-- Verify admin status was set (case-insensitive)
SELECT id, username, display_name, wallet_address, is_admin
FROM public.profiles
WHERE wallet_address ILIKE '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w';

