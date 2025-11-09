import { inject, injectable } from "inversify";
import { AppError } from "../../../core/errors/AppError";
import { AUDIT_TEMPLATE_TYPES } from "../types";
import type { AuditTemplateVersion } from "../models/AuditTemplateVersion";
import type { AuditQuestionTemplate } from "../models/AuditQuestionTemplate";
import type { IncidenceTemplate } from "../models/IncidenceTemplate";
import type { IAuditTemplateRepository } from "../repository/auditTemplate.repository.interface";
import type { IAuditTemplateService } from "./auditTemplate.service.interface";

@injectable()
export class AuditTemplateService implements IAuditTemplateService {
  constructor(
    @inject(AUDIT_TEMPLATE_TYPES.IAuditTemplateRepository)
    private readonly templateRepository: IAuditTemplateRepository
  ) {}

  async getDefaultTemplateVersion(): Promise<AuditTemplateVersion> {
    const template = await this.templateRepository.getDefaultTemplateVersion();

    if (!template) {
      throw new AppError({
        origin: "AuditTemplateService",
        name: "NoDefaultTemplateError",
        message: "No default audit template version found",
        httpCode: 404,
      });
    }

    return template;
  }

  async getTemplateVersionById(id: number): Promise<AuditTemplateVersion> {
    const template = await this.templateRepository.getTemplateVersionById(id);

    if (!template) {
      throw new AppError({
        origin: "AuditTemplateService",
        name: "TemplateNotFoundError",
        message: `Template version with id ${id} not found`,
        httpCode: 404,
      });
    }

    return template;
  }

  async getQuestionsByTemplateVersion(
    templateVersionId: number
  ): Promise<AuditQuestionTemplate[]> {
    // Verify template exists
    await this.getTemplateVersionById(templateVersionId);

    return this.templateRepository.getQuestionsByTemplateVersion(
      templateVersionId
    );
  }

  async getAnswerOptionsByIds(ids: number[]): Promise<
    Array<{
      id: number;
      answerOptionTemplateId: number;
    }>
  > {
    return this.templateRepository.getAnswerOptionsByIds(ids);
  }

  async getAutoIncidenceRulesByAnswerOptionIds(
    answerOptionIds: number[]
  ): Promise<
    Array<{
      answerOptionId: number;
      incidenceTemplate: IncidenceTemplate;
    }>
  > {
    return this.templateRepository.getAutoIncidenceRulesByAnswerOptionIds(
      answerOptionIds
    );
  }

  async getFollowupQuestionsByAnswerOptionIds(
    answerOptionIds: number[]
  ): Promise<
    Array<{
      answerOptionId: number;
      childQuestion: AuditQuestionTemplate;
      sortOrder: number | null;
      required: boolean;
    }>
  > {
    return this.templateRepository.getFollowupQuestionsByAnswerOptionIds(
      answerOptionIds
    );
  }
}
