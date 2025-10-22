'use client';

import { Package, AlertCircle } from 'lucide-react';
import { Element } from '@/lib/types/inventory';
import { ElementCard } from './element-card';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';
import { cn } from '@/lib/utils';

interface InventoryListProps {
  elements: Element[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

/**
 * List component to display inventory elements
 * Handles loading, error, and empty states
 */
export function InventoryList({
  elements,
  isLoading,
  isError,
  error,
  onRetry,
  className,
}: InventoryListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Error al cargar inventario"
        description={
          error?.message ||
          'No se pudo cargar el inventario. Por favor, inténtalo de nuevo.'
        }
        onRetry={onRetry}
      />
    );
  }

  if (!elements || elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          No hay elementos en el inventario
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Este espacio no tiene elementos registrados en el inventario.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="h-4 w-4" />
        <span>
          {elements.length} elemento{elements.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {elements.map((element) => (
          <ElementCard key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
}
