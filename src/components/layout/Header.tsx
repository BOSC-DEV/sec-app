
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Copy, Bell, LogIn, Wallet, ExternalLink, Clipboard } from 'lucide-react';
import ICCLogo from '../common/ICCLogo';
import { useProfile } from '@/contexts/ProfileContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { toast } from '@/hooks/use-toast';
import NotificationDropdown from '../notifications/NotificationDropdown';
import NotificationIndicator from '../notifications/NotificationIndicator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdminGuard } from '@/hooks/useAdminGuard';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const {
    isConnected,
    connectWallet,
    profile,
    isPhantomAvailable,
    isLoading
  } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAdmin } = useAdminGuard();

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
    } else if (isPhantomAvailable) {
      connectWallet();
    } else {
      // Open Phantom install page
      window.open('https://phantom.app/', '_blank');
      toast({
        title: "Phantom Wallet Required",
        description: "Please install Phantom wallet to continue",
        variant: "default"
      });
    }
    setIsMenuOpen(false);
  };

  const copyToClipboard = async () => {
    const contractAddress = "HocVFWDa8JFg4NG33TetK4sYJwcACKob6uMeMFKhpump";
    try {
      await navigator.clipboard.writeText(contractAddress);
      toast({
        title: "Copied CA",
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        variant: "destructive"
      });
      console.error("Failed to copy: ", err);
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const navigationItems = [{
    label: 'Home',
    path: '/'
  }, {
    label: 'Most Wanted',
    path: '/most-wanted'
  }, {
    label: 'Report',
    path: '/report'
  }, {
    label: 'Leaderboard',
    path: '/leaderboard'
  }, {
    label: 'Community',
    path: '/community'
  }, {
    label: 'Docs',
    path: '/docs'
  }];

  return <header className="icc-header sticky top-0 z-50">
      <div className="icc-container py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ICCLogo className="h-10 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center space-x-6 ml-6">
              {navigationItems.map(item => <Link key={item.path} to={item.path} className={`text-white hover:text-icc-gold transition-colors flex items-center ${location.pathname === item.path ? 'text-icc-gold font-medium' : ''}`}>
                  {item.label}
                </Link>)}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle variant="outline" size="sm" className="mr-2" />
            {isLoading ? <Button variant="outline" size="sm" disabled className="opacity-75">
                Loading...
              </Button> : isConnected ? <div className="flex items-center space-x-3">
                <NotificationIndicator onClick={toggleNotifications} />
                
                {isAdmin && (
                  <Button variant="ghost" size="sm" className="text-white hover:bg-icc-blue-light" onClick={() => navigate('/admin')}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue-light" onClick={handleProfileClick} aria-label="Profile">
                  <User className="h-5 w-5" />
                </Button>
                {isMobile && <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue-light md:hidden" onClick={toggleMenu} aria-label="Menu">
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>}
              </div> : <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue-light" onClick={copyToClipboard} aria-label="Copy Contract Address">
                  <Copy className="h-5 w-5" />
                </Button>
                <Button variant="gold" size="sm" className="flex items-center gap-2" onClick={handleWalletButtonClick}>
                  {!isPhantomAvailable ? <>
                      <ExternalLink className="h-4 w-4" />
                      {!isMobile && "Install Phantom"}
                    </> : isMobile ? <Wallet className="h-4 w-4 text-white" /> : <>
                      <LogIn className="h-4 w-4" />
                      Connect Wallet
                    </>}
                </Button>
                {isMobile && <Button variant="ghost" size="icon" className="text-white hover:bg-icc-blue-light md:hidden" onClick={toggleMenu} aria-label="Menu">
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>}
              </div>}
          </div>
        </div>
      </div>

      {isMenuOpen && <div className="md:hidden bg-icc-blue-light">
          <div className="icc-container py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map(item => <Link key={item.path} to={item.path} className={`text-white hover:text-icc-gold transition-colors px-2 py-1 flex items-center ${location.pathname === item.path ? 'text-icc-gold font-medium' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>)}
              {isAdmin && (
                <Link to="/admin" className={`text-white hover:text-icc-gold transition-colors px-2 py-1 flex items-center ${location.pathname === '/admin' ? 'text-icc-gold font-medium' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button 
                className="text-white hover:text-icc-gold transition-colors px-2 py-1 text-left" 
                onClick={() => {
                  copyToClipboard();
                  setIsMenuOpen(false);
                }}
              >
                Contract Address
              </button>
            </nav>
          </div>
        </div>}
      
      <NotificationDropdown open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>;
};

export default Header;
