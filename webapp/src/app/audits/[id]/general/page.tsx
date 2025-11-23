'use client';

import { useMemo } from 'react';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuditWithItems } from '@/lib/hooks/audit';
import {
  getGeneralQuestions,
  getFollowupQuestions,
  getNextSpaceAndElement,
} from '@/lib/utils/audit.utils';
import { QuestionCarousel } from '@/components/audit/QuestionCarousel';
import { AuditSkeleton } from '@/components/audit/AuditSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRefreshAuditItems } from '@/lib/hooks/audit';
import type { AuditItem } from '@/types/audit.types';

/**
 * Página de Preguntas Generales - Mobile First
 * Muestra todas las preguntas generales (nivel apartamento) con sus follow-ups
 */
export default function GeneralQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = parseInt(params.id as string);

  const { data, isLoading, error } = useAuditWithItems(auditId);
  const refreshItems = useRefreshAuditItems();

  // Obtener preguntas generales ordenadas
  const generalQuestions = useMemo(() => {
    if (!data?.items) return [];
    return getGeneralQuestions(data.items);
  }, [data?.items]);

  // Aplanar preguntas con sus follow-ups en una lista secuencial para el carousel
  // Las follow-ups solo se incluyen si la pregunta principal está respondida
  const flattenedQuestions = useMemo(() => {
    if (!data?.items || generalQuestions.length === 0) return [];

    const flatList: AuditItem[] = [];

    generalQuestions.forEach((question) => {
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
  }, [data?.items, generalQuestions]);

  const handleQuestionSuccess = () => {
    // Refrescar items para obtener follow-ups y actualizar estado
    refreshItems(auditId);
  };

  // Verificar si todas las preguntas generales están completadas después de actualizar
  const allGeneralQuestionsAnswered = useMemo(() => {
    return (
      generalQuestions.length > 0 && generalQuestions.every((q) => q.isAnswered)
    );
  }, [generalQuestions]);

  // Efecto para redirigir cuando se completen todas las preguntas generales
  React.useEffect(() => {
    if (
      allGeneralQuestionsAnswered &&
      data?.items &&
      data.audit.apartment?.spaces
    ) {
      const next = getNextSpaceAndElement(
        data.items,
        data.audit.apartment.spaces.map((s) => ({
          id: s.id,
          name: s.name,
          spaceTypeId: s.spaceTypeId,
          order: s.order,
        }))
      );

      if (next) {
        // Redirigir al primer elemento del próximo espacio
        router.push(
          `/audits/${auditId}/spaces/${next.spaceId}/elements/${next.elementId}`
        );
      }
    }
  }, [
    allGeneralQuestionsAnswered,
    data?.items,
    data?.audit.apartment?.spaces,
    auditId,
    router,
  ]);

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
          <AlertTitle>Error al cargar preguntas</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'No se pudieron cargar las preguntas. Por favor, intenta nuevamente.'}
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

  const { audit } = data;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      {/* Header con botón de volver */}
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
        <h1 className="text-2xl font-bold">Preguntas Generales</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Responde las preguntas sobre el apartamento en general
        </p>
      </div>

      {/* Carousel de preguntas */}
      {flattenedQuestions.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No hay preguntas generales</AlertTitle>
          <AlertDescription>
            No hay preguntas generales configuradas para esta auditoría.
          </AlertDescription>
        </Alert>
      ) : (
        <QuestionCarousel
          auditId={auditId}
          questions={flattenedQuestions}
          targetType="APARTMENT"
          targetName={audit.apartment?.name}
          onQuestionSuccess={handleQuestionSuccess}
        />
      )}
    </div>
  );
}
