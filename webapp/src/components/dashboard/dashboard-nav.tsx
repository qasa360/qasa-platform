'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, TrendingUp, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Secondary navigation for Dashboard page
 * Shows dashboard-specific navigation options
 */
export function DashboardNav() {
  const pathname = usePathname();

  const dashboardNavLinks = [
    { href: '/dashboard', label: 'Resumen', icon: BarChart3 },
    { href: '/dashboard/analytics', label: 'Analíticas', icon: TrendingUp },
    { href: '/dashboard/team', label: 'Equipo', icon: Users },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <nav className="flex space-x-1">
      {dashboardNavLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === link.href
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
