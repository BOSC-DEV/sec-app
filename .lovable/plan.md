

# Fix: Display Name Turning Single Quote Into Double Quotes

## Problem
When you enter a single quote (`'`) in the display name field (like `O'Brien`), it gets saved as two single quotes (`O''Brien`). This is a bug in the input sanitization function.

## Root Cause
The `sanitizeInput` function in `src/utils/securityUtils.ts` (line 119) contains this code:

```typescript
.replace(/'/g, "''")  // Escape single quotes
```

This replaces every `'` with `''`. This is an outdated SQL injection prevention technique that was used for raw SQL queries. However, **Supabase's JavaScript client uses parameterized queries** which automatically handle escaping safely. This manual escaping is:
1. Unnecessary (Supabase already protects against SQL injection)
2. Harmful (it corrupts the user's data by doubling quotes)

## Solution
Remove the single quote escaping from `sanitizeInput` since Supabase handles this automatically. The other sanitization (removing semicolons, comment markers, etc.) can remain as an extra layer of defense, but the quote doubling must go.

## Technical Details

### File to modify: `src/utils/securityUtils.ts`

**Before (line 117-127):**
```typescript
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace SQL injection patterns
  return input
    .replace(/'/g, "''")  // Escape single quotes
    .replace(/;/g, '')    // Remove semicolons
    .replace(/--/g, '')   // Remove comment markers
    ...
};
```

**After:**
```typescript
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace SQL injection patterns
  // Note: Single quotes are NOT escaped here because Supabase uses
  // parameterized queries which handle escaping automatically
  return input
    .replace(/;/g, '')    // Remove semicolons
    .replace(/--/g, '')   // Remove comment markers
    ...
};
```

## Expected Result
After this fix, entering `Captain O'Brien` in the display name will save correctly as `Captain O'Brien` instead of `Captain O''Brien`.

