'use client';

import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  formatElapsedTime,
  calculateElapsedTime,
} from '@/lib/utils/audit.utils';
import { useMemo, useEffect, useState } from 'react';
import type { Audit } from '@/types/audit.types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AuditHeaderProps {
  audit: Audit;
}

/**
 * Header de auditoría - Mobile First
 * Muestra tiempo transcurrido, progreso y estado
 */
export function AuditHeader({ audit }: AuditHeaderProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    calculateElapsedTime(audit.startedAt)
  );

  // Actualizar reloj cada segundo
  useEffect(() => {
    if (!audit.startedAt || audit.status === 'COMPLETED') return;

    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsedTime(audit.startedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [audit.startedAt, audit.status]);

  const statusConfig = {
    DRAFT: { label: 'Borrador', variant: 'outline' as const },
    IN_PROGRESS: { label: 'En Progreso', variant: 'default' as const },
    COMPLETED: { label: 'Completada', variant: 'success' as const },
  };

  const status = statusConfig[audit.status];

  return (
    <div className="space-y-4">
      {/* Título y estado */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="mb-1 text-xl font-bold leading-tight">
            Auditoría #{audit.id}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
            {audit.status === 'COMPLETED' && audit.completedAt && (
              <span className="text-xs text-muted-foreground">
                Completada el{' '}
                {new Date(audit.completedAt).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tiempo transcurrido - Solo en mobile si hay espacio */}
      {audit.status === 'IN_PROGRESS' && audit.startedAt && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-xs text-muted-foreground">
              Tiempo transcurrido
            </p>
            <p className="font-mono text-lg font-semibold tabular-nums">
              {formatElapsedTime(elapsedSeconds)}
            </p>
          </div>
        </div>
      )}

      {/* Barra de progreso global */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso general</span>
          <span className="font-semibold tabular-nums">
            {Math.round(audit.completionRate)}%
          </span>
        </div>
        <Progress value={audit.completionRate} size="lg" />
        <p className="text-xs text-muted-foreground">
          {audit.completionRate === 100
            ? '¡Auditoría completada!'
            : 'Completa todas las preguntas para finalizar'}
        </p>
      </div>
    </div>
  );
}
