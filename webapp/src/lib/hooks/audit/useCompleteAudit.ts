/**
 * React Query Hook - Complete Audit
 * Hook para finalizar una auditoría
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../../services/audit.service';
import { QUERY_KEYS } from '@/lib/constants';
import { useToast } from '@/lib/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Audit } from '@/types/audit.types';

export function useCompleteAudit(auditId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: () => auditService.completeAudit(auditId),

    onSuccess: (completedAudit: Audit) => {
      // Obtener el apartmentId de la auditoría completada
      const apartmentId = completedAudit.apartmentId;

      // Invalidar todas las queries relacionadas con esta auditoría para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AUDITS, auditId],
      });

      // Mostrar toast de éxito
      toast({
        title: 'Auditoría completada',
        description: 'La auditoría se ha finalizado correctamente.',
        variant: 'default',
      });

      // Redirigir a la vista del apartamento
      if (apartmentId) {
        router.push(`/apartments/${apartmentId}`);
      }
    },

    onError: (error: any) => {
      toast({
        title: 'Error al completar auditoría',
        description:
          error.message ||
          'No se pudo completar la auditoría. Por favor, intenta nuevamente.',
        variant: 'destructive',
      });
    },
  });
}

