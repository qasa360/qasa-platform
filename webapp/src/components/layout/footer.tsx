'use client';

import { APP_NAME, APP_VERSION } from '@/lib/constants';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

/**
 * Application footer with copyright and version info
 * Adjusts margin based on sidebar state
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isCollapsed } = useSidebar();

  return (
    <footer className="border-t">
      <div
        className={cn(
          'flex h-14 items-center justify-between px-4 text-sm text-muted-foreground transition-all duration-300',
          isCollapsed ? 'md:pl-20' : 'md:pl-72'
        )}
      >
        <p>
          © {currentYear} {APP_NAME}. Todos los derechos reservados.
        </p>
        <p>Versión {APP_VERSION}</p>
      </div>
    </footer>
  );
}
