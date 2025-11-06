'use client';

import { Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Apartment } from '@/lib/types/apartment';
import { cn } from '@/lib/utils';

interface ApartmentTableProps {
  apartments: Apartment[];
  className?: string;
}

/**
 * Table component to display apartments in a row-based layout
 * Each apartment is shown as a full-width row with name prominently displayed
 * and additional details in smaller text
 */
export function ApartmentTable({ apartments, className }: ApartmentTableProps) {
  const router = useRouter();

  const handleApartmentClick = (apartmentId: number) => {
    router.push(`/apartments/${apartmentId}`);
  };

  if (!apartments || apartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          No se encontraron apartamentos
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No hay apartamentos disponibles para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1 md:space-y-2', className)}>
      {apartments.map((apartment) => (
        <div
          key={apartment.id}
          onClick={() => handleApartmentClick(apartment.id)}
          className="w-full cursor-pointer rounded-lg border border-border p-3 transition-colors hover:bg-accent/50 active:bg-accent/70 md:p-4"
        >
          <div className="flex items-start gap-2 md:gap-3">
            <div className="mt-1 hidden flex-shrink-0 md:block">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              {/* Apartment Name and Address - Responsive layout */}
              <div className="mb-1 md:mb-2">
                <div className="text-base font-semibold text-foreground md:inline md:text-lg">
                  {apartment.name}
                </div>
                <div className="text-sm text-muted-foreground md:hidden">
                  {apartment.address}
                </div>
                <span className="hidden text-base text-muted-foreground md:inline">
                  {' • '}
                  {apartment.address}
                </span>
              </div>

              {/* Additional details - Mobile optimized */}
              <div className="text-xs text-muted-foreground md:text-sm">
                <span>
                  {apartment.neighborhood}, {apartment.postalCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
