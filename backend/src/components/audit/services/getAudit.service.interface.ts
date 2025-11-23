import type { Audit } from "../models/Audit";
import type { AuditItem } from "../models/AuditItem";

export interface IGetAuditService {
  getAuditById(id: number): Promise<Audit | null>;

  getAuditByUuid(uuid: string): Promise<Audit | null>;

  getAuditItems(auditId: number): Promise<AuditItem[]>;

  getActiveAuditByApartmentId(apartmentId: number): Promise<Audit | null>;
}
