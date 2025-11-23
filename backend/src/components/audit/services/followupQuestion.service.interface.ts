import type { AuditItem } from "../models/AuditItem";
import type { QuestionTargetType } from "../models/enums";

export interface IFollowupQuestionService {
  generateFollowupQuestions(data: {
    auditId: number;
    parentAuditItemId: number;
    targetType: QuestionTargetType;
    apartmentId?: number;
    spaceId?: number;
    elementId?: number;
    selectedOptionIds: number[];
  }): Promise<AuditItem[]>;
}
