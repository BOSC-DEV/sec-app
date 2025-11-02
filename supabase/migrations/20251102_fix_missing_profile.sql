-- Create missing profile for existing user
-- This manually creates a profile for the user who already exists in auth.users
-- but doesn't have a matching profile

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

