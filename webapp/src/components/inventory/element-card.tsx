'use client';

import { Package, Tag, MapPin, Calendar, Image } from 'lucide-react';
import { Element } from '@/lib/types/inventory';
import { cn } from '@/lib/utils';

interface ElementCardProps {
  element: Element;
  className?: string;
  onThumbnailClick?: (element: Element, event: React.MouseEvent) => void;
}

/**
 * Card component to display a single inventory element
 * Shows element details including name, condition, category, and notes
 */
export function ElementCard({
  element,
  className,
  onThumbnailClick,
}: ElementCardProps) {
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
        'relative rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {element.name}
            </h3>
            <p className="text-xs italic text-muted-foreground">
              {element.elementType.name}
            </p>
          </div>
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
        {/* Category */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>{element.elementType.category.name}</span>
        </div>
        {/* Brand and Model */}
        {(element.brand || element.model) && (
          <div className="text-xs text-muted-foreground">
            {[element.brand, element.model].filter(Boolean).join(' • ')}
          </div>
        )}

        {/* Dimensions */}
        {element.dimensions && Object.keys(element.dimensions).length > 0 && (
          <div className="text-xs text-muted-foreground">
            {Object.values(element.dimensions).join('x')}cm
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

        {/* Created date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Agregado: {formatDate(element.createdAt)}</span>
        </div>
      </div>

      {/* Thumbnail in bottom right */}
      {onThumbnailClick && (
        <div
          className="absolute bottom-2 right-2 h-12 w-12 cursor-pointer overflow-hidden rounded-md border bg-muted transition-colors hover:bg-muted/80"
          onClick={(e) => onThumbnailClick(element, e)}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Image className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
