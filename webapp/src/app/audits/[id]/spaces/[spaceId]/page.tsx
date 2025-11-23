'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuditWithItems } from '@/lib/hooks/audit';
import { useInventoryBySpaceId } from '@/hooks/use-inventory';
import {
  calculateElementsProgress,
  getSpaceQuestions,
  getFollowupQuestions,
} from '@/lib/utils/audit.utils';
import { QuestionCarousel } from '@/components/audit/QuestionCarousel';
import { useRefreshAuditItems } from '@/lib/hooks/audit';
import type { AuditItem } from '@/types/audit.types';
import { AuditSkeleton } from '@/components/audit/AuditSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * Página de elementos de un espacio - Mobile First
 * Muestra todos los elementos del espacio ordenados por el primero que hay que auditar
 */
export default function SpaceElementsPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = parseInt(params.id as string);
  const spaceId = parseInt(params.spaceId as string);

  const { data, isLoading, error } = useAuditWithItems(auditId);
  const refreshItems = useRefreshAuditItems();
  const {
    data: elements,
    isLoading: isElementsLoading,
    error: elementsError,
  } = useInventoryBySpaceId(spaceId);

  // Obtener preguntas del espacio
  const spaceQuestions = useMemo(() => {
    if (!data?.items) return [];
    return getSpaceQuestions(data.items, spaceId);
  }, [data?.items, spaceId]);

  // Aplanar preguntas del espacio con sus follow-ups
  const flattenedSpaceQuestions = useMemo(() => {
    if (!data?.items || spaceQuestions.length === 0) return [];

    const flatList: AuditItem[] = [];

    spaceQuestions.forEach((question) => {
      // Agregar pregunta principal
      flatList.push(question);

      // Agregar follow-ups solo si la pregunta principal está respondida
      if (question.isAnswered) {
        const followups = getFollowupQuestions(data.items!, question.id);
        followups.forEach((followup) => {
          flatList.push(followup);
        });
      }
    });

    return flatList;
  }, [data?.items, spaceQuestions]);

  // Calcular progreso de elementos
  const elementsProgress = useMemo(() => {
    if (!data?.items || !elements) return [];

    return calculateElementsProgress(
      data.items,
      spaceId,
      elements.map((el) => ({
        id: el.id,
        name: el.name,
        elementTypeId: el.elementType.elementTypeId,
      }))
    );
  }, [data?.items, elements, spaceId]);

  // Ordenar elementos: primero los que tienen preguntas sin responder
  const sortedElements = useMemo(() => {
    if (!elementsProgress || !elements) return [];

    return [...elementsProgress].sort((a, b) => {
      // Primero los que tienen preguntas sin responder
      const aHasUnanswered = a.nextUnansweredQuestionId !== null;
      const bHasUnanswered = b.nextUnansweredQuestionId !== null;

      if (aHasUnanswered && !bHasUnanswered) return -1;
      if (!aHasUnanswered && bHasUnanswered) return 1;

      // Luego por porcentaje de completado (menor primero)
      if (a.completionRate !== b.completionRate) {
        return a.completionRate - b.completionRate;
      }

      // Finalmente por nombre
      return a.elementName.localeCompare(b.elementName);
    });
  }, [elementsProgress, elements]);

  const space = data?.audit.apartment?.spaces?.find((s) => s.id === spaceId);

  // Estados de carga y error
  if (isLoading || isElementsLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <AuditSkeleton />
      </div>
    );
  }

  if (error || elementsError) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : elementsError instanceof Error
                ? elementsError.message
                : 'No se pudo cargar la información. Por favor, intenta nuevamente.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data || !elements) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No encontrado</AlertTitle>
          <AlertDescription>
            El espacio o los elementos no se encontraron.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/audits/${auditId}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la auditoría
        </Button>
        <h1 className="text-2xl font-bold">{space?.name || 'Espacio'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona un elemento para comenzar a auditar
        </p>
      </div>

      {/* Preguntas del espacio (si las hay) */}
      {flattenedSpaceQuestions.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Preguntas del Espacio</h2>
          <QuestionCarousel
            auditId={auditId}
            questions={flattenedSpaceQuestions}
            targetType="SPACE"
            targetName={space?.name}
            onQuestionSuccess={() => refreshItems(auditId)}
          />
        </div>
      )}

      {/* Lista de elementos */}
      <div className={flattenedSpaceQuestions.length > 0 ? 'mt-8' : ''}>
        <h2 className="mb-4 text-lg font-semibold">Elementos</h2>
        {sortedElements.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No hay elementos</AlertTitle>
            <AlertDescription>
              No hay elementos disponibles en este espacio.
            </AlertDescription>
          </Alert>
        ) : (
        <div className="space-y-3">
          {sortedElements.map((elementProgress) => {
            const element = elements.find((el) => el.id === elementProgress.elementId);
            const isComplete = elementProgress.completionRate === 100;
            const hasUnanswered = elementProgress.nextUnansweredQuestionId !== null;

            return (
              <Card
                key={elementProgress.elementId}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary/50 hover:shadow-md',
                  hasUnanswered && 'border-primary/30 bg-primary/5'
                )}
                onClick={() => {
                  router.push(
                    `/audits/${auditId}/spaces/${spaceId}/elements/${elementProgress.elementId}`
                  );
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="h-5 w-5 text-primary" />
                        {elementProgress.elementName}
                      </CardTitle>
                      {element && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {element.elementType.name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isComplete ? (
                        <Badge variant="success" className="text-xs">
                          Completo
                        </Badge>
                      ) : hasUnanswered ? (
                        <Badge variant="default" className="text-xs">
                          Pendiente
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Sin preguntas
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {elementProgress.answeredQuestions} de{' '}
                        {elementProgress.totalQuestions} preguntas
                      </span>
                      <span className="font-medium">
                        {Math.round(elementProgress.completionRate)}%
                      </span>
                    </div>
                    <Progress
                      value={elementProgress.completionRate}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}

