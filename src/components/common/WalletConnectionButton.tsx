import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Wallet, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletConnectionButtonProps {
  className?: string;
  variant?: 'gold' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

/**
 * WalletConnectionButton - A styled wallet connection button
 * Uses the wallet adapter's multi-button for wallet selection
 * Styled to match the app's gold theme
 */
const WalletConnectionButton: React.FC<WalletConnectionButtonProps> = ({
  className,
  variant = 'gold',
  size = 'sm',
  showText = true
}) => {
  const { connected, connecting, wallet } = useWallet();

  return (
    <div className={cn('wallet-adapter-button-wrapper', className)}>
      <WalletMultiButton 
        startIcon={
          connected ? (
            <Wallet className="h-4 w-4" />
          ) : (
            <LogIn className="h-4 w-4" />
          )
        }
      />
    </div>
  );
};

export default WalletConnectionButton;
