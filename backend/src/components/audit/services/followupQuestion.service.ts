import { inject, injectable } from "inversify";
import { AUDIT_TYPES } from "../types";
import { AUDIT_TEMPLATE_TYPES } from "../../auditTemplates/types";
import { AuditItem } from "../models/AuditItem";
import type { QuestionTargetType } from "../models/enums";
import type { IAuditRepository } from "../repository/audit.repository.interface";
import type { IAuditTemplateService } from "../../auditTemplates/services/auditTemplate.service.interface";
import type { IFollowupQuestionService } from "./followupQuestion.service.interface";

@injectable()
export class FollowupQuestionService implements IFollowupQuestionService {
  constructor(
    @inject(AUDIT_TYPES.IAuditRepository)
    private readonly auditRepository: IAuditRepository,
    @inject(AUDIT_TEMPLATE_TYPES.IAuditTemplateService)
    private readonly templateService: IAuditTemplateService
  ) {}

  async generateFollowupQuestions(data: {
    auditId: number;
    parentAuditItemId: number;
    targetType: QuestionTargetType;
    apartmentId?: number;
    spaceId?: number;
    elementId?: number;
    selectedOptionIds: number[];
  }): Promise<AuditItem[]> {
    // Get answer options to find their template IDs
    const answerOptions = await this.templateService.getAnswerOptionsByIds(
      data.selectedOptionIds
    );

    // Get template answer option IDs
    const templateOptionIds = answerOptions.map(
      (opt) => opt.answerOptionTemplateId
    );

    if (templateOptionIds.length === 0) {
      return [];
    }

    // Get follow-up questions from template
    const followupRules =
      await this.templateService.getFollowupQuestionsByAnswerOptionIds(
        templateOptionIds
      );

    if (followupRules.length === 0) {
      return [];
    }

    // Get existing audit items to avoid duplicates
    const existingItems = await this.auditRepository.getAuditItemsByAuditId(
      data.auditId
    );
    const existingQuestionTemplateIds = new Set(
      existingItems
        .filter((item) => item.parentAuditItemId === data.parentAuditItemId)
        .map((item) => item.questionTemplateId)
    );

    // Create AuditItem entities for each follow-up question
    const followupItems: AuditItem[] = [];

    for (const rule of followupRules) {
      // Skip if follow-up question already exists
      if (existingQuestionTemplateIds.has(rule.childQuestion.id)) {
        continue;
      }

      const followupItem = new AuditItem({
        id: null,
        uuid: null,
        auditId: data.auditId,
        questionTemplateId: rule.childQuestion.id,
        targetType: rule.childQuestion.targetType,
        apartmentId: data.apartmentId,
        spaceId: data.spaceId,
        elementId: data.elementId,
        questionText: rule.childQuestion.questionText,
        answerType: rule.childQuestion.answerType,
        category: rule.childQuestion.category,
        weight: rule.childQuestion.weight ?? undefined,
        impact: rule.childQuestion.impact,
        isMandatory: rule.required || rule.childQuestion.isMandatory,
        sortOrder: rule.sortOrder ?? undefined,
        isAnswered: false,
        isVisible: true,
        completionRate: 0,
        parentAuditItemId: data.parentAuditItemId,
        startedAt: undefined,
        completedAt: undefined,
        createdAt: null,
        updatedAt: null,
      });

      followupItems.push(followupItem);
    }

    // Save follow-up items if any
    if (followupItems.length > 0) {
      await this.auditRepository.saveAuditItems(followupItems);
    }

    return followupItems;
  }
}
