
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, User, Shield } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const connectWallet = () => {
    // This would integrate with Phantom wallet in a real implementation
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  return (
    <header className="icc-header sticky top-0 z-50">
      <div className="icc-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ICCLogo className="h-10 w-auto" />
            <div className="font-serif">
              <div className="text-lg font-bold leading-tight">International</div>
              <div className="text-xl font-bold leading-tight">Cyber-crime Committee</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-icc-gold transition-colors">Home</Link>
            <Link to="/most-wanted" className="text-white hover:text-icc-gold transition-colors">Most Wanted</Link>
            <Link to="/report" className="text-white hover:text-icc-gold transition-colors">Report</Link>
            <Link to="/leaderboard" className="text-white hover:text-icc-gold transition-colors">Leaderboard</Link>
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue-light">
              <Search className="h-5 w-5" />
            </Button>
            
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue-light">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-icc-gold text-icc-gold hover:bg-icc-blue-light"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-icc-blue-light">
          <div className="icc-container py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-icc-gold transition-colors px-2 py-1">Home</Link>
              <Link to="/most-wanted" className="text-white hover:text-icc-gold transition-colors px-2 py-1">Most Wanted</Link>
              <Link to="/report" className="text-white hover:text-icc-gold transition-colors px-2 py-1">Report</Link>
              <Link to="/leaderboard" className="text-white hover:text-icc-gold transition-colors px-2 py-1">Leaderboard</Link>
              
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue">
                  <Search className="h-5 w-5" />
                </Button>
                
                {isConnected ? (
                  <div className="flex items-center space-x-2">
                    <Link to="/profile">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-icc-gold text-icc-gold hover:bg-icc-blue"
                      onClick={disconnectWallet}
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light"
                    onClick={connectWallet}
                    size="sm"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
