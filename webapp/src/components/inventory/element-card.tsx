'use client';

import { Package, Tag, MapPin, Calendar } from 'lucide-react';
import { Element } from '@/lib/types/inventory';
import { cn } from '@/lib/utils';

interface ElementCardProps {
  element: Element;
  className?: string;
}

/**
 * Card component to display a single inventory element
 * Shows element details including name, condition, category, and notes
 */
export function ElementCard({ element, className }: ElementCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excelente':
        return 'text-green-600 bg-green-50';
      case 'bueno':
        return 'text-blue-600 bg-blue-50';
      case 'regular':
        return 'text-yellow-600 bg-yellow-50';
      case 'malo':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">
            {element.name}
          </h3>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-xs font-medium',
            getConditionColor(element.condition)
          )}
        >
          {element.condition}
        </span>
      </div>

      <div className="space-y-2">
        {/* Category and Type */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>{element.elementType.category.name}</span>
          <span>•</span>
          <span>{element.elementType.name}</span>
        </div>

        {/* Brand and Model */}
        {(element.brand || element.model) && (
          <div className="text-xs text-muted-foreground">
            {element.brand && <span>Marca: {element.brand}</span>}
            {element.brand && element.model && <span> • </span>}
            {element.model && <span>Modelo: {element.model}</span>}
          </div>
        )}

        {/* Material and Color */}
        {(element.material || element.color) && (
          <div className="text-xs text-muted-foreground">
            {element.material && <span>Material: {element.material}</span>}
            {element.material && element.color && <span> • </span>}
            {element.color && <span>Color: {element.color}</span>}
          </div>
        )}

        {/* Notes */}
        {element.notes && Object.keys(element.notes).length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Notas:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(element.notes).map(([key, value]) => (
                <div key={key} className="flex gap-1">
                  <span className="capitalize">{key}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Created date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Agregado: {formatDate(element.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
