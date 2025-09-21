import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This code only runs on the client after component mounts
    const checkIsMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

    // Set initial value
    setIsMobile(checkIsMobile());

    // Add resize listener
    function handleResize() {
      setIsMobile(checkIsMobile());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useIsMobile;
