
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Shield } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';

const Footer = () => {
  return (
    <footer className="icc-footer">
      <div className="icc-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <ICCLogo className="h-10 w-auto" />
              <div className="font-serif">
                <div className="text-base font-bold leading-tight">Scams & E-Crime Commission</div>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mt-4">
              Tracking and exposing digital & cryptocurrency scammers worldwide.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-icc-gold">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-icc-gold">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-icc-gold">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-serif font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-icc-gold text-sm">Home</Link></li>
              <li><Link to="/most-wanted" className="text-gray-300 hover:text-icc-gold text-sm">Most Wanted</Link></li>
              <li><Link to="/report" className="text-gray-300 hover:text-icc-gold text-sm">Report a Scammer</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 hover:text-icc-gold text-sm">Leaderboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-icc-gold text-sm">About SEC</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-icc-gold text-sm">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-icc-gold text-sm">Contact Us</Link></li>
              <li><Link to="/safety" className="text-gray-300 hover:text-icc-gold text-sm">Safety Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-serif font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-300 hover:text-icc-gold text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-icc-gold text-sm">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="text-gray-300 hover:text-icc-gold text-sm">Disclaimer</Link></li>
              <li><Link to="/cookies" className="text-gray-300 hover:text-icc-gold text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-icc-blue-light mt-8 pt-8 text-sm text-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Scams & E-Crime Commission. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              This site is for informational purposes only. 
              <span className="block md:inline md:ml-1">Not affiliated with any government entity.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
