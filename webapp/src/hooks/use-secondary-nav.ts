'use client';

import { useState, useCallback } from 'react';
import { ReactNode } from 'react';

/**
 * Hook for managing secondary navigation content
 * Returns the current secondary nav content and a setter function
 */
export function useSecondaryNav() {
  const [secondaryNav, setSecondaryNav] = useState<ReactNode>(null);

  const updateSecondaryNav = useCallback((nav: ReactNode) => {
    setSecondaryNav(nav);
  }, []);

  const clearSecondaryNav = useCallback(() => {
    setSecondaryNav(null);
  }, []);

  return {
    secondaryNav,
    setSecondaryNav: updateSecondaryNav,
    clearSecondaryNav,
  };
}
