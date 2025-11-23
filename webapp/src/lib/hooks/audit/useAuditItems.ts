/**
 * React Query Hook - Get Audit Items
 * Hook para obtener y refrescar items de auditoría
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../../services/audit.service';
import { QUERY_KEYS } from '@/lib/constants';
import type { AuditItem } from '@/types/audit.types';

export function useAuditItems(auditId: number) {
  return useQuery<AuditItem[]>({
    queryKey: [QUERY_KEYS.AUDITS, auditId, 'items'],
    queryFn: () => auditService.getAuditItems(auditId),
    staleTime: 1 * 60 * 1000, // 1 minuto (cambia frecuentemente al responder)
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para refrescar items manualmente
 * Útil después de responder preguntas para obtener follow-ups
 */
export function useRefreshAuditItems() {
  const queryClient = useQueryClient();

  return (auditId: number) => {
    return queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.AUDITS, auditId, 'items'],
    });
  };
}

