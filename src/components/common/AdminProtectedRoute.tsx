import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children
}) => {
  const { loading, isAdmin } = useAdminGuard();
  const { isConnected, isLoading } = useProfile();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!loading && (!isConnected || !isAdmin)) {
      setShowDialog(true);
    }
  }, [loading, isConnected, isAdmin]);

  if (isLoading || loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isConnected || !isAdmin) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Access Required</DialogTitle>
            <DialogDescription>
              {!isConnected
                ? "You must be connected with your wallet to access the admin dashboard."
                : "You do not have administrator privileges to access this page."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                navigate('/');
              }}
            >
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;

