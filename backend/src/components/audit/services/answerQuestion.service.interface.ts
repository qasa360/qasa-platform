import type { AuditResponse } from "../models/AuditResponse";

export interface IAnswerQuestionService {
  answerQuestion(data: {
    auditId: number;
    auditItemId: number;
    booleanValue?: boolean;
    textValue?: string;
    numberValue?: number;
    selectedOptionIds?: number[];
    notes?: string;
    photos?: Array<{
      url: string;
      description?: string;
      metadata?: Record<string, unknown>;
    }>;
    createdBy?: string;
  }): Promise<AuditResponse>;
}
