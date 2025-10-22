'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  FileCheck,
  AlertTriangle,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';
import { useSidebar } from '@/hooks/use-sidebar';

/**
 * Main navigation sidebar
 * Fixed on desktop, hidden on mobile (mobile uses hamburger menu in header)
 * Supports collapsed state showing only icons
 */
export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/apartments', label: 'Pisos', icon: Building },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/audits', label: 'Auditorías', icon: FileCheck },
    { href: '/incidents', label: 'Incidentes', icon: AlertTriangle },
  ];

  return (
    <aside
      className={cn(
        'hidden transition-all duration-300 md:fixed md:inset-y-0 md:z-50 md:flex md:flex-col',
        isCollapsed ? 'md:w-14' : 'md:w-64'
      )}
    >
      <div
        className={cn(
          'flex flex-grow flex-col overflow-y-auto border-r bg-background pt-5',
          isCollapsed ? 'px-0' : 'px-0'
        )}
      >
        {/* Logo and Toggle */}
        <div
          className={cn(
            'flex flex-shrink-0 items-center justify-between',
            isCollapsed ? 'px-2' : 'px-4'
          )}
        >
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            </span>
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className={cn('mt-5 flex-1 space-y-1', isCollapsed ? 'px-1' : 'px-2')}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground',
                  isCollapsed ? 'justify-center' : ''
                )}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isCollapsed ? '' : 'mr-3'
                  )}
                />
                {!isCollapsed && link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
