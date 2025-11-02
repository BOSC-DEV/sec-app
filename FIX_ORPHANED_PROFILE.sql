-- Delete the orphaned profile
-- The trigger will recreate it automatically

DELETE FROM public.profiles
WHERE id = 'd44882af-659a-4636-9e76-908c21aab1f9';

-- Verify it's deleted
SELECT COUNT(*) as remaining_profiles
FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';

