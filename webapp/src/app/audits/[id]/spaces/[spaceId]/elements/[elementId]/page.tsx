'use client';

import { useMemo } from 'react';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuditWithItems } from '@/lib/hooks/audit';
import { useInventoryBySpaceId } from '@/hooks/use-inventory';
import {
  getElementQuestions,
  getFollowupQuestions,
  getNextElementInSpace,
  getNextSpace,
  areAllElementQuestionsAnswered,
} from '@/lib/utils/audit.utils';
import { QuestionCarousel } from '@/components/audit/QuestionCarousel';
import { AuditSkeleton } from '@/components/audit/AuditSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRefreshAuditItems } from '@/lib/hooks/audit';
import type { AuditItem } from '@/types/audit.types';

/**
 * Página de auditoría de un elemento específico - Mobile First
 * Muestra todas las preguntas del elemento en un carousel
 */
export default function ElementAuditPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = parseInt(params.id as string);
  const spaceId = parseInt(params.spaceId as string);
  const elementId = parseInt(params.elementId as string);

  const { data, isLoading, error } = useAuditWithItems(auditId);
  const refreshItems = useRefreshAuditItems();
  const {
    data: elements,
    isLoading: isElementsLoading,
    error: elementsError,
  } = useInventoryBySpaceId(spaceId);

  // Obtener preguntas del elemento
  const elementQuestions = useMemo(() => {
    if (!data?.items) return [];
    return getElementQuestions(data.items, elementId);
  }, [data?.items, elementId]);

  // Aplanar preguntas con sus follow-ups
  const flattenedQuestions = useMemo(() => {
    if (!data?.items || elementQuestions.length === 0) return [];

    const flatList: AuditItem[] = [];

    elementQuestions.forEach((question) => {
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
  }, [data?.items, elementQuestions]);

  const element = elements?.find((el) => el.id === elementId);
  const space = data?.audit.apartment?.spaces?.find((s) => s.id === spaceId);

  const handleQuestionSuccess = () => {
    // Refrescar items para obtener follow-ups y actualizar estado
    refreshItems(auditId);
  };

  // Verificar si todas las preguntas del elemento están completadas
  const allElementQuestionsAnswered = useMemo(() => {
    if (!data?.items) return false;
    return areAllElementQuestionsAnswered(data.items, elementId);
  }, [data?.items, elementId]);

  // Efecto para redirigir cuando se completen todas las preguntas del elemento
  React.useEffect(() => {
    if (
      allElementQuestionsAnswered &&
      data?.items &&
      data.audit.apartment?.spaces
    ) {
      // Esperar un momento para asegurar que los datos estén actualizados
      const timeoutId = setTimeout(() => {
        // 1. Buscar el próximo elemento en el mismo espacio
        const nextElement = getNextElementInSpace(
          data.items!,
          spaceId,
          elementId
        );

        if (nextElement) {
          // Redirigir al próximo elemento del mismo espacio
          router.push(
            `/audits/${auditId}/spaces/${nextElement.spaceId}/elements/${nextElement.elementId}`
          );
          return;
        }

        // 2. Si no hay más elementos en el espacio, buscar el próximo espacio
        if (data.audit.apartment?.spaces) {
          const spaces = data.audit.apartment.spaces.map((s) => ({
            id: s.id,
            name: s.name,
            spaceTypeId: s.spaceTypeId,
            order: s.order,
          }));
          const nextSpaceId = getNextSpace(spaces, spaceId);

          if (nextSpaceId) {
            // Redirigir al próximo espacio
            router.push(`/audits/${auditId}/spaces/${nextSpaceId}`);
            return;
          }
        }

        // 3. No hay más espacios, volver a la página principal de la auditoría
        router.push(`/audits/${auditId}`);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    allElementQuestionsAnswered,
    data?.items,
    data?.audit.apartment?.spaces,
    auditId,
    spaceId,
    elementId,
    router,
  ]);

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

  if (!data || !element) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No encontrado</AlertTitle>
          <AlertDescription>El elemento no se encontró.</AlertDescription>
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
          onClick={() => router.push(`/audits/${auditId}/spaces/${spaceId}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a elementos
        </Button>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{element.name}</h1>
            <p className="text-sm text-muted-foreground">
              {space?.name} • {element.elementType.name}
            </p>
          </div>
        </div>
      </div>

      {/* Carousel de preguntas */}
      {flattenedQuestions.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No hay preguntas</AlertTitle>
          <AlertDescription>
            No hay preguntas configuradas para este elemento.
          </AlertDescription>
        </Alert>
      ) : (
        <QuestionCarousel
          auditId={auditId}
          questions={flattenedQuestions}
          targetType="ELEMENT"
          targetName={element.name}
          onQuestionSuccess={handleQuestionSuccess}
        />
      )}
    </div>
  );
}
