import type { Audit } from "../models/Audit";

export interface IInitAuditService {
  startAudit(data: {
    apartmentId: number;
    auditTemplateVersionId?: number;
    createdBy?: string;
  }): Promise<Audit>;
}
