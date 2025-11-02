-- Delete ALL users with this email (including soft-deleted ones)
-- This will allow fresh signup

-- Step 1: Find all users first
SELECT 
  id,
  email,
  created_at,
  deleted_at
FROM auth.users
WHERE email LIKE '%@sec.digital'
ORDER BY created_at DESC;

-- Step 2: Hard delete all users with your email
-- Uncomment to run:
-- DELETE FROM auth.users
-- WHERE email = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital';

-- Step 3: Also delete the profile (optional, trigger will recreate it)
-- Uncomment to run:
-- DELETE FROM public.profiles
-- WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';

