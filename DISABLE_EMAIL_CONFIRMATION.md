# Disable Email Confirmation in Supabase

## Problem
After signup succeeds, sign-in fails with "Invalid login credentials" because Supabase requires email confirmation by default. Since we're using wallet signatures for authentication, email confirmation is not needed.

## Solution: Disable Email Confirmation

### Step 1: Open Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** (or **Providers** → **Email**)

### Step 2: Disable Email Confirmation
1. Find **"Confirm email"** or **"Enable email confirmations"** setting
2. **Turn it OFF** / **Disable** it
3. Save changes

### Alternative: Set via Supabase SQL Editor
Run this SQL in Supabase SQL Editor:

```sql
-- Disable email confirmation
-- This requires admin access to auth schema

-- Note: This must be done via Supabase Dashboard or Admin API
-- SQL cannot directly modify auth settings
```

**OR use Supabase Dashboard:**
- Go to **Authentication** → **Settings**
- Scroll to **"Email Auth"** section
- Uncheck **"Enable email confirmations"**
- Click **Save**

## After Disabling Email Confirmation

Once disabled:
1. User signs up → Account created
2. User is immediately authenticated (session created)
3. Sign-in will work correctly

## Why This is Safe

Since we're using **wallet signatures** for authentication:
- The signature proves wallet ownership (cryptographically secure)
- Email confirmation adds no additional security
- Wallet verification is stronger than email verification

## Verification

After disabling:
1. Delete any existing test users
2. Sign up with a new wallet
3. Check that `signUpData.session` exists (not null)
4. Sign-in should work immediately

