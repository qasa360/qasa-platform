'use client';

import { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  secondaryNav: ReactNode;
  setSecondaryNav: (nav: ReactNode) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
}

/**
 * Context provider for managing secondary navigation per page
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  const contextValue: NavigationContextType = {
    secondaryNav: null,
    setSecondaryNav: () => {},
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to use navigation context
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
