'use client';

import Link from 'next/link';
import { Building, BarChart3, FileCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Quick access cards for home page
 * Provides direct navigation to main sections
 */
export function QuickAccessCards() {
  const quickAccessItems = [
    {
      href: '/dashboard',
      title: 'Dashboard',
      description: 'Resumen y estadísticas',
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      href: '/apartments',
      title: 'Pisos',
      description: 'Gestionar unidades',
      icon: Building,
      color: 'bg-blue-500',
    },
    {
      href: '/audits',
      title: 'Auditorías',
      description: 'Gestión de auditorías',
      icon: FileCheck,
      color: 'bg-purple-500',
    },
    {
      href: '/incidents',
      title: 'Incidentes',
      description: 'Gestionar incidentes',
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {quickAccessItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Card className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg text-white',
                      item.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
