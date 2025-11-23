/**
 * React Query Hook - Get Active Audit by Apartment
 * Hook para obtener la auditoría activa (IN_PROGRESS) de un apartamento
 */

import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../../api/audit.api';
import { QUERY_KEYS } from '@/lib/constants';
import type { Audit } from '@/types/audit.types';

export function useActiveAudit(apartmentId: number | null) {
  return useQuery<Audit | null>({
    queryKey: [QUERY_KEYS.AUDITS, 'active', apartmentId],
    queryFn: () => {
      if (!apartmentId) return null;
      return auditApi.getActiveAuditByApartment(apartmentId);
    },
    enabled: !!apartmentId,
    staleTime: 30 * 1000, // 30 seconds - active audits can change frequently
  });
}

