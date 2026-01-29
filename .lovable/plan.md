
# Fix for Loading State Getting Stuck After Multiple Login/Logout Cycles

## Problem Summary
After several login/logout cycles, the site gets stuck showing "Loading..." instead of the wallet connect button, requiring a hard cache refresh. This is caused by race conditions and improper state management in the authentication flow.

## Root Causes Identified

1. **Race conditions** between `onAuthStateChange` callback and `checkExistingSession` function - both manipulate `isLoading` concurrently
2. **Recursive auth state changes** - when wallet validation fails, calling `signOut()` inside `onAuthStateChange` triggers another auth event
3. **Unhandled rejection scenarios** - when user rejects the Phantom signature request, `isLoading` is not properly reset
4. **No timeout protection** - async operations can hang indefinitely leaving `isLoading` stuck as `true`
5. **Stale localStorage data** - saved wallet address becomes invalid but causes repeated validation attempts

## Solution Overview

### 1. Add Loading State Timeout Protection
Add a safety timeout that automatically resets `isLoading` to `false` after 15 seconds to prevent indefinite loading states.

### 2. Fix Race Conditions with Flags
Use a ref-based flag to track if initial session check is complete before allowing `onAuthStateChange` to modify loading state.

### 3. Prevent Recursive Auth Events
Defer the `signOut()` call using `setTimeout(fn, 0)` when called from within `onAuthStateChange` to break the recursive cycle.

### 4. Handle User Rejection Properly
Ensure that when users reject the Phantom signature request (error code 4001), the loading state is immediately reset.

### 5. Clear Stale Data on Failure
After multiple failed validation attempts, clear localStorage to prevent repeated failures.

---

## Technical Implementation Details

### File: `src/contexts/ProfileContext.tsx`

**Change 1: Add timeout protection and initial check tracking**
```typescript
// Add new refs and state
const initialCheckComplete = useRef(false);
const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// Helper to set loading with timeout protection
const setLoadingWithTimeout = (loading: boolean) => {
  if (loadingTimeoutRef.current) {
    clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = null;
  }
  
  setIsLoading(loading);
  
  if (loading) {
    loadingTimeoutRef.current = setTimeout(() => {
      console.warn('Loading timeout reached, forcing reset');
      setIsLoading(false);
    }, 15000); // 15 second safety timeout
  }
};
```

**Change 2: Update `onAuthStateChange` to defer signOut**
```typescript
if (!isValid) {
  // Defer signOut to prevent recursive auth events
  setTimeout(async () => {
    await supabase.auth.signOut();
  }, 0);
  // Reset state synchronously
  setWalletAddress(null);
  setIsConnected(false);
  setProfile(null);
  setIsWalletReady(false);
  localStorage.removeItem('walletAddress');
}
```

**Change 3: Update `provider.on('connect')` error handling**
```typescript
} catch (error) {
  console.error('Error during wallet authentication:', error);
  toast({
    title: 'Authentication Error',
    description: 'Failed to authenticate wallet signature. Please try again.',
    variant: 'destructive',
  });
  // Reset loading state immediately before disconnecting
  setIsLoading(false);
  disconnectWallet();
}
```

**Change 4: Clean up timeout on unmount**
```typescript
return () => {
  window.removeEventListener('DOMContentLoaded', checkPhantomAvailability);
  subscription.unsubscribe();
  if (loadingTimeoutRef.current) {
    clearTimeout(loadingTimeoutRef.current);
  }
};
```

**Change 5: Replace all `setIsLoading(true)` calls with `setLoadingWithTimeout(true)`**
This ensures every loading state has timeout protection.

---

## Expected Outcome
- Loading state will never get permanently stuck
- If any authentication flow fails or times out, the UI will recover within 15 seconds
- Users will see the "Connect Wallet" button instead of being stuck on "Loading..."
- Race conditions between concurrent auth operations will be eliminated
