import { inject, injectable } from "inversify";
import type { Prisma } from "@prisma/client";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Audit } from "../models/Audit";
import { AuditStatus } from "../models/AuditStatus";
import { AuditItem } from "../models/AuditItem";
import { AuditResponse } from "../models/AuditResponse";
import { AuditIncidence } from "../models/AuditIncidence";
import type { IncidenceStatus } from "../models/IncidenceStatus";
import { AuditPhoto } from "../models/AuditPhoto";
import type { AuditPhotoContext } from "../models/AuditPhoto";
import { AuditAnswerOption } from "../models/AuditAnswerOption";
import { AuditResponseOption } from "../models/AuditResponseOption";
import { AuditStatusHistory } from "../models/AuditStatusHistory";
import type {
  QuestionTargetType,
  AnswerType,
  QuestionCategory,
  ImpactLevel,
} from "../models/enums";
import type {
  SeverityLevel as SeverityLevelEnum,
  NonConformityType as NonConformityTypeEnum,
  ResponsibleType as ResponsibleTypeEnum,
} from "../models/AuditIncidence";
import type { IAuditRepository } from "./audit.repository.interface";

// Type definitions for Prisma query results
type AuditWithRelations = Prisma.AuditGetPayload<{
  include: {
    items: {
      include: {
        answers: {
          include: {
            selected_options: {
              include: {
                audit_answer_option: true;
              };
            };
            photos: true;
          };
        };
        options: true;
        photos: true;
        incidences: true;
      };
    };
    incidences: {
      include: {
        photos: true;
      };
    };
    photos: true;
    history: true;
  };
}>;

type AuditItemWithRelations = Prisma.AuditItemGetPayload<{
  include: {
    answers: {
      include: {
        selected_options: {
          include: {
            audit_answer_option: true;
          };
        };
        photos: true;
      };
    };
    options: true;
    photos: true;
    incidences: true;
  };
}>;

type AuditResponseWithRelations = Prisma.AuditResponseGetPayload<{
  include: {
    selected_options: {
      include: {
        audit_answer_option: true;
      };
    };
    photos: true;
  };
}>;

type AuditPhotoResult = Prisma.AuditPhotoGetPayload<Record<string, never>>;

type AuditAnswerOptionResult = Prisma.AuditAnswerOptionGetPayload<
  Record<string, never>
>;

type AuditIncidenceWithRelations = Prisma.AuditIncidenceGetPayload<{
  include: {
    photos: true;
  };
}>;

