'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Secondary navigation for apartment detail page
 * Shows back button and apartment context
 */
export function ApartmentDetailNav() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/apartments');
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleBackClick}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver a Pisos</span>
      </Button>

      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Building className="h-4 w-4" />
        <span>Detalle del Apartamento</span>
      </div>
    </div>
  );
}
