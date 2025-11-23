import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import { AUDIT_TYPES } from "../types";
import { STORAGE_TYPES } from "../../storage/types";
import type { AuditPhotoContext } from "../models/AuditPhoto";
import { AuditPhoto } from "../models/AuditPhoto";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IStorageService } from "../../storage/services/storage.service.interface";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Transactional } from "../../../infrastructure/prisma/TransactionalPrisma";
import type { IUploadPhotosService } from "./uploadPhotos.service.interface";

@injectable()
export class UploadPhotosService implements IUploadPhotosService {
  public prismaCustomClient: IPrismaCustomClient;

  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(STORAGE_TYPES.IStorageService)
    private readonly storageService: IStorageService,
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    prismaCustomClient: IPrismaCustomClient
  ) {
    this.prismaCustomClient = prismaCustomClient;
  }

  @Transactional
  async uploadPhotos(data: {
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
  }): Promise<AuditPhoto[]> {
    // Upload files to Cloudflare R2
    const folder = `audits/${data.auditId}`;
    const uploadedFiles = await this.storageService.uploadPhotos({
      files: data.files,
      folder,
    });

    // Create AuditPhoto entities with uploaded URLs
    const photoEntities = uploadedFiles.map(
      (uploadedFile) =>
        new AuditPhoto({
          id: null,
          uuid: null,
          auditId: data.auditId,
          context: data.context as AuditPhotoContext,
          url: uploadedFile.url,
          description: data.description,
          metadata: {
            ...data.metadata,
            originalName: uploadedFile.originalName,
            key: uploadedFile.key,
          },
          spaceId: data.spaceId,
          elementId: data.elementId,
          auditItemId: data.auditItemId,
          auditResponseId: data.auditResponseId,
          auditIncidenceId: data.auditIncidenceId,
          createdBy: data.createdBy,
          createdAt: null,
        })
    );

    return this.auditRepository.saveAuditPhotos(photoEntities);
  }
}
