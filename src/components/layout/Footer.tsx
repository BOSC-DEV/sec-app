import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Copy, BarChart } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';
import TermsDialog from '../common/TermsDialog';
import PrivacyDialog from '../common/PrivacyDialog';
import DisclaimerDialog from '../common/DisclaimerDialog';
import CookieDialog from '../common/CookieDialog';
import SafetyDialog from '../common/SafetyDialog';
import FAQDialog from '../common/FAQDialog';
import ContactDialog from '../common/ContactDialog';
import { toast } from '@/hooks/use-toast';

const Footer = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const showTokenWarning = () => {
    toast({
      title: "SEC Token Coming Soon",
      description: "The SEC token is coming soon. Be wary of scam imitations",
      variant: "default"
    });
  };

  return (
    <footer className="icc-footer pb-20 md:pb-0">
      <div className="icc-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 text-center md:text-left">
            <Link to="/" className="flex justify-center md:justify-start items-center space-x-2 mb-4">
              <ICCLogo className="h-10 w-auto" />
              <div className="font-gothic">
                <div className="text-base font-bold leading-tight">Scams and E-Crimes Commission</div>
              </div>
            </Link>
            <p className="text-sm text-gray-300 dark:text-gray-400 mt-4 text-center md:text-left">
              A decentralized crime registry bringing accountability and self governance to the new digital world.
            </p>
            <div className="flex justify-center md:justify-start items-center space-x-4 mt-6">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 p-1" onClick={() => window.open("https://x.com/sandecommission", "_blank")} aria-label="SEC on X">
                <img src="/lovable-uploads/91abf77b-554f-410f-85a0-15dfdfcc77e4.png" alt="X (Twitter)" className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 p-1" onClick={showTokenWarning} aria-label="SEC Token Info">
                <Copy className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-white dark:text-gray-200 font-gothic font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Home</Link></li>
              <li><Link to="/most-wanted" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Most Wanted</Link></li>
              <li><Link to="/new-report" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">File a Report</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Leaderboard</Link></li>
              <li><Link to="/profile" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Profile</Link></li>
              <li><Link to="/notifications" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Notifications</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white dark:text-gray-200 font-gothic font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  About SEC
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <button onClick={() => setFaqOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => setContactOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setSafetyOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Safety Guidelines
                </button>
              </li>
              <li>
                <Link to="/community" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Community
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                <button onClick={showTokenWarning} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  SEC Token
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white dark:text-gray-200 font-gothic font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setTermsOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setPrivacyOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setDisclaimerOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => setCookiesOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full py-1 px-0 rounded transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-icc-blue-light dark:border-gray-700">
          <p className="text-xs text-gray-300 dark:text-gray-500 whitespace-nowrap text-left">&copy; {new Date().getFullYear()} Scams and E-Crimes Commission. All rights reserved.</p>
        </div>
      </div>

      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <DisclaimerDialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen} />
      <CookieDialog open={cookiesOpen} onOpenChange={setCookiesOpen} />
      <SafetyDialog open={safetyOpen} onOpenChange={setSafetyOpen} />
      <FAQDialog open={faqOpen} onOpenChange={setFaqOpen} />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </footer>
  );
};

export default Footer;
