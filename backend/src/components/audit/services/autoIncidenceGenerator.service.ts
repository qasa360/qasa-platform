import { inject, injectable } from "inversify";
import { AUDIT_TYPES } from "../types";
import { AUDIT_TEMPLATE_TYPES } from "../../auditTemplates/types";
import type { QuestionTargetType } from "../models/enums";
import { AuditIncidence } from "../models/AuditIncidence";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IAuditTemplateService } from "../../auditTemplates/services/auditTemplate.service.interface";
import type { IAutoIncidenceGeneratorService } from "./autoIncidenceGenerator.service.interface";

@injectable()
export class AutoIncidenceGeneratorService
  implements IAutoIncidenceGeneratorService
{
  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(AUDIT_TEMPLATE_TYPES.IAuditTemplateService)
    private readonly templateService: IAuditTemplateService
  ) {}

  async generateIncidencesForResponse(data: {
    auditId: number;
    auditItemId: number;
    targetType: string;
    apartmentId?: number;
    spaceId?: number;
    elementId?: number;
    selectedOptionIds: number[];
    createdBy?: string;
  }): Promise<AuditIncidence[]> {
    // Get answer options
    const answerOptions = await this.templateService.getAnswerOptionsByIds(
      data.selectedOptionIds
    );

    // Get template answer options and their auto-incidence rules
    const templateOptionIds = answerOptions.map(
      (opt) => opt.answerOptionTemplateId
    );

    const autoIncidenceRules =
      await this.templateService.getAutoIncidenceRulesByAnswerOptionIds(
        templateOptionIds
      );

    // Create incidences for each rule
    const createdIncidences: AuditIncidence[] = [];

    for (const rule of autoIncidenceRules) {
      const incidenceTemplate = rule.incidenceTemplate;
      const incidence = AuditIncidence.createFromTemplate(incidenceTemplate, {
        auditId: data.auditId,
        auditItemId: data.auditItemId,
        targetType: data.targetType as QuestionTargetType,
        apartmentId: data.apartmentId,
        spaceId: data.spaceId,
        elementId: data.elementId,
        createdBy: data.createdBy,
      });

      const savedIncidence =
        await this.auditRepository.saveAuditIncidence(incidence);
      createdIncidences.push(savedIncidence);
    }

    return createdIncidences;
  }
}
