
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ICCLogo from '../common/ICCLogo';
import TermsDialog from '../common/TermsDialog';
import PrivacyDialog from '../common/PrivacyDialog';
import DisclaimerDialog from '../common/DisclaimerDialog';
import CookieDialog from '../common/CookieDialog';
import SafetyDialog from '../common/SafetyDialog';
import FAQDialog from '../common/FAQDialog';
import AboutDialog from '../common/AboutDialog';
import ContactDialog from '../common/ContactDialog';
import { toast } from '@/hooks/use-toast';

const Footer = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  
  const copyToClipboard = async () => {
    const contractAddress = "HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump";
    
    try {
      await navigator.clipboard.writeText(contractAddress);
      toast({
        title: "Copied to clipboard",
        description: "Contract address copied to clipboard successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy contract address to clipboard",
        variant: "destructive",
      });
      console.error("Failed to copy: ", err);
    }
  };
  
  return <footer className="icc-footer">
      <div className="icc-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ICCLogo className="h-10 w-auto" />
              <div className="font-serif">
                <div className="text-base font-bold leading-tight">Scams & E-crimes Commission</div>
              </div>
            </Link>
            <p className="text-sm text-gray-300 dark:text-gray-400 mt-4">A decentralized crime registry bringing accountability and self governance to the new digital world.</p>
            <div className="flex space-x-4 mt-6">
              <a href="https://x.com/sandecommission" target="_blank" rel="noopener noreferrer" className="text-white hover:text-icc-gold dark:text-gray-300 dark:hover:text-icc-gold" aria-label="SEC on X">
                <img src="/lovable-uploads/91abf77b-554f-410f-85a0-15dfdfcc77e4.png" alt="X (Twitter)" className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white dark:text-gray-200 font-serif font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Home</Link></li>
              <li><Link to="/most-wanted" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Most Wanted</Link></li>
              <li><Link to="/report" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Report a Scammer</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Leaderboard</Link></li>
              <li><Link to="/profile" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Profile</Link></li>
              <li><Link to="/notifications" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm">Notifications</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white dark:text-gray-200 font-serif font-bold mb-4 mx-[7px]">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setAboutOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  About SEC
                </button>
              </li>
              <li>
                <button onClick={() => setFaqOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => setContactOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setSafetyOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Safety Guidelines
                </button>
              </li>
              <li>
                <Link to="/community" className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white dark:text-gray-200 font-serif font-bold mb-4 mx-[7px]">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setTermsOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => setPrivacyOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setDisclaimerOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => setCookiesOpen(true)} className="text-gray-300 dark:text-gray-400 hover:text-icc-gold dark:hover:text-icc-gold text-sm text-left w-full hover:bg-white/10 py-1 px-2 rounded transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-icc-blue-light dark:border-gray-700 mt-8 pt-8 text-sm text-gray-300 dark:text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Scams & E-crimes Commission. All rights reserved.</p>
            <p className="mt-2 md:mt-0"></p>
          </div>
        </div>
      </div>

      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <DisclaimerDialog open={disclaimerOpen} onOpenChange={setDisclaimerOpen} />
      <CookieDialog open={cookiesOpen} onOpenChange={setCookiesOpen} />
      <SafetyDialog open={safetyOpen} onOpenChange={setSafetyOpen} />
      <FAQDialog open={faqOpen} onOpenChange={setFaqOpen} />
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </footer>;
};
export default Footer;
