import type { IncidenceTemplate } from "../../auditTemplates/models/IncidenceTemplate";
import { IncidenceStatus } from "./IncidenceStatus";
import type { AuditPhoto } from "./AuditPhoto";
import type { QuestionTargetType, QuestionCategory } from "./enums";

export enum SeverityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum NonConformityType {
  OBSERVATION = "OBSERVATION",
  MINOR = "MINOR",
  MAJOR = "MAJOR",
  CRITICAL = "CRITICAL",
}

export enum ResponsibleType {
  CLEANING = "CLEANING",
  MAINTENANCE = "MAINTENANCE",
  MANAGEMENT = "MANAGEMENT",
  OWNER = "OWNER",
  OTHER = "OTHER",
}

export class AuditIncidence {
  #id: number | null;
  #uuid: string | null;
  #auditId: number;
  #auditItemId?: number;
  #incidenceTemplateId?: number;
  #targetType: QuestionTargetType;
  #apartmentId?: number;
  #spaceId?: number;
  #elementId?: number;
  #name: string;
  #code?: string;
  #category: QuestionCategory;
  #severity: SeverityLevel;
  #nonConformity?: NonConformityType;
  #responsible: ResponsibleType;
  #description?: string;
  #actionsJson?: Record<string, unknown>;
  #status: IncidenceStatus;
  #resolvedAt?: Date;
  #closedAt?: Date;
  #resolvedBy?: string;
  #closedBy?: string;
  #photos?: AuditPhoto[];
  #notes?: string;
  #createdBy?: string;
  #createdAt: Date | null;
  #updatedAt: Date | null;

  constructor({
    id,
    uuid,
    auditId,
    auditItemId,
    incidenceTemplateId,
    targetType,
    apartmentId,
    spaceId,
    elementId,
    name,
    code,
    category,
    severity,
    nonConformity,
    responsible,
    description,
    actionsJson,
    status,
    resolvedAt,
    closedAt,
    resolvedBy,
    closedBy,
    photos,
    notes,
    createdBy,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    uuid: string | null;
    auditId: number;
    auditItemId?: number;
    incidenceTemplateId?: number;
    targetType: QuestionTargetType;
    apartmentId?: number;
    spaceId?: number;
    elementId?: number;
    name: string;
    code?: string;
    category: QuestionCategory;
    severity: SeverityLevel;
    nonConformity?: NonConformityType;
    responsible: ResponsibleType;
    description?: string;
    actionsJson?: Record<string, unknown>;
    status: IncidenceStatus;
    resolvedAt?: Date;
    closedAt?: Date;
    resolvedBy?: string;
    closedBy?: string;
    photos?: AuditPhoto[];
    notes?: string;
    createdBy?: string;
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#auditId = auditId;
    this.#auditItemId = auditItemId;
    this.#incidenceTemplateId = incidenceTemplateId;
    this.#targetType = targetType;
    this.#apartmentId = apartmentId;
    this.#spaceId = spaceId;
    this.#elementId = elementId;
    this.#name = name;
    this.#code = code;
    this.#category = category;
    this.#severity = severity;
    this.#nonConformity = nonConformity;
    this.#responsible = responsible;
    this.#description = description;
    this.#actionsJson = actionsJson;
    this.#status = status;
    this.#resolvedAt = resolvedAt;
    this.#closedAt = closedAt;
    this.#resolvedBy = resolvedBy;
    this.#closedBy = closedBy;
    this.#photos = photos;
    this.#notes = notes;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): number | null {
    return this.#id;
  }

  get uuid(): string | null {
    return this.#uuid;
  }

  get auditId(): number {
    return this.#auditId;
  }

  get auditItemId(): number | undefined {
    return this.#auditItemId;
  }

  get incidenceTemplateId(): number | undefined {
    return this.#incidenceTemplateId;
  }

  get targetType(): QuestionTargetType {
    return this.#targetType;
  }

  get apartmentId(): number | undefined {
    return this.#apartmentId;
  }

  get spaceId(): number | undefined {
    return this.#spaceId;
  }

  get elementId(): number | undefined {
    return this.#elementId;
  }

  get name(): string {
    return this.#name;
  }

  get code(): string | undefined {
    return this.#code;
  }

  get category(): QuestionCategory {
    return this.#category;
  }

  get severity(): SeverityLevel {
    return this.#severity;
  }

  get nonConformity(): NonConformityType | undefined {
    return this.#nonConformity;
  }

  get responsible(): ResponsibleType {
    return this.#responsible;
  }

  get description(): string | undefined {
    return this.#description;
  }

  get actionsJson(): Record<string, unknown> | undefined {
    return this.#actionsJson;
  }

  get status(): IncidenceStatus {
    return this.#status;
  }

  get resolvedAt(): Date | undefined {
    return this.#resolvedAt;
  }

  get closedAt(): Date | undefined {
    return this.#closedAt;
  }

  get resolvedBy(): string | undefined {
    return this.#resolvedBy;
  }

  get closedBy(): string | undefined {
    return this.#closedBy;
  }

  get photos(): AuditPhoto[] | undefined {
    return this.#photos;
  }

  get notes(): string | undefined {
    return this.#notes;
  }

  get createdBy(): string | undefined {
    return this.#createdBy;
  }

  get createdAt(): Date | null {
    return this.#createdAt;
  }

  get updatedAt(): Date | null {
    return this.#updatedAt;
  }

  /**
   * Factory method to create a new AuditIncidence entity from template and context.
   * Returns an entity with id=null, uuid=null, timestamps=null (will be set by repository on save).
   */
  static createFromTemplate(
    template: IncidenceTemplate,
    context: {
      auditId: number;
      auditItemId?: number;
      targetType: QuestionTargetType;
      apartmentId?: number;
      spaceId?: number;
      elementId?: number;
      createdBy?: string;
    }
  ): AuditIncidence {
    return new AuditIncidence({
      id: null,
      uuid: null,
      auditId: context.auditId,
      auditItemId: context.auditItemId,
      incidenceTemplateId: template.id,
      targetType: context.targetType,
      apartmentId: context.apartmentId,
      spaceId: context.spaceId,
      elementId: context.elementId,
      name: template.name,
      code: template.code,
      category: template.category,
      severity: template.severity,
      nonConformity: template.nonConformity ?? undefined,
      responsible: template.responsible,
      description: template.description ?? undefined,
      actionsJson: template.actionsJson ?? undefined,
      status: IncidenceStatus.OPEN,
      createdAt: null,
      updatedAt: null,
      createdBy: context.createdBy,
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      uuid: this.uuid,
      auditId: this.auditId,
      auditItemId: this.auditItemId,
      incidenceTemplateId: this.incidenceTemplateId,
      targetType: this.targetType,
      apartmentId: this.apartmentId,
      spaceId: this.spaceId,
      elementId: this.elementId,
      name: this.name,
      code: this.code,
      category: this.category,
      severity: this.severity,
      nonConformity: this.nonConformity,
      responsible: this.responsible,
      description: this.description,
      actionsJson: this.actionsJson,
      status: this.status,
      resolvedAt: this.resolvedAt,
      closedAt: this.closedAt,
      resolvedBy: this.resolvedBy,
      closedBy: this.closedBy,
      photos: this.photos?.map((photo) => photo.toJSON()),
      notes: this.notes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
