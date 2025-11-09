import type { AuditTemplateVersion } from "../models/AuditTemplateVersion";
import type { AuditQuestionTemplate } from "../models/AuditQuestionTemplate";
import type { IncidenceTemplate } from "../models/IncidenceTemplate";

export interface IAuditTemplateRepository {
  getDefaultTemplateVersion(): Promise<AuditTemplateVersion | null>;

  getTemplateVersionById(id: number): Promise<AuditTemplateVersion | null>;

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
