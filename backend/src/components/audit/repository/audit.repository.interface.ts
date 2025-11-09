import type { Audit } from "../models/Audit";
import type { AuditItem } from "../models/AuditItem";
import type { AuditResponse } from "../models/AuditResponse";
import type { AuditIncidence } from "../models/AuditIncidence";
import type { AuditPhoto } from "../models/AuditPhoto";

export interface IAuditRepository {
  saveAudit(audit: Audit): Promise<Audit>;

  getAuditById(id: number): Promise<Audit | null>;

  getAuditByUuid(uuid: string): Promise<Audit | null>;

  getAuditItemsByAuditId(auditId: number): Promise<AuditItem[]>;

  updateAuditStatus(
    id: number,
    status: string,
    changedBy: string,
    reason?: string
  ): Promise<Audit>;

  saveAuditItems(items: AuditItem[]): Promise<AuditItem[]>;

  saveAuditResponse(response: AuditResponse): Promise<AuditResponse>;

  createAuditResponseOptions(
    auditResponseId: number,
    answerOptionIds: number[]
  ): Promise<void>;

  saveAuditIncidence(incidence: AuditIncidence): Promise<AuditIncidence>;

  saveAuditPhotos(photos: AuditPhoto[]): Promise<AuditPhoto[]>;

  updateAuditCompletionRate(
    auditId: number,
    completionRate: number
  ): Promise<void>;

  getAuditResponseById(id: number): Promise<AuditResponse | null>;

  getActiveAuditByApartmentId(apartmentId: number): Promise<Audit | null>;
}
