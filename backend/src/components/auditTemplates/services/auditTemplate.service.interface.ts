import type { AuditTemplateVersion } from "../models/AuditTemplateVersion";
import type { AuditQuestionTemplate } from "../models/AuditQuestionTemplate";
import type { IncidenceTemplate } from "../models/IncidenceTemplate";

export interface IAuditTemplateService {
  getDefaultTemplateVersion(): Promise<AuditTemplateVersion>;

  getTemplateVersionById(id: number): Promise<AuditTemplateVersion>;

  getQuestionsByTemplateVersion(
    templateVersionId: number
  ): Promise<AuditQuestionTemplate[]>;

  getAnswerOptionsByIds(ids: number[]): Promise<
    Array<{
      id: number;
      answerOptionTemplateId: number;
    }>
  >;

  getAutoIncidenceRulesByAnswerOptionIds(answerOptionIds: number[]): Promise<
    Array<{
      answerOptionId: number;
      incidenceTemplate: IncidenceTemplate;
    }>
  >;

  getFollowupQuestionsByAnswerOptionIds(answerOptionIds: number[]): Promise<
    Array<{
      answerOptionId: number;
      childQuestion: AuditQuestionTemplate;
      sortOrder: number | null;
      required: boolean;
    }>
  >;
}
