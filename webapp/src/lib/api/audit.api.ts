/**
 * API Client - Audit Endpoints
 * Capa de infraestructura: comunicación HTTP con backend
 */

import { api } from '../api';
import type {
  Audit,
  AuditItem,
  AuditResponse,
  AuditPhoto,
  StartAuditRequest,
  AnswerQuestionRequest,
  UploadPhotosRequest,
} from '@/types/audit.types';

const BASE_PATH = '/audits';

export const auditApi = {
  /**
   * Obtener auditoría activa (IN_PROGRESS) por apartamento
   */
  async getActiveAuditByApartment(apartmentId: number): Promise<Audit | null> {
    return api.get<Audit | null>(`${BASE_PATH}?apartmentId=${apartmentId}`);
  },

  /**
   * Iniciar una nueva auditoría
   */
  async startAudit(data: StartAuditRequest): Promise<Audit> {
    return api.post<Audit>(BASE_PATH, data);
  },

  /**
   * Obtener auditoría por ID
   */
  async getAuditById(id: number): Promise<Audit> {
    return api.get<Audit>(`${BASE_PATH}/${id}`);
  },

  /**
   * Obtener auditoría por UUID
   */
  async getAuditByUuid(uuid: string): Promise<Audit> {
    return api.get<Audit>(`${BASE_PATH}/uuid/${uuid}`);
  },

  /**
   * Obtener todos los items (preguntas) de una auditoría
   */
  async getAuditItems(auditId: number): Promise<AuditItem[]> {
    return api.get<AuditItem[]>(`${BASE_PATH}/${auditId}/items`);
  },

  /**
   * Responder una pregunta
   */
  async answerQuestion(
    auditId: number,
    data: AnswerQuestionRequest
  ): Promise<AuditResponse> {
    return api.post<AuditResponse>(`${BASE_PATH}/${auditId}/answer`, data);
  },

  /**
   * Subir fotos (multipart/form-data)
   */
  async uploadPhotos(
    auditId: number,
    files: File[],
    data: UploadPhotosRequest
  ): Promise<AuditPhoto[]> {
    const formData = new FormData();

    // Agregar archivos
    files.forEach((file) => {
      formData.append('photos', file);
    });

    // Agregar metadata
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // Usar fetch directamente para multipart/form-data
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('qasa-auth-token') 
      : null;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${BASE_PATH}/${auditId}/photos`, {
      method: 'POST',
      headers: {
        // No incluir Content-Type, el browser lo hace automáticamente con boundary
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Completar auditoría
   */
  async completeAudit(auditId: number): Promise<Audit> {
    return api.put<Audit>(`${BASE_PATH}/${auditId}/complete`);
  },
};

