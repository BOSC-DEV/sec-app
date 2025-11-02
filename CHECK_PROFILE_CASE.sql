    -- Check case of wallet_address in profiles table
SELECT 
  id,
  wallet_address,
  created_at,
  LENGTH(wallet_address) as addr_length
FROM public.profiles
WHERE LOWER(wallet_address) = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w';

-- Also check if profile exists with exact mixed case
SELECT 
  id,
  wallet_address,
  created_at
FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';

