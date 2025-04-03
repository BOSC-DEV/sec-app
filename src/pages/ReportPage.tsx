
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReportForm } from '@/hooks/useReportForm';
import CompactHero from '@/components/common/CompactHero';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ScammerInfoFields from '@/components/report/ScammerInfoFields';
import { isScammerCreator } from '@/services/reportService';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const [checkingPermission, setCheckingPermission] = useState(!!id);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  const { 
    form, 
    isEditMode, 
    isSubmitting,
    isLoading,
    photoFile, 
    setPhotoFile, 
    photoPreview, 
    setPhotoPreview, 
    onSubmit 
  } = useReportForm(id);

  // Check if user has permission to edit this scammer report
  useEffect(() => {
    const checkEditPermission = async () => {
      if (id && profile?.wallet_address) {
        try {
          const hasPermission = await isScammerCreator(id, profile.wallet_address);
          
          if (!hasPermission) {
            toast({
              title: "Permission denied",
              description: "You do not have permission to edit this scammer report.",
              variant: "destructive"
            });
            navigate('/');
            return;
          }
          
          setHasEditPermission(true);
        } catch (error) {
          console.error('Error checking edit permission:', error);
          toast({
            title: "Error",
            description: "Failed to verify edit permission. Please try again.",
            variant: "destructive"
          });
          navigate('/');
        } finally {
          setCheckingPermission(false);
        }
      } else {
        setCheckingPermission(false);
      }
    };
    
    checkEditPermission();
  }, [id, profile?.wallet_address, navigate]);

  // If checking permission or loading data, show loading state
  if (checkingPermission || isLoading) {
    return (
      <div>
        <CompactHero title={isEditMode ? "Edit Scammer Report" : "Report a Scammer"} />
        <div className="icc-section bg-white">
          <div className="icc-container flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-icc-blue" />
            <span className="ml-2 text-icc-blue">{isEditMode ? "Loading scammer data..." : "Preparing form..."}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CompactHero title={isEditMode ? "Edit Scammer Report" : "Report a Scammer"} />
      
      <div className="icc-section bg-white">
        <div className="icc-container">
          <p className="text-icc-gray mb-8">
            {isEditMode 
              ? "Update information about this scammer. All fields are editable except the bounty amount."
              : "Report a scammer to warn the community. Providing detailed information helps others recognize and avoid scams."
            }
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ScammerInfoFields 
                form={form}
                photoFile={photoFile}
                setPhotoFile={setPhotoFile}
                photoPreview={photoPreview}
                setPhotoPreview={setPhotoPreview}
              />
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    isEditMode ? "Update Report" : "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
