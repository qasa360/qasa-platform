'use client';

import { Bell, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Notifications panel for home page
 * Shows empty state with development message
 */
export function NotificationsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificaciones</span>
          </CardTitle>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
            0
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8">
          <Construction className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
            Sin notificaciones
          </h3>
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            El sistema de notificaciones está en desarrollo. Próximamente podrás
            recibir alertas sobre auditorías, incidentes y actualizaciones
            importantes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
