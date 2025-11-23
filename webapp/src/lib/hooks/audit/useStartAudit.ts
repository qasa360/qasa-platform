/**
 * React Query Hook - Start Audit
 * Hook para iniciar una nueva auditoría con redirección automática
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { auditService } from '../../services/audit.service';
import { useToast } from '../use-toast';
import { QUERY_KEYS } from '@/lib/constants';
import type { Audit } from '@/types/audit.types';

export function useStartAudit() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: { apartmentId: number; templateVersionId?: number }) =>
      auditService.startAudit(data.apartmentId, data.templateVersionId),

    onSuccess: (audit: Audit) => {
      // Mostrar notificación de éxito
      toast({
        title: 'Auditoría iniciada',
        description: 'La auditoría se ha creado correctamente',
        variant: 'default',
      });

      // Redirigir a la página de auditoría después de crearla
      router.push(`/audits/${audit.id}`);
    },

    onError: (error: any) => {
      console.error('Error al iniciar auditoría:', error);

      // Manejar error 409 - Auditoría ya en progreso
      if (
        error?.status === 409 ||
        error?.data?.name === 'AuditAlreadyInProgressError' ||
        error?.data?.httpCode === 409
      ) {
        const auditId = error?.data?.auditId;
        if (auditId) {
          // Redirigir a la auditoría existente
          toast({
            title: 'Auditoría en curso',
            description: 'Ya existe una auditoría en progreso. Redirigiendo...',
            variant: 'default',
          });
          router.push(`/audits/${auditId}`);
          return;
        }
      }

      // El error puede ser ApiError con estructura { message, status, data }
      // o puede tener data.message del backend
      let errorMessage = 'Error al iniciar auditoría. Intenta nuevamente.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Mensaje específico para template faltante
      if (
        errorMessage.includes('No default audit template') ||
        errorMessage.includes('NoDefaultTemplateError')
      ) {
        errorMessage =
          'No hay template de auditoría configurado. Contacta al administrador.';
      }

      // Mostrar notificación de error
      toast({
        title: 'Error al iniciar auditoría',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}
