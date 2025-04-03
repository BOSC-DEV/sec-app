
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Shield, Wallet, LogOut, LogIn } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';
import { useProfile } from '@/contexts/ProfileContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, connectWallet, profile, isPhantomAvailable, isLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
    setIsMenuOpen(false);
  };

  const handleWalletButtonClick = () => {
    if (isConnected) {
      // If connected, navigate to profile page instead of disconnecting
      navigate('/profile');
    } else {
      // If not connected, connect wallet
      connectWallet();
    }
    setIsMenuOpen(false);
  };

  // Navigation items for reuse in both desktop and mobile
  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Most Wanted', path: '/most-wanted' },
    { label: 'Report', path: '/report' },
    { label: 'Leaderboard', path: '/leaderboard' },
  ];

  return (
    <header className="icc-header sticky top-0 z-50">
      <div className="icc-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ICCLogo className="h-10 w-auto" />
            <div className="font-serif max-w-[200px] md:max-w-none">
              <div className="text-base md:text-xl font-bold leading-tight">Scams & E-crimes Commission</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`text-white hover:text-icc-gold transition-colors ${
                  location.pathname === item.path ? 'text-icc-gold font-medium' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <Button variant="outline" size="sm" disabled className="opacity-75">
                Loading...
              </Button>
            ) : isConnected ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-icc-blue-light"
                  onClick={handleProfileClick}
                  aria-label="Profile"
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
                <LogIn className="h-4 w-4" />
                Log In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
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
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`text-white hover:text-icc-gold transition-colors px-2 py-1 ${
                    location.pathname === item.path ? 'text-icc-gold font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="flex items-center justify-between pt-2">
                {isLoading ? (
                  <Button variant="outline" size="sm" disabled className="opacity-75 w-full">
                    Loading...
                  </Button>
                ) : isConnected ? (
                  <div className="flex items-center space-x-2 w-full">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-icc-blue"
                      onClick={handleProfileClick}
                      aria-label="Profile"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-icc-gold text-icc-gold hover:bg-icc-blue flex items-center gap-2 flex-1"
                      onClick={handleWalletButtonClick}
                      size="sm"
                    >
                      <Wallet className="h-3 w-3" />
                      {profile ? (profile.display_name.substring(0, 6) || 'Profile') : 'Profile'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2 w-full"
                    onClick={connectWallet}
                    size="sm"
                  >
                    <LogIn className="h-3 w-3" />
                    Log In
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
