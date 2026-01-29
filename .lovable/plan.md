
# Multi-Wallet Support Implementation Plan

## Overview
Add support for multiple Solana wallets (Phantom, Solflare, Backpack, and others) using the `@solana/wallet-adapter` library ecosystem, replacing the current Phantom-only implementation while maintaining backward compatibility with existing users.

## Current State Analysis

The application currently has:
- **Phantom-specific wallet utilities** in `src/utils/phantomWallet.ts`
- **Authentication tied to Phantom** in `src/contexts/ProfileContext.tsx`
- **Backend authentication** in `supabase/functions/auth-phantom/index.ts` (wallet-agnostic verification)
- **Bounty transactions** using direct Phantom provider calls
- **UI references to "Phantom"** throughout the codebase

**Good News**: The backend authentication (signature verification using `tweetnacl`) is already wallet-agnostic. Any Solana wallet's signature can be verified since they all use the same Ed25519 signing scheme.

---

## Implementation Phases

### Phase 1: Install Dependencies & Create Wallet Provider

**New Dependencies Required:**
```
@solana/wallet-adapter-base
@solana/wallet-adapter-react
@solana/wallet-adapter-react-ui
@solana/wallet-adapter-wallets
```

**New Files:**
- `src/contexts/WalletContext.tsx` - Wallet adapter provider wrapper
- `src/utils/walletAdapter.ts` - Generic wallet utilities (replaces phantomWallet.ts exports)
- `src/components/common/WalletConnectionButton.tsx` - Multi-wallet connect button

**Changes to App.tsx:**
- Wrap the application with `ConnectionProvider`, `WalletProvider`, and `WalletModalProvider`
- Configure supported wallets: Phantom, Solflare, Backpack, Glow, Coinbase

---

### Phase 2: Create Wallet Context & Utilities

**WalletContext.tsx Structure:**
```text
+----------------------------------+
|       ConnectionProvider         |
|  (Solana RPC endpoint)           |
+----------------------------------+
            |
+----------------------------------+
|        WalletProvider            |
|  (Auto-detect wallets)           |
|  - autoConnect: false            |
+----------------------------------+
            |
+----------------------------------+
|      WalletModalProvider         |
|  (Built-in wallet selection UI)  |
+----------------------------------+
```

**walletAdapter.ts Functions:**
- `getWalletConnection()` - Get current wallet from useWallet hook
- `signMessageWithWallet(message)` - Generic message signing
- `sendTransactionWithWallet(transaction)` - Generic transaction sending
- `getOrCreateAssociatedTokenAccount()` - Token account management (reuse existing logic)

---

### Phase 3: Update ProfileContext

**Key Changes:**
- Replace `isPhantomAvailable` with `isWalletAvailable`
- Replace `getPhantomProvider()` calls with wallet-adapter hooks
- Keep existing session management (24-hour persistence)
- Update event listeners to use wallet-adapter events

**State Changes:**
```text
Before:                           After:
- isPhantomAvailable    →         - isWalletAvailable
- connectPhantomWallet  →         - connectWallet (uses modal)
- disconnectPhantomWallet →       - disconnectWallet
- signMessageWithPhantom →        - signMessage (generic)
```

---

### Phase 4: Update Bounty System

**Files to Update:**
1. `src/components/scammer/BountyForm.tsx`
   - Remove direct Phantom imports
   - Use wallet-adapter hooks for transactions

2. `src/utils/phantomWallet.ts` → Refactor
   - Keep connection/transaction logic
   - Replace provider calls with wallet-adapter methods
   - Export functions that accept a wallet adapter instead of Phantom provider

**Transaction Flow (Updated):**
```text
User clicks "Add Bounty"
        ↓
Check wallet connected (via useWallet)
        ↓
Build transaction (same as before)
        ↓
Sign & send via wallet.sendTransaction()
        ↓
Confirm transaction
        ↓
Record in database
```

---

### Phase 5: Update UI Components

**Components Requiring Updates:**

| Component | Change |
|-----------|--------|
| `Header.tsx` | Replace "Install Phantom" with "Connect Wallet" |
| `ProtectedRoute.tsx` | Update messaging to be wallet-agnostic |
| `AdminProtectedRoute.tsx` | Same as above |
| `WalletInfo.tsx` | Remove Phantom-specific text |

**New Component: WalletConnectionButton**
- Uses `WalletMultiButton` from wallet-adapter-react-ui
- Custom styling to match the gold/dark theme
- Shows connected wallet icon and address

---

### Phase 6: Update Authentication Flow

**Edge Function Rename (Optional):**
- Consider renaming `auth-phantom` to `auth-wallet` for clarity
- No logic changes needed - signature verification is already wallet-agnostic

**authUtils.ts Updates:**
- Update function names/comments to be wallet-agnostic
- No logic changes needed

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/contexts/WalletContext.tsx` | Create | Wallet adapter providers |
| `src/utils/walletAdapter.ts` | Create | Generic wallet utilities |
| `src/components/common/WalletConnectionButton.tsx` | Create | Multi-wallet connect button |
| `src/App.tsx` | Modify | Add wallet providers to component tree |
| `src/contexts/ProfileContext.tsx` | Modify | Replace Phantom-specific code |
| `src/utils/phantomWallet.ts` | Modify | Refactor to use wallet adapter |
| `src/components/scammer/BountyForm.tsx` | Modify | Update imports/wallet calls |
| `src/components/layout/Header.tsx` | Modify | Update wallet button |
| `src/components/common/ProtectedRoute.tsx` | Modify | Update messaging |
| `src/components/common/AdminProtectedRoute.tsx` | Modify | Update messaging |
| `src/components/profile/WalletInfo.tsx` | Modify | Update messaging |

---

## Technical Details

### Wallet Adapter Setup in WalletContext.tsx

The wallet adapter will be configured to support these wallets:
- **Phantom** - Most popular Solana wallet
- **Solflare** - Popular alternative with mobile support
- **Backpack** - Growing wallet with xNFT support
- **Glow** - Fast growing wallet
- **Coinbase Wallet** - For Coinbase users

The adapter auto-detects installed wallets, so users only see wallets they have installed.

### Styling the Wallet Modal

The wallet-adapter-react-ui provides a built-in modal that can be styled. We'll override CSS variables to match the application's gold and dark blue theme:

```css
/* Custom wallet adapter styles */
.wallet-adapter-button {
  background: var(--icc-gold);
}
.wallet-adapter-modal {
  background: var(--icc-blue-dark);
}
```

### Backward Compatibility

- Existing users with Phantom will continue to work seamlessly
- Sessions stored in localStorage will remain valid
- Supabase auth records are tied to wallet addresses, not wallet types

### Transaction Handling

The wallet adapter provides a unified `sendTransaction` method that works across all wallets:

```typescript
// Before (Phantom-specific)
const { signature } = await provider.signAndSendTransaction(transaction);

// After (wallet-agnostic)
const signature = await wallet.sendTransaction(transaction, connection);
```

---

## Testing Considerations

After implementation, test the following scenarios:
1. Connect with Phantom wallet
2. Connect with Solflare wallet
3. Switch between wallets
4. Bounty contribution with different wallets
5. Session persistence across page reloads
6. Disconnecting and reconnecting
7. Mobile wallet connections (if applicable)

---

## Migration Notes

- No database migrations required
- No backend changes required (signature verification is wallet-agnostic)
- Existing user sessions will continue to work
- Users can reconnect with any supported wallet that has the same address
