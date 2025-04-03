
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CompactHero from '@/components/common/CompactHero';
import TermsDialog from '@/components/common/TermsDialog';
import PrivacyDialog from '@/components/common/PrivacyDialog';
import DisclaimerDialog from '@/components/common/DisclaimerDialog';
import CookieDialog from '@/components/common/CookieDialog';
import SafetyDialog from '@/components/common/SafetyDialog';
import FAQDialog from '@/components/common/FAQDialog';
import AboutDialog from '@/components/common/AboutDialog';
import ContactDialog from '@/components/common/ContactDialog';

const LegalPages: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(true);
  const { pageType } = useParams<{ pageType: string }>();
  
  const getTitle = () => {
    switch (pageType) {
      case 'terms':
        return 'Terms of Service';
      case 'privacy':
        return 'Privacy Policy';
      case 'disclaimer':
        return 'Disclaimer';
      case 'cookies':
        return 'Cookie Policy';
      case 'safety':
        return 'Safety Guidelines';
      case 'faq':
        return 'Frequently Asked Questions';
      case 'about':
        return 'About SEC';
      case 'contact':
        return 'Contact Us';
      default:
        return 'Legal Information';
    }
  };
  
  const renderDialog = () => {
    switch (pageType) {
      case 'terms':
        return <TermsDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'privacy':
        return <PrivacyDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'disclaimer':
        return <DisclaimerDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'cookies':
        return <CookieDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'safety':
        return <SafetyDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'faq':
        return <FAQDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'about':
        return <AboutDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      case 'contact':
        return <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <CompactHero title={getTitle()} />
      <section className="icc-section bg-white">
        <div className="icc-container text-center">
          <p className="text-lg mb-6">
            You are being redirected to the {getTitle()} information. If the dialog doesn't open automatically, 
            please refresh the page or return to the home page.
          </p>
        </div>
      </section>
      {renderDialog()}
    </div>
  );
};

export default LegalPages;
