-- Manually create profile for the current user
-- User ID: 7420f722-a356-4ab7-b861-5c43ffff3f9a
-- Created at: 2025-11-02 09:50:46

INSERT INTO public.profiles (
  wallet_address,
  created_at,
  updated_at
) VALUES (
  '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W',
  now(),
  now()
)
ON CONFLICT (wallet_address) DO NOTHING;

-- Verify profile was created
SELECT id, wallet_address, created_at
FROM public.profiles
WHERE wallet_address = '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W';

