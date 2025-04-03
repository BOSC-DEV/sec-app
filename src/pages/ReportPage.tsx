
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import ScammerInfoFields from '@/components/report/ScammerInfoFields';
import DynamicFieldArray from '@/components/report/DynamicFieldArray';
import ScammerPhotoUpload from '@/components/report/ScammerPhotoUpload';
import CompactHero from '@/components/common/CompactHero';
import { fetchScammerById } from '@/services/reportService';
import { useReportForm } from '@/hooks/useReportForm';
import FallbackUI from '@/components/common/FallbackUI';

const ReportPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    form,
    isEditMode,
    isSubmitting,
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    uploadError,
    onSubmit
  } = useReportForm(id);
  
  const { control, handleSubmit, reset, setValue, formState: { errors } } = form;

  const { data: scammer, isLoading: isLoadingScammer, error: scammerError } = useQuery({
    queryKey: ['edit-scammer', id],
    queryFn: () => fetchScammerById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (scammer) {
      reset({
        name: scammer.name || '',
        accused_of: scammer.accused_of || '',
        wallet_addresses: scammer.wallet_addresses?.length ? scammer.wallet_addresses : [''],
        photo_url: scammer.photo_url || '',
        aliases: scammer.aliases?.length ? scammer.aliases : [''],
        links: scammer.links?.length ? scammer.links : [''],
        accomplices: scammer.accomplices?.length ? scammer.accomplices : [''],
      });
      
      if (scammer.photo_url) {
        setPhotoPreview(scammer.photo_url);
      }
    }
  }, [scammer, reset, setPhotoPreview]);

  if (scammerError) {
    return (
      <FallbackUI 
        title="Error Loading Scammer Data"
        message="We couldn't load the scammer information. Please try again."
        onRetry={() => window.location.reload()}
        variant="error"
      />
    );
  }

  return (
    <>
      <CompactHero 
        title={isEditMode ? "Edit Scammer Report" : "Report a Scammer"} 
        subtitle={isEditMode ? "Update scammer details to help keep the community informed" : "Fill out the form below to report a scammer to the $SEC database"} 
      />
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? "Edit Scammer Report" : "Report a Scammer"}</CardTitle>
            <CardDescription>
              {isEditMode ? "Update the scammer's information." : "Fill out the form below to report a scammer."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} id="report-form" className="space-y-6">
                <div className="space-y-6">
                  <ScammerInfoFields control={control} errors={errors} />

                  <DynamicFieldArray
                    name="wallet_addresses"
                    label="Wallet Addresses"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <DynamicFieldArray
                    name="aliases"
                    label="Aliases"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <DynamicFieldArray
                    name="links"
                    label="Links"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <DynamicFieldArray
                    name="accomplices"
                    label="Accomplices"
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />

                  <ScammerPhotoUpload
                    photoPreview={photoPreview}
                    setPhotoPreview={setPhotoPreview}
                    photoFile={photoFile}
                    setPhotoFile={setPhotoFile}
                    setValue={setValue}
                    control={control}
                  />
                  
                  {uploadError && (
                    <div className="text-red-500 text-sm mt-2">
                      {uploadError}
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button form="report-form" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Report" : "Submit Report"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ReportPage;
