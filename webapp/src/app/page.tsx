'use client';

import { WelcomeMessage } from '@/components/home/welcome-message';
import { QuickAccessCards } from '@/components/home/quick-access-cards';

/**
 * Home page - Welcome dashboard with quick access and notifications
 */
export default function HomePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Welcome Message */}
        <WelcomeMessage />

        {/* Quick Access Cards */}
        <div>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Acceso Rápido
          </h2>
          <QuickAccessCards />
        </div>

        {/* Recent Summary */}
        <div>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Resumen Reciente
          </h2>
          <div className="py-12 text-center text-muted-foreground">
            <p>El resumen de actividades estará disponible próximamente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
