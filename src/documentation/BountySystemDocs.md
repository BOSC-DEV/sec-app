
# Web3 / Bounty System Integration Documentation

## Overview

The Scams & E-crimes Commission platform includes a bounty system that allows users to place bounties on reported scammers. This document outlines the technical implementation of the bounty system with Phantom wallet integration (Solana blockchain).

## System Architecture

The bounty system consists of the following key components:

### 1. Frontend Components
- **ScammerCardActions** - Displays action buttons including bounty amount
- **BountyForm** - Handles collecting and submitting bounty contributions
- **BountyContributionList** - Shows all contributions for a specific scammer

### 2. Backend Services
- **bountyService.ts** - Handles CRUD operations for bounty contributions
- **phantomWallet.ts** - Manages wallet connections and transactions

### 3. Database Schema
- **bounty_contributions table** - Stores all contribution records
- **scammers table** - Includes aggregated bounty_amount field

## User Flow

1. User connects their Phantom wallet (via Profile page or during contribution attempt)
2. User browses scammer profiles and decides to add to a bounty
3. User clicks on bounty button, opening the contribution form
4. User specifies amount and optional comment
5. System processes the transaction to the dev wallet
6. System records contribution details in the database
7. UI updates to reflect the new contribution and total bounty amount

## Technical Implementation

### Wallet Integration (phantomWallet.ts)

The system integrates with Phantom wallet for Solana blockchain transactions:

```typescript
// Key functions
connectPhantomWallet() - Connects user's Phantom wallet
disconnectPhantomWallet() - Disconnects wallet
getWalletPublicKey() - Returns connected wallet's public key
isPhantomInstalled() - Checks if Phantom wallet extension is installed
signMessageWithPhantom() - Signs messages with wallet for verification
sendTransactionToDevWallet() - Sends funds to developer wallet
```

### Database Schema

#### bounty_contributions Table:
- id (UUID): Primary key
- scammer_id (Text): References the scammer
- amount (Numeric): Contribution amount in $SEC tokens
- comment (Text, optional): User's comment about the contribution
- contributor_id (Text): Wallet address of contributor
- contributor_name (Text): Display name of contributor
- contributor_profile_pic (Text, optional): Profile picture URL
- created_at (Timestamp): When the contribution was made

### Contribution Processing (BountyForm.tsx)

When a user adds to a bounty:

1. Frontend collects contribution details (amount, comment)
2. System initiates Solana transaction to dev wallet using `sendTransactionToDevWallet()`
3. After successful transaction, system calls `addBountyContribution` service
4. Database updates both the contribution record and the scammer's total bounty amount
5. UI refreshes to show the updated contribution list and total

### Service Functions (bountyService.ts)

```typescript
// Add a new bounty contribution
addBountyContribution({
  scammer_id: string;
  amount: number;
  comment?: string;
  contributor_id: string;
  contributor_name: string;
  contributor_profile_pic?: string;
  transaction_signature?: string;
}): Promise<BountyContribution>

// Get contributions for a scammer with pagination
getScammerBountyContributions(
  scammerId: string,
  page: number = 1,
  perPage: number = 5
): Promise<{ contributions: BountyContribution[]; totalCount: number }>
```

## Developer Wallet Configuration

The system uses a single developer wallet to receive all bounty contributions:

- Default address: `A6X5A7ZSvez8BK82Z5tnZJC3qarGbsxRVv8Hc3DKBiZx`
- Can be configured in ScammerDetailPage.tsx and ScammerCardActions.tsx

## Transaction Processing (Simulated)

The current implementation simulates Solana transactions:

```typescript
async function sendTransactionToDevWallet(recipientAddress: string, amount: number): Promise<string | null> {
  // 1. Check wallet connection
  // 2. Validate amount
  // 3. Create and sign transaction (simulated)
  // 4. Return transaction signature
}
```

## Security Considerations

