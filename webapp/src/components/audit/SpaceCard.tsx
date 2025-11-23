'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpaceProgress } from '@/types/audit.types';
import Link from 'next/link';

interface SpaceCardProps {
  auditId: number;
  space: SpaceProgress;
  onClick?: () => void;
}

/**
 * Tarjeta de espacio - Mobile First
 * Muestra progreso y permite navegar a la vista del espacio
 */
export function SpaceCard({ auditId, space, onClick }: SpaceCardProps) {
  const isComplete = space.completionRate === 100;
  const isInProgress = space.completionRate > 0 && space.completionRate < 100;

  return (
    <Link href={`/audits/${auditId}/spaces/${space.spaceId}`}>
      <Card
        className={cn(
          'transition-all active:scale-[0.98]',
          'touch-manipulation', // Mejora respuesta táctil en mobile
          isComplete &&
            'border-green-500/50 bg-green-50/50 dark:bg-green-950/20',
          isInProgress && 'border-primary/50'
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          {/* Header: Nombre y estado */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="truncate text-base font-semibold leading-tight">
                  {space.spaceName}
                </h3>
                {isComplete && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                )}
                {!isComplete && !isInProgress && (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {space.answeredQuestions} de {space.totalQuestions} preguntas
              </p>
            </div>
            <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          </div>

          {/* Barra de progreso */}
          <div className="mb-2">
            <Progress value={space.completionRate} size="md" />
          </div>

          {/* Footer: Porcentaje y badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tabular-nums">
                {Math.round(space.completionRate)}%
              </span>
              {!space.hasRequiredPhotos && (
                <Badge variant="warning" className="px-1.5 py-0 text-[10px]">
                  📷 Fotos
                </Badge>
              )}
            </div>
            {space.order !== null && (
              <Badge variant="outline" className="text-[10px]">
                #{space.order}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
