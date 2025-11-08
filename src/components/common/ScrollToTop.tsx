import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Aggressive scroll to top on route change
  useEffect(() => {
    // Immediately scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Lock scroll temporarily to prevent any other scroll events
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Force scroll again after a short delay to override any component mount behaviors
    const timer1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);

    // Re-enable scrolling
    const timer2 = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = originalOverflow;
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
