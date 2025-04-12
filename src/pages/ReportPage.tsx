
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
import Turnstile from '@/components/common/Turnstile';
import { TURNSTILE_SITE_KEY } from '@/services/turnstileService';

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
    onSubmit,
    handleTurnstileVerify 
  } = useReportForm(id);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isSubmitting && !isLoading && !checkingPermission) {
          form.handleSubmit(onSubmit)();
        }
      }
      
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form, navigate, onSubmit, isSubmitting, isLoading, checkingPermission]);

  if (checkingPermission || isLoading) {
    return (
      <div>
        <CompactHero title={isEditMode ? "Edit Scammer Report" : "File a Report"} />
        <div className="icc-section bg-white" role="status" aria-live="polite">
          <div className="icc-container flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-icc-blue" aria-hidden="true" />
            <span className="ml-2 text-icc-blue">{isEditMode ? "Loading scammer data..." : "Preparing form..."}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CompactHero 
        title={isEditMode ? "Edit Scammer Report" : "File a Report"} 
        subtitle="More details help prevent harm to future victims"
      />
      
      <div className="icc-section bg-white">
        <div className="icc-container">
          {isEditMode ? (
            <p className="text-icc-gray mb-8">
              Update information about this scammer. All fields are editable except the bounty amount.
            </p>
          ) : (
            <p className="text-icc-gray mb-8">
              Help protect the community by reporting scammers. Please complete the verification below and fill out the form.
            </p>
          )}
          
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-8"
              aria-label={isEditMode ? "Edit scammer report form" : "Report a scammer form"}
            >
              <ScammerInfoFields 
                form={form}
                photoFile={photoFile}
                setPhotoFile={setPhotoFile}
                photoPreview={photoPreview}
                setPhotoPreview={setPhotoPreview}
              />
              
              {!isEditMode && (
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">Verification</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Please complete the verification below to submit your report.
                  </p>
                  <Turnstile 
                    siteKey={TURNSTILE_SITE_KEY}
                    onVerify={handleTurnstileVerify}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  aria-label="Cancel and return to previous page"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  aria-label={isSubmitting ? 
                    (isEditMode ? "Updating report, please wait" : "Submitting report, please wait") : 
                    (isEditMode ? "Update report" : "Submit report")
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
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
