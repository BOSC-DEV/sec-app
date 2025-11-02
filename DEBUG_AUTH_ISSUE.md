# Debug Auth Issue

## Current State

✅ Profile created successfully: `4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W`
❌ Login fails with "invalid credentials"

## The Flow

1. User clicks connect wallet
2. Signs message with Phantom
3. `authenticateWallet()` called with wallet address and signature
4. Tries to sign in with hashed password (64-char hex)
5. Fails, tries legacy base64 signature
6. Fails, tries signup
7. Signup succeeds → profile created (we see log)
8. **Then tries to sign in again → FAILS**

## The Problem

Signup creates user with hashed password, but then sign-in fails. This means:

**Option 1:** Email confirmation is still ON
- Check: Supabase Dashboard → Authentication → Settings → Email Auth → Enable email confirmations (should be OFF)

**Option 2:** Password mismatch between signup and signin
- Need to check: What password is used for signup vs signin

**Option 3:** Case mismatch in email
- signup uses: `${walletAddress}@sec.digital`.toLowerCase()
- Need to verify: What's the actual email stored?

## Check These in Supabase Dashboard

1. Authentication → Users
   - Find user: `4a2gepav8lbx7rc5zhjtnzzg35twjutcwm11up2d5p7w@sec.digital`
   - Check: Is it confirmed? (Should be green checkmark)
   - Check: What's the email exactly?

2. Authentication → Settings → Email Auth
   - Is "Enable email confirmations" checked ON?
   - If YES → TURN IT OFF!

3. Database → profiles
   - Check: Is there a profile with wallet `4a2gepav8LBX7Rc5ZHjtNZzG35tWJutCWM11Up2d5p7W`?
   - Check: Is the wallet_address correct?

## Quick Fix

**If email confirmation is ON:**
1. Go to Authentication → Settings → Email Auth
2. Uncheck "Enable email confirmations"
3. Save
4. Delete the user from Authentication → Users
5. Try logging in again

**If email confirmation is OFF but still failing:**
Then we need to debug password hashing - run this in browser console:

```javascript
// When you try to login, add this to authUtils.ts temporarily:
console.log('Email:', email);
console.log('Hashed password:', hashedPassword);
console.log('Hashed password length:', hashedPassword.length);
```

Then check in Supabase: What password was actually stored for the user?

