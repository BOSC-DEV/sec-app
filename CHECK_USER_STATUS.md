# Check User Status in Supabase Dashboard

## The Issue

User exists but password doesn't work. Need to check user status in Supabase.

## Steps to Debug

1. **Go to Supabase Dashboard**
   - https://app.supabase.com/
   - Select project: `gparwhzrrvudmrxbxanb`

2. **Open Authentication → Users**
   - Search for: `4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital`
   - Click on the user

3. **Check These Fields:**
   - **Email confirmed:** Should be TRUE (green checkmark)
   - **User ID:** Copy this
   - **Created at:** When was account created?
   - **Last sign in:** When did they last sign in successfully?
   - **raw_user_meta_data:** What's stored there?

4. **Check if user is soft-deleted:**
   - Scroll down - is there a "Deleted at" field?
   - If YES, user was soft-deleted and needs to be restored

5. **Try manually resetting password:**
   - In user details, click "Actions" or "Reset Password"
   - See if this gives any clue about what's wrong

## Expected Findings

**If email is NOT confirmed:**
- That's why login fails!
- Fix: Disable email confirmation in Authentication → Settings

**If user is soft-deleted:**
- Profile exists in database but auth user is deleted
- Fix: Hard delete the user completely, then sign up fresh

**If password format is wrong:**
- Password stored might be in a different format than expected
- Fix: Delete user and re-sign up with correct password

## Quick Test

Try this SQL in Supabase SQL Editor:

```sql
-- Check user status
SELECT 
  id,
  email,
  email_confirmed_at,
  deleted_at,
  created_at,
  confirmed_at,
  raw_user_meta_data->>'wallet_address' as wallet_address
FROM auth.users
WHERE email = '4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital';
```

This will show:
- Is email confirmed?
- Is user soft-deleted?
- What wallet_address is stored?

