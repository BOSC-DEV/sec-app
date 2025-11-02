
## Problem
Users who signed up before the password hashing fix have old passwords stored (>72 chars base64). The new code uses hashed passwords (64-char hex), causing "Invalid login credentials" errors.

## ⚠️ CURRENT ISSUE: User Already Exists with Old Password

If you're seeing:
- Signup API: `{"code":"user_already_registered"}`
- Login API: `{"code":"invalid_credentials"}`

**This means:** User exists but password is in old format. You need to delete the user.

## Immediate Fix (Quickest Solution)

### Step 1: Delete User in Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Find the user with email: `4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W@sec.digital`
5. Click the **three dots** menu → **Delete User**
6. Confirm deletion

### Step 2: User Signs In Again
- User connects wallet and signs message
- Account will be created fresh with correct hashed password
- Login will work correctly

## Alternative Fix (Bulk Migration)

If you have many users to migrate, use this SQL script in Supabase SQL Editor:

```sql
-- This script identifies legacy users that need password migration
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'wallet_address' as wallet_address
FROM auth.users
WHERE email LIKE '%@sec.digital'
  AND created_at < '2025-10-30' -- Users created before password fix
ORDER BY created_at;
```

Then use Supabase Admin API to update passwords:

1. Set up Supabase Admin client with service role key
2. For each user:
   - Request new signature from user's wallet
   - Hash signature: `SHA-256(signature) → 64-char hex`
   - Update password using Admin API

## Using Admin API Script

Run the migration script:

```bash
# Set environment variables
export SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run migration
npx tsx scripts/migrate-legacy-users.ts
```

## For Developers: Update User Password

If you have service role key, you can update password programmatically:

```typescript
import { updateUserPassword } from '@/utils/adminPasswordUpdate';

// Update specific user
const result = await updateUserPassword(
  '4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W', // wallet address
  'base64SignatureFromWallet' // user must sign a message
);

if (result.success) {
  console.log('Password updated successfully');
} else {
  console.error('Error:', result.error);
}
```

## Recommended Approach

**For Single User (Fastest):**
→ Delete user in Dashboard, let them sign up fresh

**For Multiple Users:**
→ Use Admin API script with service role key

**For Production:**
→ Set up automated migration endpoint that users can call with wallet signature

