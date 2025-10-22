'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useApartmentsWithSearch } from '@/hooks/use-apartments';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';
import { ApartmentTable } from '@/components/apartments';

/**
 * Apartments page - List and manage apartments
 * Moved from home page to dedicated apartments section
 */
export default function ApartmentsPage() {
  const {
    data: apartments,
    isLoading,
    isError,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    isSearching,
  } = useApartmentsWithSearch();

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pisos</h1>
          <p className="text-muted-foreground">
            Gestiona y administra todos los apartamentos del edificio
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar apartamentos por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {/* Show loading indicator when searching */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <ErrorState
            title="Error al cargar apartamentos"
            description={
              error?.message ||
              'No se pudieron cargar los apartamentos. Por favor, inténtalo de nuevo.'
            }
            onRetry={() => refetch()}
          />
        )}

        {/* Apartments List */}
        {!isLoading && !isError && (
          <ApartmentTable apartments={apartments || []} />
        )}
      </div>
    </div>
  );
}
