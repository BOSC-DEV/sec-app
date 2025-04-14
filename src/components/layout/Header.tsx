import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Shield, Wallet, LogOut, LogIn, Copy, Bell } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';
import { useProfile } from '@/contexts/ProfileContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { toast } from '@/hooks/use-toast';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isConnected, connectWallet, profile, isPhantomAvailable, isLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Most Wanted', path: '/most-wanted' },
    { label: 'Report', path: '/report' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Community', path: '/community' },
  ];

  return (
    <header className="icc-header sticky top-0 z-50">
      <div className="icc-container py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ICCLogo className="h-10 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center space-x-6 ml-6">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`text-white hover:text-icc-gold transition-colors flex items-center ${
                    location.pathname === item.path ? 'text-icc-gold font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle variant="outline" size="sm" className="mr-2" />
            {isLoading ? (
              <Button variant="outline" size="sm" disabled className="opacity-75">
                Loading...
              </Button>
            ) : isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-icc-blue-light relative"
                    onClick={toggleNotifications}
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                  {showNotifications && (
                    <div className={`absolute ${isMobile ? 'right-0 transform -translate-x-1/2 left-1/2' : 'right-0'} mt-2`}>
                      <NotificationDropdown onClose={() => setShowNotifications(false)} isMobile={isMobile} />
                    </div>
                  )}
                </div>
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
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-icc-blue-light"
                  onClick={copyToClipboard}
                  aria-label="Copy Contract Address"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-transparent hover:text-gray-200 border-none"
                  onClick={handleWalletButtonClick}
                >
                  <Wallet className="h-5 w-5" />
                </Button>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-icc-blue-light md:hidden"
                    onClick={toggleMenu}
                    aria-label="Menu"
                  >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-icc-blue-light"
                  onClick={copyToClipboard}
                  aria-label="Copy Contract Address"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button 
                  variant="gold"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={connectWallet}
                >
                  {isMobile ? <Wallet className="h-4 w-4 text-white" /> : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-icc-blue-light md:hidden"
                    onClick={toggleMenu}
                    aria-label="Menu"
                  >
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-icc-blue-light">
          <div className="icc-container py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
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
              ))}
              
              <div className="flex items-center justify-between pt-2">
                {isLoading ? (
                  <Button variant="outline" size="sm" disabled className="opacity-75 w-full">
                    Loading...
                  </Button>
                ) : isConnected ? (
                  <div className="flex items-center justify-around space-x-2 w-full">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-icc-blue"
                      onClick={toggleNotifications}
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
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
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-icc-blue"
                      onClick={copyToClipboard}
                      aria-label="Copy Contract Address"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-icc-gold text-icc-gold hover:bg-icc-blue flex items-center justify-center gap-2"
                      onClick={handleWalletButtonClick}
                      size="sm"
                    >
                      <Wallet className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-around space-x-2 w-full">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-icc-blue"
                      onClick={copyToClipboard}
                      aria-label="Copy Contract Address"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                    <Button 
                      className="bg-icc-gold text-icc-blue hover:bg-icc-gold-light flex items-center gap-2 w-full"
                      onClick={connectWallet}
                      size="sm"
                    >
                      <Wallet className="h-3 w-3" />
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>
              
              {showNotifications && isConnected && (
                <div className="mt-2 flex justify-center">
                  <div className="w-full max-w-[95vw]">
                    <NotificationDropdown 
                      onClose={() => setShowNotifications(false)} 
                      isMobile={true} 
                    />
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
