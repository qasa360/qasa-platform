import { inject, injectable } from "inversify";
import { AUDIT_TYPES } from "../types";
import type { Audit } from "../models/Audit";
import type { AuditItem } from "../models/AuditItem";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IGetAuditService } from "./getAudit.service.interface";

@injectable()
export class GetAuditService implements IGetAuditService {
  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository
  ) {}

  async getAuditById(id: number): Promise<Audit | null> {
    return this.auditRepository.getAuditById(id);
  }

  async getAuditByUuid(uuid: string): Promise<Audit | null> {
    return this.auditRepository.getAuditByUuid(uuid);
  }

  async getAuditItems(auditId: number): Promise<AuditItem[]> {
    return this.auditRepository.getAuditItemsByAuditId(auditId);
  }

  async getActiveAuditByApartmentId(apartmentId: number): Promise<Audit | null> {
    return this.auditRepository.getActiveAuditByApartmentId(apartmentId);
  }
}