1. **Wallet Authentication**:
   - System verifies user has connected wallet before allowing contributions
   - Wallet address is used as unique identifier for user contributions

2. **Transaction Verification**:
   - Current simulation always returns success
   - In production, would verify transaction completion on-chain

3. **Input Validation**:
   - Amount must be greater than 0
   - Validates wallet connection before processing

## UI Components

### BountyForm
- Displays developer wallet address with copy feature
- Provides amount input and optional comment field
- Handles transaction processing and database updates
- Shows loading state during transaction

### ScammerCardActions
- Displays total bounty amount
- Provides quick access to bounty contribution form
- Can open modal dialog or navigate to detail page

### BountyContributionList
- Displays all contributions with pagination
- Shows contributor info, amount, and comment
- Formatted timestamps for creation date

## Implementation Details

### How to Add Bounty Dialog to Any Component

```typescript
import ScammerCardActions from '@/components/common/ScammerCardActions';

// In your component
<ScammerCardActions
  scammer={scammerData}
  userInteraction={userInteraction}
  onUpdateInteraction={fetchUserInteraction}
  showBountyDialog={true}
  developerWalletAddress="YOUR_DEV_WALLET"
/>
```

### How to Manually Trigger Bounty Form

```typescript
import BountyForm from '@/components/scammer/BountyForm';

// In your component
<BountyForm
  scammerId={scammerId}
  scammerName={scammerName}
  developerWalletAddress={developerWalletAddress}
/>
```

## Future Enhancements

1. **Real Solana Transactions**:
   - Implement actual blockchain transactions using Solana web3.js
   - Add proper error handling for blockchain interactions
   - Implement transaction confirmation monitoring

2. **Multi-Wallet Support**:
   - Add support for other Solana wallets (Solflare, etc.)
   - Add support for other blockchains (Ethereum, etc.)

3. **Bounty Claims**:
   - Implement claiming system for successful scammer identification
   - Add verification process for claims

4. **UI Enhancements**:
   - Real-time updates of contributions using websockets
   - Improved transaction history display
   - Leaderboard for top bounty contributors

## Troubleshooting

### Common Issues

1. **Wallet Connection Failures**:
   - Check if Phantom extension is installed
   - Verify browser compatibility
   - Check console for error messages

2. **Transaction Failures**:
   - Check wallet balance
   - Check network status
   - Try smaller amount

3. **Database Update Issues**:
   - Check network connectivity
   - Verify transaction completed successfully
   - Check user authentication status

## API Reference

### phantomWallet.ts

- `getPhantomProvider(): PhantomProvider | null`
- `connectPhantomWallet(): Promise<string | null>`
- `disconnectPhantomWallet(): Promise<void>`
- `getWalletPublicKey(): string | null`
- `isPhantomInstalled(): boolean`
- `signMessageWithPhantom(message: string): Promise<string | null>`
- `sendTransactionToDevWallet(recipientAddress: string, amount: number): Promise<string | null>`

### bountyService.ts

- `addBountyContribution(contribution: {...}): Promise<BountyContribution>`
- `getScammerBountyContributions(scammerId: string, page?: number, perPage?: number): Promise<{ contributions: BountyContribution[]; totalCount: number }>`
- `updateScammerBountyAmount(scammerId: string): Promise<void>`

## Database Migrations

To set up the bounty system in a new environment, the following tables are required:

```sql
-- Scammers table requires a bounty_amount column
ALTER TABLE public.scammers 
ADD COLUMN IF NOT EXISTS bounty_amount numeric DEFAULT 0;

-- Bounty contributions table
CREATE TABLE IF NOT EXISTS public.bounty_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scammer_id TEXT NOT NULL REFERENCES public.scammers(id),
  amount NUMERIC NOT NULL,
  comment TEXT,
  contributor_id TEXT NOT NULL,
  contributor_name TEXT NOT NULL,
  contributor_profile_pic TEXT,
  transaction_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```
