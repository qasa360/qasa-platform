'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Building,
  MapPin,
  User,
  Calendar,
  Home,
  Package,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApartment } from '@/hooks/use-apartments';
import { useInventoryBySpaceId } from '@/hooks/use-inventory';
import { useSecondaryNav } from '@/hooks/use-secondary-nav';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';
import { InventoryList } from '@/components/inventory';
import { ApartmentDetailNav } from '@/components/apartments/apartment-detail-nav';
import { getSpaceTypeLabel, getSpaceTypeIcon } from '@/lib/utils/space-utils';
import { SpaceType, Space } from '@/lib/types/apartment';

/**
 * Apartment detail page - Shows individual apartment information
 */
export default function ApartmentDetailPage() {
  const params = useParams();
  const apartmentId = parseInt(params.id as string);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { setSecondaryNav } = useSecondaryNav();

  // Set secondary navigation for this page
  useEffect(() => {
    setSecondaryNav(<ApartmentDetailNav />);

    // Cleanup on unmount
    return () => {
      setSecondaryNav(null);
    };
  }, [setSecondaryNav]);

  const {
    data: apartment,
    isLoading,
    isError,
    error,
    refetch,
  } = useApartment(apartmentId);

  const {
    data: inventory,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
    error: inventoryError,
    refetch: refetchInventory,
  } = useInventoryBySpaceId(selectedSpace?.id || 0);

  const handleSpaceClick = (space: Space) => {
    setSelectedSpace(space);
  };

  const handleCloseInventory = () => {
    setSelectedSpace(null);
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-10">
        <ErrorState
          title="Error al cargar apartamento"
          description={
            error?.message ||
            'No se pudo cargar la información del apartamento. Por favor, inténtalo de nuevo.'
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="container py-10">
        <ErrorState
          title="Apartamento no encontrado"
          description="El apartamento que buscas no existe o ha sido eliminado."
        />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {apartment.name}
          </h1>
          <p className="text-muted-foreground">
            {apartment.address}, {apartment.neighborhood}, {apartment.city}
          </p>
        </div>

        {/* Apartment Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Información del Apartamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Address Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{apartment.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {apartment.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent and Dates Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{apartment.agent}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">
                      {new Date(apartment.createdAt).toLocaleDateString(
                        'es-ES',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spaces Section */}
        {apartment.spaces && apartment.spaces.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Ambientes ({apartment.spaces.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {apartment.spaces
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((space) => (
                    <div
                      key={space.id}
                      onClick={() => handleSpaceClick(space)}
                      className="cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getSpaceTypeIcon(space.spaceType)}
                          </span>
                          <div>
                            <h3 className="text-sm font-medium">
                              {space.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {getSpaceTypeLabel(space.spaceType)}
                            </p>
                          </div>
                        </div>
                        {space.m2 && (
                          <span className="text-xs text-muted-foreground">
                            {space.m2}m²
                          </span>
                        )}
                      </div>
                      {space.notes && (
                        <p className="text-xs text-muted-foreground">
                          {space.notes}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                        <Package className="h-3 w-3" />
                        <span>Ver inventario</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Section */}
        {selectedSpace && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Inventario - {selectedSpace.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseInventory}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cerrar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryList
                elements={inventory || []}
                isLoading={isInventoryLoading}
                isError={isInventoryError}
                error={inventoryError}
                onRetry={refetchInventory}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
