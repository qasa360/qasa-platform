'use client';

import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';

/**
 * Combined providers wrapper
 * Wraps the application with all necessary context providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
