import type { AuditQuestionTemplate } from "./AuditQuestionTemplate";

export class AuditTemplateVersion {
  #id: number;
  #code: string;
  #name: string;
  #description: string | null;
  #version: number;
  #validFrom: Date;
  #validTo: Date | null;
  #isDefault: boolean;
  #createdBy: string | null;
  #approvedBy: string | null;
  #approvedAt: Date | null;
  #createdAt: Date;
  #updatedAt: Date;

  #questions?: AuditQuestionTemplate[];

  constructor({
    id,
    code,
    name,
    description,
    version,
    validFrom,
    validTo,
    isDefault,
    createdBy,
    approvedBy,
    approvedAt,
    createdAt,
    updatedAt,
    questions,
  }: {
    id: number;
    code: string;
    name: string;
    description: string | null;
    version: number;
    validFrom: Date;
    validTo: Date | null;
    isDefault: boolean;
    createdBy: string | null;
    approvedBy: string | null;
    approvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    questions?: AuditQuestionTemplate[];
  }) {
    this.#id = id;
    this.#code = code;
    this.#name = name;
    this.#description = description;
    this.#version = version;
    this.#validFrom = validFrom;
    this.#validTo = validTo;
    this.#isDefault = isDefault;
    this.#createdBy = createdBy;
    this.#approvedBy = approvedBy;
    this.#approvedAt = approvedAt;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#questions = questions;
  }

  get id(): number {
    return this.#id;
  }

  get code(): string {
    return this.#code;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string | null {
    return this.#description;
  }

  get version(): number {
    return this.#version;
  }

  get validFrom(): Date {
    return this.#validFrom;
  }

  get validTo(): Date | null {
    return this.#validTo;
  }

  get isDefault(): boolean {
    return this.#isDefault;
  }

  get createdBy(): string | null {
    return this.#createdBy;
  }

  get approvedBy(): string | null {
    return this.#approvedBy;
  }

  get approvedAt(): Date | null {
    return this.#approvedAt;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  get questions(): AuditQuestionTemplate[] | undefined {
    return this.#questions;
  }

  isActive(): boolean {
    const now = new Date();
    return (
      this.#validFrom <= now && (this.#validTo === null || this.#validTo >= now)
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      description: this.description,
      version: this.version,
      validFrom: this.validFrom,
      validTo: this.validTo,
      isDefault: this.isDefault,
      createdBy: this.createdBy,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive(),
      questions: this.questions?.map((q) => q.toJSON()),
    };
  }
}
