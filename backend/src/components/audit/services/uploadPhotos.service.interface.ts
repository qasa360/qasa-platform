import type { AuditPhoto } from "../models/AuditPhoto";

export interface IUploadPhotosService {
  uploadPhotos(data: {
    auditId: number;
    files: Array<{
      buffer: Buffer;
      originalName: string;
      mimetype: string;
    }>;
    context: string;
    description?: string;
    metadata?: Record<string, unknown>;
    spaceId?: number;
    elementId?: number;
    auditItemId?: number;
    auditResponseId?: number;
    auditIncidenceId?: number;
    createdBy?: string;
  }): Promise<AuditPhoto[]>;
}
