import type { Audit } from "../models/Audit";

export interface ICompleteAuditService {
  completeAudit(data: { auditId: number; completedBy: string }): Promise<Audit>;
}
