import type {
  QuestionTargetType,
  AnswerType,
  QuestionCategory,
  ImpactLevel,
} from "../../audit/models/enums";
import type { AnswerOptionTemplate } from "./AnswerOptionTemplate";

export class AuditQuestionTemplate {
  #id: number;
  #versionId: number;
  #targetType: QuestionTargetType;
  #spaceTypeId: number | null;
  #elementTypeId: number | null;
  #questionText: string;
  #answerType: AnswerType;
  #category: QuestionCategory;
  #weight: number | null;
  #impact: ImpactLevel;
  #sortOrder: number | null;
  #isMandatory: boolean;
  #visibilityCondition: Record<string, unknown> | null;
  #tags: string | null;
  #reference: string | null;
  #notes: string | null;
  #isActive: boolean;
  #createdBy: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  #options?: AnswerOptionTemplate[];

  constructor({
    id,
    versionId,
    targetType,
    spaceTypeId,
    elementTypeId,
    questionText,
    answerType,
    category,
    weight,
    impact,
    sortOrder,
    isMandatory,
    visibilityCondition,
    tags,
    reference,
    notes,
    isActive,
    createdBy,
    createdAt,
    updatedAt,
    options,
  }: {
    id: number;
    versionId: number;
    targetType: QuestionTargetType;
    spaceTypeId: number | null;
    elementTypeId: number | null;
    questionText: string;
    answerType: AnswerType;
    category: QuestionCategory;
    weight: number | null;
    impact: ImpactLevel;
    sortOrder: number | null;
    isMandatory: boolean;
    visibilityCondition: Record<string, unknown> | null;
    tags: string | null;
    reference: string | null;
    notes: string | null;
    isActive: boolean;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    options?: AnswerOptionTemplate[];
  }) {
    this.#id = id;
    this.#versionId = versionId;
    this.#targetType = targetType;
    this.#spaceTypeId = spaceTypeId;
    this.#elementTypeId = elementTypeId;
    this.#questionText = questionText;
    this.#answerType = answerType;
    this.#category = category;
    this.#weight = weight;
    this.#impact = impact;
    this.#sortOrder = sortOrder;
    this.#isMandatory = isMandatory;
    this.#visibilityCondition = visibilityCondition;
    this.#tags = tags;
    this.#reference = reference;
    this.#notes = notes;
    this.#isActive = isActive;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#options = options;
  }

  get id(): number {
    return this.#id;
  }

  get versionId(): number {
    return this.#versionId;
  }

  get targetType(): QuestionTargetType {
    return this.#targetType;
  }

  get spaceTypeId(): number | null {
    return this.#spaceTypeId;
  }

  get elementTypeId(): number | null {
    return this.#elementTypeId;
  }

  get questionText(): string {
    return this.#questionText;
  }

  get answerType(): AnswerType {
    return this.#answerType;
  }

  get category(): QuestionCategory {
    return this.#category;
  }

  get weight(): number | null {
    return this.#weight;
  }

  get impact(): ImpactLevel {
    return this.#impact;
  }

  get sortOrder(): number | null {
    return this.#sortOrder;
  }

  get isMandatory(): boolean {
    return this.#isMandatory;
  }

  get visibilityCondition(): Record<string, unknown> | null {
    return this.#visibilityCondition;
  }

  get tags(): string | null {
    return this.#tags;
  }

  get reference(): string | null {
    return this.#reference;
  }

  get notes(): string | null {
    return this.#notes;
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

  get options(): AnswerOptionTemplate[] | undefined {
    return this.#options;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      versionId: this.versionId,
      targetType: this.targetType,
      spaceTypeId: this.spaceTypeId,
      elementTypeId: this.elementTypeId,
      questionText: this.questionText,
      answerType: this.answerType,
      category: this.category,
      weight: this.weight,
      impact: this.impact,
      sortOrder: this.sortOrder,
      isMandatory: this.isMandatory,
      visibilityCondition: this.visibilityCondition,
      tags: this.tags,
      reference: this.reference,
      notes: this.notes,
      isActive: this.isActive,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      options: this.options?.map((opt) => opt.toJSON()),
    };
  }
}
