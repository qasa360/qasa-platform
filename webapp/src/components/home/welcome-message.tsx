'use client';

import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Welcome message component for home page
 * Shows personalized greeting with current date
 */
export function WelcomeMessage() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              ¡Bienvenido a QASA Platform!
            </h1>
            <p className="mb-2 text-muted-foreground">
              Tu plataforma integral para la gestión de auditorías, calidad y
              seguridad.
            </p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
