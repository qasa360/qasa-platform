/**
 * Ejemplo de página de auditoría
 * Muestra cómo usar los hooks y servicios creados
 * 
 * Este es un ejemplo - puedes adaptarlo a tus necesidades
 */

'use client';

import { Suspense, useMemo } from 'react';
import { useAuditWithItems } from '@/lib/hooks/audit';
import { calculateSpacesProgress, getGeneralQuestions, formatElapsedTime, calculateElapsedTime } from '@/lib/utils/audit.utils';
import type { SpaceProgress } from '@/types/audit.types';

// Componentes que necesitarías crear
// import { AuditSpacesTable } from '@/components/audit/AuditSpacesTable';
// import { AuditSkeleton } from '@/components/audit/AuditSkeleton';
// import { ErrorMessage } from '@/components/feedback/ErrorMessage';

export default function AuditPage({ params }: { params: { id: string } }) {
  const auditId = parseInt(params.id);

  // Hook con React Query - cache automático, refetch inteligente
  const { data, isLoading, error } = useAuditWithItems(auditId);

  // Cálculos memoizados (solo se recalculan si cambian los datos)
  const spacesProgress = useMemo(() => {
    if (!data?.items) return [];
    
    // Necesitarías obtener los espacios del apartamento
    // Por ahora, ejemplo con datos mock
    const spaces = [
      { id: 1, name: 'Living', spaceTypeId: 1, order: 1 },
      { id: 2, name: 'Cocina', spaceTypeId: 2, order: 2 },
    ];
    
    return calculateSpacesProgress(data.items, spaces);
  }, [data?.items]);

  const generalQuestions = useMemo(() => {
    if (!data?.items) return [];
    return getGeneralQuestions(data.items);
  }, [data?.items]);

  const elapsedTime = useMemo(() => {
    if (!data?.audit.startedAt) return 0;
    return calculateElapsedTime(data.audit.startedAt);
  }, [data?.audit.startedAt]);

  // Estados de carga y error
  if (isLoading) {
    return <AuditSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!data) {
    return <div>Auditoría no encontrada</div>;
  }

  const { audit, items } = data;

  return (
    <div className="container mx-auto p-4">
      {/* Header con tiempo */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Auditoría #{audit.id}</h1>
        <p className="text-muted-foreground">
          Tiempo transcurrido: {formatElapsedTime(elapsedTime)}
        </p>
        <p className="text-sm">
          Progreso: {audit.completionRate.toFixed(1)}%
        </p>
      </div>

      {/* Tabla de espacios */}
      <Suspense fallback={<div>Cargando espacios...</div>}>
        <AuditSpacesTable
          audit={audit}
          spacesProgress={spacesProgress}
          generalQuestions={generalQuestions}
        />
      </Suspense>
    </div>
  );
}

/**
 * Componente de tabla de espacios (ejemplo de estructura)
 * Deberías crear esto en components/audit/AuditSpacesTable.tsx
 */
function AuditSpacesTable({
  audit,
  spacesProgress,
  generalQuestions,
}: {
  audit: any;
  spacesProgress: SpaceProgress[];
  generalQuestions: any[];
}) {
  return (
    <div className="space-y-4">
      {/* Preguntas generales primero */}
      {generalQuestions.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            Preguntas Generales ({generalQuestions.length})
          </h2>
          {/* Renderizar preguntas generales */}
        </div>
      )}

      {/* Espacios */}
      <div className="space-y-2">
        {spacesProgress.map((space) => (
          <div
            key={space.spaceId}
            className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
            onClick={() => {
              // Navegar a vista de espacio
              window.location.href = `/audits/${audit.id}/spaces/${space.spaceId}`;
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{space.spaceName}</h3>
                <p className="text-sm text-muted-foreground">
                  {space.answeredQuestions} / {space.totalQuestions} preguntas
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {space.completionRate.toFixed(0)}%
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${space.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Placeholders - deberías crear estos componentes
 */
function AuditSkeleton() {
  return <div>Cargando...</div>;
}

function ErrorMessage({ error }: { error: any }) {
  return <div>Error: {error.message}</div>;
}

