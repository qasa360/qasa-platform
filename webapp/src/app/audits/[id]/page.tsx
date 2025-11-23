'use client';

import { Suspense, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAuditWithItems, useCompleteAudit } from '@/lib/hooks/audit';
import {
  calculateSpacesProgress,
  getGeneralQuestions,
  areAllAuditQuestionsAnswered,
} from '@/lib/utils/audit.utils';
import { AuditHeader } from '@/components/audit/AuditHeader';
import { AuditSpacesTable } from '@/components/audit/AuditSpacesTable';
import { AuditSkeleton } from '@/components/audit/AuditSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/**
 * Página principal de auditoría - Mobile First
 * Muestra tabla de espacios con progreso
 */
export default function AuditPage() {
  const params = useParams();
  const auditId = parseInt(params.id as string);

  // Hook con React Query - cache automático
  const { data, isLoading, error } = useAuditWithItems(auditId);
  const completeAuditMutation = useCompleteAudit(auditId);

  // Cálculos memoizados (solo se recalculan si cambian los datos)
  const spacesProgress = useMemo(() => {
    if (!data?.items || !data.audit.apartment?.spaces) return [];

    // Usar espacios reales del apartamento
    const spaces = data.audit.apartment.spaces.map((space) => ({
      id: space.id,
      name: space.name,
      spaceTypeId: space.spaceTypeId,
      order: space.order,
    }));

    return calculateSpacesProgress(data.items, spaces);
  }, [data?.items, data?.audit.apartment?.spaces]);

  const generalQuestions = useMemo(() => {
    if (!data?.items) return [];
    return getGeneralQuestions(data.items);
  }, [data?.items]);

  // Verificar si todas las preguntas están completadas
  const allQuestionsAnswered = useMemo(() => {
    if (!data?.items) return false;
    return areAllAuditQuestionsAnswered(data.items);
  }, [data?.items]);

  // Verificar si la auditoría puede ser finalizada
  const canComplete = useMemo(() => {
    return (
      data?.audit.status === 'IN_PROGRESS' &&
      allQuestionsAnswered &&
      !completeAuditMutation.isPending
    );
  }, [data?.audit.status, allQuestionsAnswered, completeAuditMutation.isPending]);

  // Verificar si la auditoría ya está completada
  const isCompleted = data?.audit.status === 'COMPLETED';

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
      {/* Información del apartamento */}
      {audit.apartment && (
        <div className="mb-6 rounded-lg border bg-card p-4">
          <h2 className="mb-1 text-lg font-semibold">{audit.apartment.name}</h2>
          <p className="text-sm text-muted-foreground">
            {audit.apartment.address}
            {audit.apartment.neighborhood && `, ${audit.apartment.neighborhood}`}
            {audit.apartment.city && `, ${audit.apartment.city}`}
          </p>
        </div>
      )}

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

      {/* Botón de finalización */}
      {isCompleted ? (
        <div className="mt-6">
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Auditoría completada</AlertTitle>
            <AlertDescription>
              Esta auditoría ha sido finalizada correctamente.
            </AlertDescription>
          </Alert>
        </div>
      ) : canComplete ? (
        <div className="mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="lg"
                className="w-full"
                disabled={completeAuditMutation.isPending}
              >
                {completeAuditMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Finalizar auditoría
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Finalizar auditoría?</AlertDialogTitle>
                <AlertDialogDescription>
                  Una vez finalizada, no podrás modificar las respuestas. ¿Estás
                  seguro de que deseas finalizar esta auditoría?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => completeAuditMutation.mutate()}
                  disabled={completeAuditMutation.isPending}
                >
                  {completeAuditMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    'Finalizar'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}
    </div>
  );
}
