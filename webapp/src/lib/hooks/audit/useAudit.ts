/**
 * React Query Hook - Get Audit
 * Hook optimizado con cache y refetch automático
 */

import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../../api/audit.api';
import { auditService } from '../../services/audit.service';
import { QUERY_KEYS } from '@/lib/constants';
import type { Audit } from '@/types/audit.types';

export function useAudit(id: number) {
  return useQuery<Audit>({
    queryKey: [QUERY_KEYS.AUDITS, id],
    queryFn: () => auditApi.getAuditById(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
  });
}

export function useAuditWithItems(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.AUDITS, id, 'with-items'],
    queryFn: () => auditService.getAuditWithItems(id),
    staleTime: 2 * 60 * 1000, // 2 minutos (más corto porque cambia frecuentemente)
    gcTime: 5 * 60 * 1000,
  });
}

