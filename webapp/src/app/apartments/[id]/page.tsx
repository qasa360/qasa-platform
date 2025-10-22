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
  Image,
  Play,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApartment } from '@/hooks/use-apartments';
import { useInventoryBySpaceId } from '@/hooks/use-inventory';
import { useSecondaryNav } from '@/hooks/use-secondary-nav';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';
import { InventoryList } from '@/components/inventory';
import { ApartmentDetailNav } from '@/components/apartments/apartment-detail-nav';
import { getSpaceTypeLabel, getSpaceTypeIcon } from '@/lib/utils/space-utils';
import { Space } from '@/lib/types/apartment';
import { Element } from '@/lib/types/inventory';

/**
 * Apartment detail page - Shows individual apartment information
 */
export default function ApartmentDetailPage() {
  const params = useParams();
  const apartmentId = parseInt(params.id as string);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedImageSpace, setSelectedImageSpace] = useState<Space | null>(
    null
  );
  const [selectedImageElement, setSelectedImageElement] =
    useState<Element | null>(null);
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

  const handleThumbnailClick = (space: Space, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent space click
    setSelectedImageSpace(space);
  };

  const handleCloseImageModal = () => {
    setSelectedImageSpace(null);
  };

  const handleElementThumbnailClick = (
    element: Element,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent any parent click
    setSelectedImageElement(element);
  };

  const handleCloseElementImageModal = () => {
    setSelectedImageElement(null);
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
        {/* Apartment Info with Start Audit Button */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {apartment.name}
            </h1>
            <p className="text-muted-foreground">
              {apartment.address}, {apartment.neighborhood}, {apartment.city}
            </p>
          </div>
          <Button
            disabled
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Play className="mr-2 h-4 w-4" />
            INICIAR AUDITORÍA
          </Button>
        </div>
      </div>
      {/* Header with three blocks */}
      <div className="space-y-6">
        {/* Top row with three blocks */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Block 1: Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Estado
                  </p>
                  <p className="text-lg font-semibold">Activo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Block 3: Last Audit */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Última Auditoría
                  </p>
                  <p className="text-lg font-semibold">Nunca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                      className="relative cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50"
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

                      {/* Thumbnail in bottom right */}
                      <div
                        className="absolute bottom-2 right-2 h-12 w-12 cursor-pointer overflow-hidden rounded-md border bg-muted transition-colors hover:bg-muted/80"
                        onClick={(e) => handleThumbnailClick(space, e)}
                      >
                        <div className="flex h-full w-full items-center justify-center">
                          <Image className="h-6 w-6 text-muted-foreground" />
                        </div>
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
                onThumbnailClick={handleElementThumbnailClick}
              />
            </CardContent>
          </Card>
        )}

        {/* Space Image Modal */}
        <Dialog
          open={!!selectedImageSpace}
          onOpenChange={handleCloseImageModal}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImageSpace?.name} -{' '}
                {selectedImageSpace?.spaceType
                  ? getSpaceTypeLabel(selectedImageSpace.spaceType)
                  : 'Ambiente'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <div className="relative h-96 w-full max-w-2xl overflow-hidden rounded-lg border bg-muted">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <Image className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Imagen no disponible
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Haz clic para cargar una imagen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Element Image Modal */}
        <Dialog
          open={!!selectedImageElement}
          onOpenChange={handleCloseElementImageModal}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedImageElement?.name} -{' '}
                {selectedImageElement?.elementType.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <div className="relative h-96 w-full max-w-2xl overflow-hidden rounded-lg border bg-muted">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <Image className="mx-auto h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Imagen no disponible
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Haz clic para cargar una imagen
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
