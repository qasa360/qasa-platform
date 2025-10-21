'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building, MapPin, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApartment } from '@/hooks/use-apartments';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';

/**
 * Apartment detail page - Shows individual apartment information
 */
export default function ApartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = parseInt(params.id as string);

  const {
    data: apartment,
    isLoading,
    isError,
    error,
    refetch,
  } = useApartment(apartmentId);

  const handleBackClick = () => {
    router.back();
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
          onRetry={handleBackClick}
        />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {apartment.name}
            </h1>
            <p className="text-muted-foreground">
              {apartment.address}, {apartment.city}
            </p>
          </div>
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Dirección
                    </p>
                    <p className="text-sm">{apartment.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Barrio
                    </p>
                    <p className="text-sm">{apartment.neighborhood}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ciudad
                    </p>
                    <p className="text-sm">{apartment.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Código Postal
                    </p>
                    <p className="text-sm">{apartment.postalCode}</p>
                  </div>
                </div>
              </div>

              {/* Agent and Dates Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Agente
                    </p>
                    <p className="text-sm">{apartment.agent}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Creación
                    </p>
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

                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Última Actualización
                    </p>
                    <p className="text-sm">
                      {new Date(apartment.updatedAt).toLocaleDateString(
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
      </div>
    </div>
  );
}
