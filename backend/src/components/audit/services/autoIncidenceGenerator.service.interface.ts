import type { AuditIncidence } from "../models/AuditIncidence";

export interface IAutoIncidenceGeneratorService {
  generateIncidencesForResponse(data: {
    auditId: number;
    auditItemId: number;
    targetType: string;
    apartmentId?: number;
    spaceId?: number;
    elementId?: number;
    selectedOptionIds: number[];
    createdBy?: string;
  }): Promise<AuditIncidence[]>;
}
