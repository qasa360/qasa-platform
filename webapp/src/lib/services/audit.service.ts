/**
 * Audit Service - Business Logic Layer
 * Orquesta llamadas API y transforma datos para la aplicación
 */

import { auditApi } from '../api/audit.api';
import type {
  Audit,
  AuditItem,
  SpaceProgress,
  ElementProgress,
} from '@/types/audit.types';

export const auditService = {
  /**
   * Iniciar auditoría
   */
  async startAudit(apartmentId: number, templateVersionId?: number): Promise<Audit> {
    return auditApi.startAudit({
      apartmentId,
      auditTemplateVersionId: templateVersionId,
    });
  },

  /**
   * Obtener auditoría completa con items
   */
  async getAuditWithItems(id: number): Promise<{ audit: Audit; items: AuditItem[] }> {
    const [audit, items] = await Promise.all([
      auditApi.getAuditById(id),
      auditApi.getAuditItems(id),
    ]);

    return { audit, items };
  },

  /**
   * Obtener solo items (útil para refrescar después de responder)
   */
  async getAuditItems(auditId: number): Promise<AuditItem[]> {
    return auditApi.getAuditItems(auditId);
  },

  /**
   * Responder pregunta y refrescar items para obtener follow-ups
   */
  async answerQuestion(
    auditId: number,
    data: Parameters<typeof auditApi.answerQuestion>[1]
  ): Promise<{ response: Awaited<ReturnType<typeof auditApi.answerQuestion>>; items: AuditItem[] }> {
    const response = await auditApi.answerQuestion(auditId, data);
    
    // Refrescar items para obtener follow-ups generados automáticamente
    const items = await auditApi.getAuditItems(auditId);

    return { response, items };
  },

  /**
   * Subir fotos
   */
  async uploadPhotos(
    auditId: number,
    files: File[],
    data: Parameters<typeof auditApi.uploadPhotos>[2]
  ): Promise<Awaited<ReturnType<typeof auditApi.uploadPhotos>>> {
    return auditApi.uploadPhotos(auditId, files, data);
  },

  /**
   * Completar auditoría
   */
  async completeAudit(auditId: number): Promise<Audit> {
    return auditApi.completeAudit(auditId);
  },
};