@injectable()
export class AuditRepository implements IAuditRepository {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    private readonly prisma: IPrismaCustomClient
  ) {}

  // NOTE: Prisma types need to be generated after adding new models to schema.prisma
  // Run: npx prisma generate
  // The following models are used: audit, auditItem, auditResponse, auditIncidence, auditPhoto, auditStatusHistory, auditAnswerOption, auditResponseOption

  async saveAudit(audit: Audit): Promise<Audit> {
    if (audit.id !== null) {
      throw new Error(
        "Cannot update audit through saveAudit. Use updateAuditStatus instead."
      );
    }

    const result = await this.prisma.client.audit.create({
      data: {
        apartment_id: audit.apartmentId,
        audit_template_version_id: audit.auditTemplateVersionId,
        status: audit.status,
        completion_rate: audit.completionRate,
        created_by: audit.createdBy,
      },
    });

    return this.mapToAudit(result);
  }

  async getAuditById(id: number): Promise<Audit | null> {
    const result = await this.prisma.client.audit.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            answers: {
              include: {
                selected_options: {
                  include: {
                    audit_answer_option: true,
                  },
                },
                photos: true,
              },
            },
            options: true,
            photos: true,
            incidences: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
        incidences: {
          include: {
            photos: true,
          },
        },
        photos: true,
        history: {
          orderBy: {
            changed_at: "desc",
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return this.mapToAudit(result);
  }

  async getAuditByUuid(uuid: string): Promise<Audit | null> {
    const result = await this.prisma.client.audit.findUnique({
      where: { uuid },
      include: {
        items: {
          include: {
            answers: {
              include: {
                selected_options: {
                  include: {
                    audit_answer_option: true,
                  },
                },
                photos: true,
              },
            },
            options: true,
            photos: true,
            incidences: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
        incidences: {
          include: {
            photos: true,
          },
        },
        photos: true,
        history: {
          orderBy: {
            changed_at: "desc",
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return this.mapToAudit(result);
  }

  async getAuditItemsByAuditId(auditId: number): Promise<AuditItem[]> {
    const result = await this.prisma.client.auditItem.findMany({
      where: { audit_id: auditId },
      include: {
        answers: {
          include: {
            selected_options: {
              include: {
                audit_answer_option: true,
              },
            },
            photos: true,
          },
        },
        options: true,
        photos: true,
        incidences: true,
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    return result.map((item) => this.mapToAuditItem(item));
  }

  async updateAuditStatus(
    id: number,
    status: string,
    changedBy: string,
    reason?: string
  ): Promise<Audit> {
    const audit = await this.prisma.client.audit.findUnique({
      where: { id },
    });

    if (!audit) {
      throw new Error(`Audit with id ${id} not found`);
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date(),
    };

    if (status === AuditStatus.IN_PROGRESS && !audit.started_at) {
      updateData.started_at = new Date();
    }

    if (status === AuditStatus.COMPLETED) {
      updateData.completed_at = new Date();
    }

    // Execute operations directly - transaction is handled by @Transactional decorator
    const updatedAudit = await this.prisma.client.audit.update({
      where: { id },
      data: updateData,
    });

    await this.prisma.client.auditStatusHistory.create({
      data: {
        audit_id: id,
        from_status: audit.status as AuditStatus | null,
        to_status: status as AuditStatus,
        changed_by: changedBy,
        reason,
      },
    });

    return this.mapToAudit(updatedAudit);
  }

  async saveAuditItems(items: AuditItem[]): Promise<AuditItem[]> {
    // Validate all items are new (id === null)
    for (const item of items) {
      if (item.id !== null) {
        throw new Error(
          "Cannot update audit items through saveAuditItems. All items must be new (id === null)."
        );
      }
    }

    // Get all question templates with their options first (batch query)
    const questionTemplateIds = [
      ...new Set(items.map((item) => item.questionTemplateId)),
    ];
    const questionTemplates =
      await this.prisma.client.auditQuestionTemplate.findMany({
        where: {
          id: { in: questionTemplateIds },
        },
        include: {
          options: {
            orderBy: {
              sort_order: "asc",
            },
          },
        },
      });

    const templateMap = new Map(questionTemplates.map((t) => [t.id, t]));

    // Execute operations directly - transaction is handled by @Transactional decorator
    const client = this.prisma.client;

    const created = await client.auditItem.createManyAndReturn({
      data: items.map((item) => ({
        audit_id: item.auditId,
        question_template_id: item.questionTemplateId,
        target_type: item.targetType,
        apartment_id: item.apartmentId,
        space_id: item.spaceId,
        element_id: item.elementId,
        question_text: item.questionText,
        answer_type: item.answerType,
        category: item.category,
        weight: item.weight,
        impact: item.impact,
        is_mandatory: item.isMandatory,
        sort_order: item.sortOrder,
        parent_audit_item_id: item.parentAuditItemId,
        is_answered: item.isAnswered,
        is_visible: item.isVisible,
        completion_rate: item.completionRate,
      })),
    });

    // Create answer options in batch (optimized: O(n) instead of O(n²))
    const answerOptionsToCreate: Array<{
      audit_item_id: number;
      answer_option_template_id: number;
      code: string;
      label: string;
      sort_order: number | null;
      penalty_weight: number | null;
    }> = [];

    for (const createdItem of created) {
      const questionTemplate = templateMap.get(
        createdItem.question_template_id
      );
      if (questionTemplate?.options) {
        for (const option of questionTemplate.options) {
          answerOptionsToCreate.push({
            audit_item_id: createdItem.id,
            answer_option_template_id: option.id,
            code: option.code,
            label: option.label,
            sort_order: option.sort_order,
            penalty_weight: option.penalty_weight,
          });
        }
      }
    }

    if (answerOptionsToCreate.length > 0) {
      await client.auditAnswerOption.createMany({
        data: answerOptionsToCreate,
      });
    }

    // Return created items without extra query - map directly from created items
    const itemsWithOptions = await client.auditItem.findMany({
      where: { audit_id: items[0]?.auditId ?? 0 },
      include: {
        options: true,
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    return itemsWithOptions.map((item) => this.mapToAuditItem(item));
  }

  async saveAuditResponse(response: AuditResponse): Promise<AuditResponse> {
    if (response.id !== null) {
      throw new Error(
        "Cannot update audit response through saveAuditResponse. Response must be new (id === null)."
      );
    }

    // Execute operations directly - transaction is handled by @Transactional decorator
    const client = this.prisma.client;

    const result = await client.auditResponse.create({
      data: {
        audit_item_id: response.auditItemId,
        boolean_value: response.booleanValue,
        text_value: response.textValue,
        number_value: response.numberValue,
        notes: response.notes,
        started_at: response.startedAt,
        completed_at: response.completedAt,
      },
    });

    // Update audit item as answered (atomic with response creation)
    await client.auditItem.update({
      where: { id: response.auditItemId },
      data: {
        is_answered: true,
        started_at: response.startedAt ?? new Date(),
        completed_at: response.completedAt ?? new Date(),
      },
    });

    return this.mapToAuditResponse(result);
  }

  async createAuditResponseOptions(
    auditResponseId: number,
    answerOptionIds: number[]
  ): Promise<void> {
    await this.prisma.client.auditResponseOption.createMany({
      data: answerOptionIds.map((optionId) => ({
        audit_response_id: auditResponseId,
        audit_answer_option_id: optionId,
      })),
    });
  }

  async saveAuditIncidence(incidence: AuditIncidence): Promise<AuditIncidence> {
    if (incidence.id !== null) {
      throw new Error(
        "Cannot update audit incidence through saveAuditIncidence. Incidence must be new (id === null)."
      );
    }

    const result = await this.prisma.client.auditIncidence.create({
      data: {
        audit_id: incidence.auditId,
        audit_item_id: incidence.auditItemId,
        incidence_template_id: incidence.incidenceTemplateId,
        target_type: incidence.targetType,
        apartment_id: incidence.apartmentId,
        space_id: incidence.spaceId,
        element_id: incidence.elementId,
        name: incidence.name,
        code: incidence.code,
        category: incidence.category as QuestionCategory,
        severity: incidence.severity as SeverityLevelEnum,
        non_conformity: incidence.nonConformity as NonConformityTypeEnum | null,
        responsible: incidence.responsible as ResponsibleTypeEnum,
        description: incidence.description,
        actions_json: incidence.actionsJson as
          | Prisma.InputJsonValue
          | undefined,
        status: incidence.status,
        created_by: incidence.createdBy,
      },
    });

    return this.mapToAuditIncidence(result);
  }

  async saveAuditPhotos(photos: AuditPhoto[]): Promise<AuditPhoto[]> {
    // Validate all photos are new (id === null)
    for (const photo of photos) {
      if (photo.id !== null) {
        throw new Error(
          "Cannot update audit photos through saveAuditPhotos. All photos must be new (id === null)."
        );
      }
    }

    const created = await this.prisma.client.auditPhoto.createManyAndReturn({
      data: photos.map((photo) => ({
        audit_id: photo.auditId,
        context: photo.context,
        url: photo.url,
        description: photo.description,
        metadata: photo.metadata as Prisma.InputJsonValue | undefined,
        space_id: photo.spaceId,
        element_id: photo.elementId,
        audit_item_id: photo.auditItemId,
        audit_response_id: photo.auditResponseId,
        audit_incidence_id: photo.auditIncidenceId,
        created_by: photo.createdBy,
      })),
    });

    return created.map((photo) => this.mapToAuditPhoto(photo));
  }

  async updateAuditCompletionRate(
    auditId: number,
    completionRate: number
  ): Promise<void> {
    await this.prisma.client.audit.update({
      where: { id: auditId },
      data: { completion_rate: completionRate },
    });
  }

  async getAuditResponseById(id: number): Promise<AuditResponse | null> {
    const result = await this.prisma.client.auditResponse.findUnique({
      where: { id },
      include: {
        selected_options: {
          include: {
            audit_answer_option: true,
          },
        },
        photos: true,
      },
    });

    if (!result) {
      return null;
    }

    return this.mapToAuditResponse(result);
  }

  private mapToAudit(
    result: AuditWithRelations | Prisma.AuditGetPayload<Record<string, never>>
  ): Audit {
    return new Audit({
      id: result.id,
      uuid: result.uuid,
      apartmentId: result.apartment_id,
      auditTemplateVersionId: result.audit_template_version_id,
      status: result.status as AuditStatus,
      completionRate: result.completion_rate,
      score: result.score ?? undefined,
      startedAt: result.started_at ?? undefined,
      completedAt: result.completed_at ?? undefined,
      cancelledAt: result.cancelled_at ?? undefined,
      cancelledReason: result.cancelled_reason ?? undefined,
      createdBy: result.created_by ?? undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      items:
        "items" in result && result.items
          ? result.items.map((item) => this.mapToAuditItem(item))
          : undefined,
      incidences:
        "incidences" in result && result.incidences
          ? result.incidences.map((inc) => this.mapToAuditIncidence(inc))
          : undefined,
      photos:
        "photos" in result && result.photos
          ? result.photos.map((photo) => this.mapToAuditPhoto(photo))
          : undefined,
      history:
        "history" in result && result.history
          ? result.history.map(
              (h) =>
                new AuditStatusHistory({
                  id: h.id,
                  auditId: h.audit_id,
                  fromStatus: h.from_status as AuditStatus | undefined,
                  toStatus: h.to_status as AuditStatus,
                  changedBy: h.changed_by,
                  changedAt: h.changed_at,
                  reason: h.reason ?? undefined,
                })
            )
          : undefined,
    });
  }

  private mapToAuditItem(
    result:
      | AuditItemWithRelations
      | Prisma.AuditItemGetPayload<{ include: { options: true } }>
  ): AuditItem {
    return new AuditItem({
      id: result.id,
      uuid: result.uuid,
      auditId: result.audit_id,
      questionTemplateId: result.question_template_id,
      targetType: result.target_type as QuestionTargetType,
      apartmentId: result.apartment_id ?? undefined,
      spaceId: result.space_id ?? undefined,
      elementId: result.element_id ?? undefined,
      questionText: result.question_text,
      answerType: result.answer_type as AnswerType,
      category: result.category as QuestionCategory,
      weight: result.weight ?? undefined,
      impact: result.impact as ImpactLevel,
      isMandatory: result.is_mandatory,
      sortOrder: result.sort_order ?? undefined,
      isAnswered: result.is_answered,
      isVisible: result.is_visible,
      completionRate: result.completion_rate,
      startedAt: result.started_at ?? undefined,
      completedAt: result.completed_at ?? undefined,
      parentAuditItemId: result.parent_audit_item_id ?? undefined,
      answers:
        "answers" in result && result.answers
          ? result.answers.map((a) => this.mapToAuditResponse(a))
          : undefined,
      options:
        "options" in result && result.options
          ? result.options.map((opt) => this.mapToAuditAnswerOption(opt))
          : undefined,
      photos:
        "photos" in result && result.photos
          ? result.photos.map((p) => this.mapToAuditPhoto(p))
          : undefined,
      incidences:
        "incidences" in result && result.incidences
          ? result.incidences.map((inc) => this.mapToAuditIncidence(inc))
          : undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  private mapToAuditResponse(
    result:
      | AuditResponseWithRelations
      | Prisma.AuditResponseGetPayload<Record<string, never>>
  ): AuditResponse {
    return new AuditResponse({
      id: result.id,
      auditItemId: result.audit_item_id,
      booleanValue: result.boolean_value ?? undefined,
      textValue: result.text_value ?? undefined,
      numberValue: result.number_value ?? undefined,
      notes: result.notes ?? undefined,
      selectedOptions:
        "selected_options" in result && result.selected_options
          ? result.selected_options.map(
              (opt) =>
                new AuditResponseOption({
                  id: opt.id,
                  auditResponseId: opt.audit_response_id,
                  auditAnswerOptionId: opt.audit_answer_option_id,
                })
            )
          : undefined,
      photos:
        "photos" in result && result.photos
          ? result.photos.map((p) => this.mapToAuditPhoto(p))
          : undefined,
      startedAt: result.started_at ?? undefined,
      completedAt: result.completed_at ?? undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  private mapToAuditAnswerOption(
    result: AuditAnswerOptionResult
  ): AuditAnswerOption {
    return new AuditAnswerOption({
      id: result.id,
      auditItemId: result.audit_item_id,
      answerOptionTemplateId: result.answer_option_template_id,
      code: result.code,
      label: result.label,
      sortOrder: result.sort_order ?? undefined,
      penaltyWeight: result.penalty_weight ?? undefined,
      createdAt: result.created_at,
    });
  }

  private mapToAuditIncidence(
    result:
      | AuditIncidenceWithRelations
      | Prisma.AuditIncidenceGetPayload<Record<string, never>>
  ): AuditIncidence {
    return new AuditIncidence({
      id: result.id,
      uuid: result.uuid,
      auditId: result.audit_id,
      auditItemId: result.audit_item_id ?? undefined,
      incidenceTemplateId: result.incidence_template_id ?? undefined,
      targetType: result.target_type as QuestionTargetType,
      apartmentId: result.apartment_id ?? undefined,
      spaceId: result.space_id ?? undefined,
      elementId: result.element_id ?? undefined,
      name: result.name,
      code: result.code ?? undefined,
      category: result.category as QuestionCategory,
      severity: result.severity as SeverityLevelEnum,
      nonConformity: result.non_conformity as NonConformityTypeEnum | undefined,
      responsible: result.responsible as ResponsibleTypeEnum,
      description: result.description ?? undefined,
      actionsJson: result.actions_json as Record<string, unknown> | undefined,
      status: result.status as IncidenceStatus,
      resolvedAt: result.resolved_at ?? undefined,
      closedAt: result.closed_at ?? undefined,
      resolvedBy: result.resolved_by ?? undefined,
      closedBy: result.closed_by ?? undefined,
      photos:
        "photos" in result && result.photos
          ? result.photos.map((p) => this.mapToAuditPhoto(p))
          : undefined,
      notes: result.notes ?? undefined,
      createdBy: result.created_by ?? undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  private mapToAuditPhoto(result: AuditPhotoResult): AuditPhoto {
    return new AuditPhoto({
      id: result.id,
      uuid: null, // AuditPhoto doesn't have uuid in schema
      auditId: result.audit_id,
      context: result.context as AuditPhotoContext,
      url: result.url,
      description: result.description ?? undefined,
      metadata: result.metadata as Record<string, unknown> | undefined,
      spaceId: result.space_id ?? undefined,
      elementId: result.element_id ?? undefined,
      auditItemId: result.audit_item_id ?? undefined,
      auditResponseId: result.audit_response_id ?? undefined,
      auditIncidenceId: result.audit_incidence_id ?? undefined,
      createdBy: result.created_by ?? undefined,
      createdAt: result.created_at ?? null,
    });
  }

  async getActiveAuditByApartmentId(
    apartmentId: number
  ): Promise<Audit | null> {
    const result = await this.prisma.client.audit.findFirst({
      where: {
        apartment_id: apartmentId,
        status: AuditStatus.IN_PROGRESS,
      },
      include: {
        items: {
          include: {
            answers: {
              include: {
                selected_options: {
                  include: {
                    audit_answer_option: true,
                  },
                },
                photos: true,
              },
            },
            options: true,
            photos: true,
            incidences: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
        incidences: {
          include: {
            photos: true,
          },
        },
        photos: true,
        history: {
          orderBy: {
            changed_at: "desc",
          },
        },
      },
      orderBy: {
        created_at: "desc", // Get the most recent one if multiple somehow exist
      },
    });

    if (!result) {
      return null;
    }

    return this.mapToAudit(result);
  }
}
