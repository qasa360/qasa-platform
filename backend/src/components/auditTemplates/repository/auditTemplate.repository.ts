import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { AuditTemplateVersion } from "../models/AuditTemplateVersion";
import { AuditQuestionTemplate } from "../models/AuditQuestionTemplate";
import { AnswerOptionTemplate } from "../models/AnswerOptionTemplate";
import { IncidenceTemplate } from "../models/IncidenceTemplate";
import type {
  QuestionTargetType,
  AnswerType,
  QuestionCategory,
  ImpactLevel,
} from "../../audit/models/enums";
import type {
  SeverityLevel,
  NonConformityType,
  ResponsibleType,
} from "../../audit/models/AuditIncidence";
import type { IAuditTemplateRepository } from "./auditTemplate.repository.interface";

@injectable()
export class AuditTemplateRepository implements IAuditTemplateRepository {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    private readonly prisma: IPrismaCustomClient
  ) {}

  async getDefaultTemplateVersion(): Promise<AuditTemplateVersion | null> {
    const result = await this.prisma.client.auditTemplateVersion.findFirst({
      where: {
        is_default: true,
        valid_to: null,
      },
    });

    if (!result) {
      return null;
    }

    return this.mapToAuditTemplateVersion(result);
  }

  async getTemplateVersionById(
    id: number
  ): Promise<AuditTemplateVersion | null> {
    const result = await this.prisma.client.auditTemplateVersion.findUnique({
      where: { id },
    });

    if (!result) {
      return null;
    }

    return this.mapToAuditTemplateVersion(result);
  }

  async getQuestionsByTemplateVersion(
    templateVersionId: number
  ): Promise<AuditQuestionTemplate[]> {
    const result = await this.prisma.client.auditQuestionTemplate.findMany({
      where: {
        version_id: templateVersionId,
        is_active: true,
      },
      include: {
        options: {
          orderBy: {
            sort_order: "asc",
          },
        },
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    return result.map((q: unknown) =>
      this.mapToAuditQuestionTemplate(
        q as Parameters<typeof this.mapToAuditQuestionTemplate>[0]
      )
    );
  }

  async getAnswerOptionsByIds(ids: number[]): Promise<
    Array<{
      id: number;
      answerOptionTemplateId: number;
    }>
  > {
    const result = await this.prisma.client.auditAnswerOption.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        answer_option_template_id: true,
      },
    });

    return result.map((opt) => ({
      id: opt.id,
      answerOptionTemplateId: opt.answer_option_template_id,
    }));
  }

  async getAutoIncidenceRulesByAnswerOptionIds(
    answerOptionIds: number[]
  ): Promise<
    Array<{
      answerOptionId: number;
      incidenceTemplate: IncidenceTemplate;
    }>
  > {
    const result = await this.prisma.client.templateAutoIncidenceRule.findMany({
      where: {
        answer_option_id: { in: answerOptionIds },
      },
      include: {
        incidence_template: true,
      },
    });

    return result.map((rule) => ({
      answerOptionId: rule.answer_option_id,
      incidenceTemplate: this.mapToIncidenceTemplate(rule.incidence_template),
    }));
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
    const result =
      await this.prisma.client.answerOptionTemplateFollowup.findMany({
        where: {
          answer_option_id: { in: answerOptionIds },
        },
        include: {
          child_question: {
            include: {
              options: {
                orderBy: {
                  sort_order: "asc",
                },
              },
            },
          },
        },
        orderBy: {
          sort_order: "asc",
        },
      });

    return result.map((followup) => ({
      answerOptionId: followup.answer_option_id,
      childQuestion: this.mapToAuditQuestionTemplate(followup.child_question),
      sortOrder: followup.sort_order,
      required: followup.required,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToAuditTemplateVersion(result: any): AuditTemplateVersion {
    return new AuditTemplateVersion({
      id: result.id,
      code: result.code,
      name: result.name,
      description: result.description,
      version: result.version,
      validFrom: result.valid_from,
      validTo: result.valid_to,
      isDefault: result.is_default,
      createdBy: result.created_by,
      approvedBy: result.approved_by,
      approvedAt: result.approved_at,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      questions: result.questions?.map((q: unknown) =>
        this.mapToAuditQuestionTemplate(
          q as Parameters<typeof this.mapToAuditQuestionTemplate>[0]
        )
      ),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToAuditQuestionTemplate(result: any): AuditQuestionTemplate {
    return new AuditQuestionTemplate({
      id: result.id,
      versionId: result.version_id,
      targetType: result.target_type as QuestionTargetType,
      spaceTypeId: result.space_type_id,
      elementTypeId: result.element_type_id,
      questionText: result.question_text,
      answerType: result.answer_type as AnswerType,
      category: result.category as QuestionCategory,
      weight: result.weight,
      impact: result.impact as ImpactLevel,
      sortOrder: result.sort_order,
      isMandatory: result.is_mandatory,
      visibilityCondition: result.visibility_condition as Record<
        string,
        unknown
      > | null,
      tags: result.tags,
      reference: result.reference,
      notes: result.notes,
      isActive: result.is_active,
      createdBy: result.created_by,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      options: result.options?.map((opt: unknown) =>
        this.mapToAnswerOptionTemplate(
          opt as Parameters<typeof this.mapToAnswerOptionTemplate>[0]
        )
      ),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToAnswerOptionTemplate(result: any): AnswerOptionTemplate {
    return new AnswerOptionTemplate({
      id: result.id,
      questionId: result.question_id,
      code: result.code,
      label: result.label,
      sortOrder: result.sort_order,
      penaltyWeight: result.penalty_weight,
      createdBy: result.created_by,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToIncidenceTemplate(result: any): IncidenceTemplate {
    return new IncidenceTemplate({
      id: result.id,
      name: result.name,
      code: result.code,
      category: result.category as QuestionCategory,
      severity: result.severity as SeverityLevel,
      nonConformity: result.non_conformity as NonConformityType | null,
      responsible: result.responsible as ResponsibleType,
      description: result.description,
      actionsJson: result.actions_json as Record<string, unknown> | null,
      isActive: result.is_active,
      createdBy: result.created_by,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
}
