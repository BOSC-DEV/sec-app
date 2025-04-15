import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, LogIn } from 'lucide-react';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children
}) => {
  const {
    isConnected,
    isLoading,
    connectWallet
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
            <DialogTitle>Wallet Connection Required</DialogTitle>
            <DialogDescription>To report a scammer, you need to connect your wallet first. </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <Wallet className="h-12 w-12 text-icc-gold mb-2" />
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="default" className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2" onClick={connectWallet}>
              <LogIn className="h-4 w-4" />
              Connect Wallet
            </Button>
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