
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Search, User, Shield, Wallet, LogOut } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';
import { useProfile } from '@/contexts/ProfileContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, connectWallet, profile, isPhantomAvailable } = useProfile();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (profile?.username) {
      // If user has a username, navigate to their public profile
      navigate(`/${profile.username}`);
    } else {
      // If not, navigate to the profile edit page
      navigate('/profile');
    }
  };

  const handleWalletButtonClick = () => {
    if (isConnected) {
      // If connected, navigate to profile page instead of disconnecting
      navigate('/profile');
    } else {
      // If not connected, connect wallet
      connectWallet();
    }
  };

  return (
    <header className="icc-header sticky top-0 z-50">
      <div className="icc-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ICCLogo className="h-10 w-auto" />
            <div className="font-serif">
              <div className="text-xl font-bold leading-tight">Scams & E-crimes Commission</div>
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-icc-blue-light"
                  onClick={handleProfileClick}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-icc-gold text-icc-gold hover:bg-icc-blue-light flex items-center gap-2"
                  onClick={handleWalletButtonClick}
                >
                  <Wallet className="h-4 w-4" />
                  {profile ? profile.display_name.substring(0, 10) || 'Profile' : 'Profile'}
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2"
                onClick={connectWallet}
              >
                <Wallet className="h-4 w-4" />
                {isPhantomAvailable ? 'Connect Phantom' : 'Connect Wallet'}
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-icc-blue"
                      onClick={handleProfileClick}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-icc-gold text-icc-gold hover:bg-icc-blue flex items-center gap-2"
                      onClick={handleWalletButtonClick}
                      size="sm"
                    >
                      <Wallet className="h-3 w-3" />
                      {profile ? (profile.display_name.substring(0, 6) || 'Profile') : 'Profile'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2"
                    onClick={connectWallet}
                    size="sm"
                  >
                    <Wallet className="h-3 w-3" />
                    {isPhantomAvailable ? 'Connect' : 'Connect Wallet'}
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
