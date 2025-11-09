import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import { AppError } from "../../../core/errors/AppError";
import { AUDIT_TYPES } from "../types";
import { AuditStatus } from "../models/AuditStatus";
import type { Audit } from "../models/Audit";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Transactional } from "../../../infrastructure/prisma/TransactionalPrisma";
import type { ICompleteAuditService } from "./completeAudit.service.interface";

@injectable()
export class CompleteAuditService implements ICompleteAuditService {
  public prismaCustomClient: IPrismaCustomClient;

  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    prismaCustomClient: IPrismaCustomClient
  ) {
    this.prismaCustomClient = prismaCustomClient;
  }

  @Transactional
  async completeAudit(data: {
    auditId: number;
    completedBy: string;
  }): Promise<Audit> {
    const audit = await this.auditRepository.getAuditById(data.auditId);
    if (!audit) {
      throw new AppError({
        origin: "CompleteAuditService",
        name: "AuditNotFoundError",
        message: `Audit with id ${data.auditId} not found`,
        httpCode: 404,
      });
    }

    if (!audit.canComplete()) {
      throw new AppError({
        origin: "CompleteAuditService",
        name: "InvalidAuditStatusError",
        message: `Cannot complete audit in status ${audit.status}`,
        httpCode: 400,
      });
    }

    // Verify all mandatory questions are answered
    const items = await this.auditRepository.getAuditItemsByAuditId(
      data.auditId
    );
    const unansweredMandatory = items.filter(
      (i) => i.isMandatory && !i.isAnswered
    );

    if (unansweredMandatory.length > 0) {
      throw new AppError({
        origin: "CompleteAuditService",
        name: "IncompleteAuditError",
        message: `Cannot complete audit: ${unansweredMandatory.length} mandatory questions are unanswered`,
        httpCode: 400,
      });
    }

    // Update completion rate to 100%
    await this.auditRepository.updateAuditCompletionRate(data.auditId, 100);

    // Change status to COMPLETED
    return this.auditRepository.updateAuditStatus(
      data.auditId,
      AuditStatus.COMPLETED,
      data.completedBy
    );
  }
}
