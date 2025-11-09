/**
 * React Query Hook - Answer Question
 * Hook con optimistic updates para mejor UX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../../services/audit.service';
import { QUERY_KEYS } from '@/lib/constants';
import type { AnswerQuestionRequest, AuditItem } from '@/types/audit.types';

export function useAnswerQuestion(auditId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnswerQuestionRequest) =>
      auditService.answerQuestion(auditId, data),
    
    // Optimistic update: marcar como respondido inmediatamente
    onMutate: async (data) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.AUDITS, auditId, 'items'],
      });

      // Snapshot del estado anterior
      const previousItems = queryClient.getQueryData<AuditItem[]>([
        QUERY_KEYS.AUDITS,
        auditId,
        'items',
      ]);

      // Optimistic update
      if (previousItems) {
        queryClient.setQueryData<AuditItem[]>(
          [QUERY_KEYS.AUDITS, auditId, 'items'],
          (old) =>
            old?.map((item) =>
              item.id === data.auditItemId
                ? { ...item, isAnswered: true }
                : item
            ) || []
        );
      }

      return { previousItems };
    },

    // Si falla, revertir el optimistic update
    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          [QUERY_KEYS.AUDITS, auditId, 'items'],
          context.previousItems
        );
      }
    },

    // Si tiene éxito, refrescar items para obtener follow-ups
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUDITS, auditId, 'items'],
      });
      
      // También refrescar auditoría para actualizar completionRate
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUDITS, auditId],
      });
    },
  });
}

