
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Shield, Wallet, LogOut, LogIn, Copy } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';
import { useProfile } from '@/contexts/ProfileContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, connectWallet, profile, isPhantomAvailable, isLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (profile?.username) {
      navigate(`/${profile.username}`);
    } else {
      navigate('/profile');
    }
    setIsMenuOpen(false);
  };

  const handleWalletButtonClick = () => {
    if (isConnected) {
      navigate('/profile');
    } else {
      connectWallet();
    }
    setIsMenuOpen(false);
  };

  const copyToClipboard = async () => {
    const walletAddress = "HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump";
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Copied to clipboard",
        description: "Wallet address copied to clipboard successfully",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy wallet address to clipboard",
        variant: "destructive",
      });
      console.error("Failed to copy: ", err);
    }
  };

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Most Wanted', path: '/most-wanted' },
    { label: 'Report', path: '/report' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Community', path: '/community' },
    { label: 'Ca', onClick: copyToClipboard, icon: <Copy className="h-3 w-3 mr-1" /> },
  ];

  return (
    <header className="icc-header sticky top-0 z-50">
      <div className="icc-container py-3">
        <div className="flex justify-between items-center w-full">
          {/* Logo moved more left with increased spacing */}
          <div className="flex items-center pr-4">
            <Link to="/" className="flex items-center space-x-2">
              <ICCLogo className="h-10 w-auto" />
              <div className="font-serif max-w-[200px] md:max-w-none">
                <div className="text-base md:text-xl font-bold leading-tight">Scams & E-crimes Commission</div>
              </div>
            </Link>
          </div>

          {/* Mobile toggle button - only visible on small screens */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>

          {/* Navigation items - centered and spread across */}
          <nav className="hidden md:flex items-center justify-center space-x-8 flex-grow">
            {navigationItems.map((item) => (
              item.path ? (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`text-white hover:text-icc-gold transition-colors flex items-center ${
                    location.pathname === item.path ? 'text-icc-gold font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="text-white hover:text-icc-gold transition-colors flex items-center"
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            ))}
          </nav>

          {/* Connect wallet button moved more right */}
          <div className="hidden md:flex items-center pl-4">
            <ThemeToggle variant="outline" size="sm" className="mr-2" />
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
                  size="sm"
                  className="border-icc-gold text-icc-gold hover:bg-icc-blue-light flex items-center gap-2"
                  onClick={handleWalletButtonClick}
                >
                  <Wallet className="h-4 w-4" />
                  {profile ? profile.display_name.substring(0, 10) || 'Profile' : 'Profile'}
                </Button>
              </div>
            ) : (
              <Button 
                variant="gold"
                size="sm"
                className="flex items-center gap-2"
                onClick={connectWallet}
              >
                <LogIn className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-icc-blue-light">
          <div className="icc-container py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                item.path ? (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`text-white hover:text-icc-gold transition-colors px-2 py-1 flex items-center ${
                      location.pathname === item.path ? 'text-icc-gold font-medium' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      item.onClick();
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:text-icc-gold transition-colors px-2 py-1 flex items-center"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )
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
