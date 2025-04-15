
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, LogIn, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    isPhantomAvailable
  } = useProfile();
  
  const location = useLocation();
  const [showDialog, setShowDialog] = React.useState(!isConnected && !isLoading);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-64 w-full" />
      </div>;
  }

  // Instead of redirecting, show a dialog
  if (!isConnected) {
    return <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isPhantomAvailable ? "Wallet Connection Required" : "Phantom Wallet Required"}</DialogTitle>
            <DialogDescription>
              {isPhantomAvailable 
                ? "To report a scammer, you need to connect your wallet first."
                : "To use this feature, you need to install Phantom wallet first."
              }
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
                onClick={() => {
                  connectWallet();
                  // Show toast message when connecting
                  toast({
                    title: "Connecting Wallet",
                    description: "Please approve the connection request in Phantom"
                  });
                }}
              >
                <LogIn className="h-4 w-4" />
                Connect Wallet
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2" 
                onClick={() => {
                  window.open("https://phantom.app/", "_blank");
                  toast({
                    title: "Installing Phantom",
                    description: "Please install Phantom wallet and refresh the page"
                  });
                }}
              >
                <Download className="h-4 w-4" />
                Get Phantom Wallet
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowDialog(false)}>
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
