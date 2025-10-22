'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopNavbar } from './top-navbar';
import { Header } from './header';
import { useSecondaryNav } from '@/hooks/use-secondary-nav';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout with sidebar and top navigation
 * Responsive design: sidebar on desktop, mobile header on mobile
 * Supports collapsible sidebar
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { secondaryNav } = useSecondaryNav();
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Only visible on mobile */}
      <Header />

      {/* Desktop Sidebar - Only visible on desktop */}
      <Sidebar />

      {/* Top Navigation Bar - Visible on all devices */}
      <TopNavbar>{secondaryNav}</TopNavbar>

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300',
          isCollapsed ? 'pt-0 md:pl-14' : 'pt-0 md:pl-64'
        )}
      >
        <div>{children}</div>
      </main>
    </div>
  );
}
