
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, LogIn, ExternalLink } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {
  const {
    isConnected,
    isLoading,
    connectWallet,
    isPhantomAvailable,
    session
  } = useProfile();
  
  const [showDialog, setShowDialog] = React.useState(!isConnected && !isLoading);
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isConnected && !showDialog) {
      setShowDialog(true);
    }
  }, [isConnected, isLoading, showDialog]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-64 w-full" />
      </div>;
  }

  // Show different dialogs based on wallet availability
  if (!isConnected) {
    return <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Connection Required</DialogTitle>
            <DialogDescription>
              {isPhantomAvailable 
                ? "To access this content, you need to connect your wallet first."
                : "Phantom wallet is required but not installed. Please install it to continue."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <Wallet className="h-12 w-12 text-icc-gold mb-2" />
          </div>
          <DialogFooter className="sm:justify-center">
            {isPhantomAvailable ? (
              <Button 
                variant="default" 
                className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2" 
                onClick={connectWallet}
              >
                <LogIn className="h-4 w-4" />
                Connect Wallet
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2" 
                onClick={() => window.open('https://phantom.app/', '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Install Phantom Wallet
              </Button>
            )}
            <Button variant="outline" onClick={() => {
              setShowDialog(false);
              navigate('/');
            }}>
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
