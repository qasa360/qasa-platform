'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useSecondaryNav } from '@/hooks/use-secondary-nav';

/**
 * Dashboard page - Coming soon
 * Demonstrates secondary navigation usage
 */
export default function DashboardPage() {
  const { setSecondaryNav } = useSecondaryNav();

  useEffect(() => {
    // Set secondary navigation for this page
    setSecondaryNav(<DashboardNav />);

    // Cleanup on unmount
    return () => {
      setSecondaryNav(null);
    };
  }, [setSecondaryNav]);

  return (
    <div className="container py-10">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <Construction className="h-24 w-24 text-muted-foreground/50" />
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Próximamente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              El módulo de Dashboard está en desarrollo. ¡Vuelve pronto para ver
              las actualizaciones!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
