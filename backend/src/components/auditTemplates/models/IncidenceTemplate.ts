import type { QuestionCategory } from "../../audit/models/enums";
import type {
  SeverityLevel,
  NonConformityType,
  ResponsibleType,
} from "../../audit/models/AuditIncidence";

export class IncidenceTemplate {
  #id: number;
  #name: string;
  #code: string;
  #category: QuestionCategory;
  #severity: SeverityLevel;
  #nonConformity: NonConformityType | null;
  #responsible: ResponsibleType;
  #description: string | null;
  #actionsJson: Record<string, unknown> | null;
  #isActive: boolean;
  #createdBy: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    name,
    code,
    category,
    severity,
    nonConformity,
    responsible,
    description,
    actionsJson,
    isActive,
    createdBy,
    createdAt,
    updatedAt,
  }: {
    id: number;
    name: string;
    code: string;
    category: QuestionCategory;
    severity: SeverityLevel;
    nonConformity: NonConformityType | null;
    responsible: ResponsibleType;
    description: string | null;
    actionsJson: Record<string, unknown> | null;
    isActive: boolean;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
    this.#name = name;
    this.#code = code;
    this.#category = category;
    this.#severity = severity;
    this.#nonConformity = nonConformity;
    this.#responsible = responsible;
    this.#description = description;
    this.#actionsJson = actionsJson;
    this.#isActive = isActive;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get code(): string {
    return this.#code;
  }

  get category(): QuestionCategory {
    return this.#category;
  }

  get severity(): SeverityLevel {
    return this.#severity;
  }

  get nonConformity(): NonConformityType | null {
    return this.#nonConformity;
  }

  get responsible(): ResponsibleType {
    return this.#responsible;
  }

  get description(): string | null {
    return this.#description;
  }

  get actionsJson(): Record<string, unknown> | null {
    return this.#actionsJson;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  get createdBy(): string | null {
    return this.#createdBy;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      category: this.category,
      severity: this.severity,
      nonConformity: this.nonConformity,
      responsible: this.responsible,
      description: this.description,
      actionsJson: this.actionsJson,
      isActive: this.isActive,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
