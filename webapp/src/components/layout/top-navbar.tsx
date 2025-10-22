'use client';

import { ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMounted } from '@/hooks';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

interface TopNavbarProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Top navigation bar for secondary navigation
 * Fixed at the top, contains page-specific navigation and actions
 * Adjusts left margin based on sidebar state
 */
export function TopNavbar({ children, className }: TopNavbarProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const { isCollapsed } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={cn(
          'flex h-14 items-center justify-between px-4 transition-all duration-300',
          isCollapsed ? 'md:pl-18 pl-4' : 'pl-4 md:pl-72'
        )}
      >
        {/* Secondary Navigation Content */}
        <div className="flex-1">{children}</div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
            {/* Notification badge */}
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              0
            </span>
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Cambiar tema</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
