'use client';

import { Suspense, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAuditWithItems } from '@/lib/hooks/audit';
import {
  calculateSpacesProgress,
  getGeneralQuestions,
} from '@/lib/utils/audit.utils';
import { AuditHeader } from '@/components/audit/AuditHeader';
import { AuditSpacesTable } from '@/components/audit/AuditSpacesTable';
import { AuditSkeleton } from '@/components/audit/AuditSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Página principal de auditoría - Mobile First
 * Muestra tabla de espacios con progreso
 */
export default function AuditPage() {
  const params = useParams();
  const auditId = parseInt(params.id as string);

  // Hook con React Query - cache automático
  const { data, isLoading, error } = useAuditWithItems(auditId);

  // Cálculos memoizados (solo se recalculan si cambian los datos)
  const spacesProgress = useMemo(() => {
    if (!data?.items) return [];

    // TODO: Obtener espacios del apartamento desde API
    // Por ahora, extraer espacios únicos de los items
    const spaceMap = new Map<
      number,
      { id: number; name: string; spaceTypeId: number; order: number | null }
    >();

    data.items.forEach((item) => {
      if (item.spaceId && !spaceMap.has(item.spaceId)) {
        // Necesitarías obtener el nombre del espacio desde el backend
        // Por ahora usamos un placeholder
        spaceMap.set(item.spaceId, {
          id: item.spaceId,
          name: `Espacio ${item.spaceId}`, // TODO: Obtener nombre real
          spaceTypeId: 0, // TODO: Obtener desde backend
          order: null, // TODO: Obtener desde backend
        });
      }
    });

    const spaces = Array.from(spaceMap.values());
    return calculateSpacesProgress(data.items, spaces);
  }, [data?.items]);

  const generalQuestions = useMemo(() => {
    if (!data?.items) return [];
    return getGeneralQuestions(data.items);
  }, [data?.items]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <AuditSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar auditoría</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'No se pudo cargar la auditoría. Por favor, intenta nuevamente.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Auditoría no encontrada</AlertTitle>
          <AlertDescription>
            La auditoría solicitada no existe o no tienes permisos para verla.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { audit, items } = data;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      {/* Header con tiempo y progreso */}
      <div className="mb-6">
        <Suspense fallback={<div>Cargando...</div>}>
          <AuditHeader audit={audit} />
        </Suspense>
      </div>

      {/* Tabla de espacios */}
      <Suspense fallback={<AuditSkeleton />}>
        <AuditSpacesTable
          audit={audit}
          spacesProgress={spacesProgress}
          generalQuestions={generalQuestions}
        />
      </Suspense>
    </div>
  );
}
