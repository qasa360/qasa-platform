import type { AuditResponse } from "./AuditResponse";
import type { AuditAnswerOption } from "./AuditAnswerOption";
import type { AuditPhoto } from "./AuditPhoto";
import type { AuditIncidence } from "./AuditIncidence";
import type {
  QuestionTargetType,
  QuestionCategory,
  ImpactLevel,
  AnswerType,
} from "./enums";

export class AuditItem {
  #id: number | null;
  #uuid: string | null;
  #auditId: number;
  #questionTemplateId: number;
  #targetType: QuestionTargetType;
  #apartmentId?: number;
  #spaceId?: number;
  #elementId?: number;
  #questionText: string;
  #answerType: AnswerType;
  #category: QuestionCategory;
  #weight?: number;
  #impact: ImpactLevel;
  #isMandatory: boolean;
  #sortOrder?: number;
  #isAnswered: boolean;
  #isVisible: boolean;
  #completionRate: number;
  #startedAt?: Date;
  #completedAt?: Date;
  #parentAuditItemId?: number;
  #followups?: AuditItem[];
  #answers?: AuditResponse[];
  #options?: AuditAnswerOption[];
  #photos?: AuditPhoto[];
  #incidences?: AuditIncidence[];
  #createdAt: Date | null;
  #updatedAt: Date | null;

  constructor({
    id,
    uuid,
    auditId,
    questionTemplateId,
    targetType,
    apartmentId,
    spaceId,
    elementId,
    questionText,
    answerType,
    category,
    weight,
    impact,
    isMandatory,
    sortOrder,
    isAnswered,
    isVisible,
    completionRate,
    startedAt,
    completedAt,
    parentAuditItemId,
    followups,
    answers,
    options,
    photos,
    incidences,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    uuid: string | null;
    auditId: number;
    questionTemplateId: number;
    targetType: QuestionTargetType;
    apartmentId?: number;
    spaceId?: number;
    elementId?: number;
    questionText: string;
    answerType: AnswerType;
    category: QuestionCategory;
    weight?: number;
    impact: ImpactLevel;
    isMandatory: boolean;
    sortOrder?: number;
    isAnswered: boolean;
    isVisible: boolean;
    completionRate: number;
    startedAt?: Date;
    completedAt?: Date;
    parentAuditItemId?: number;
    followups?: AuditItem[];
    answers?: AuditResponse[];
    options?: AuditAnswerOption[];
    photos?: AuditPhoto[];
    incidences?: AuditIncidence[];
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#auditId = auditId;
    this.#questionTemplateId = questionTemplateId;
    this.#targetType = targetType;
    this.#apartmentId = apartmentId;
    this.#spaceId = spaceId;
    this.#elementId = elementId;
    this.#questionText = questionText;
    this.#answerType = answerType;
    this.#category = category;
    this.#weight = weight;
    this.#impact = impact;
    this.#isMandatory = isMandatory;
    this.#sortOrder = sortOrder;
    this.#isAnswered = isAnswered;
    this.#isVisible = isVisible;
    this.#completionRate = completionRate;
    this.#startedAt = startedAt;
    this.#completedAt = completedAt;
    this.#parentAuditItemId = parentAuditItemId;
    this.#followups = followups;
    this.#answers = answers;
    this.#options = options;
    this.#photos = photos;
    this.#incidences = incidences;
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

  get questionTemplateId(): number {
    return this.#questionTemplateId;
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

  get questionText(): string {
    return this.#questionText;
  }

  get answerType(): AnswerType {
    return this.#answerType;
  }

  get category(): QuestionCategory {
    return this.#category;
  }

  get weight(): number | undefined {
    return this.#weight;
  }

  get impact(): ImpactLevel {
    return this.#impact;
  }

  get isMandatory(): boolean {
    return this.#isMandatory;
  }

  get sortOrder(): number | undefined {
    return this.#sortOrder;
  }

  get isAnswered(): boolean {
    return this.#isAnswered;
  }

  get isVisible(): boolean {
    return this.#isVisible;
  }

  get completionRate(): number {
    return this.#completionRate;
  }

  get startedAt(): Date | undefined {
    return this.#startedAt;
  }

  get completedAt(): Date | undefined {
    return this.#completedAt;
  }

  get parentAuditItemId(): number | undefined {
    return this.#parentAuditItemId;
  }

  get followups(): AuditItem[] | undefined {
    return this.#followups;
  }

  get answers(): AuditResponse[] | undefined {
    return this.#answers;
  }

  get options(): AuditAnswerOption[] | undefined {
    return this.#options;
  }

  get photos(): AuditPhoto[] | undefined {
    return this.#photos;
  }

  get incidences(): AuditIncidence[] | undefined {
    return this.#incidences;
  }

  get createdAt(): Date | null {
    return this.#createdAt;
  }

  get updatedAt(): Date | null {
    return this.#updatedAt;
  }

  canAnswer(): boolean {
    return this.#isVisible && !this.#isAnswered;
  }

  hasAnswer(): boolean {
    return this.#isAnswered && (this.#answers?.length ?? 0) > 0;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      uuid: this.uuid,
      auditId: this.auditId,
      questionTemplateId: this.questionTemplateId,
      targetType: this.targetType,
      apartmentId: this.apartmentId,
      spaceId: this.spaceId,
      elementId: this.elementId,
      questionText: this.questionText,
      answerType: this.answerType,
      category: this.category,
      weight: this.weight,
      impact: this.impact,
      isMandatory: this.isMandatory,
      sortOrder: this.sortOrder,
      isAnswered: this.isAnswered,
      isVisible: this.isVisible,
      completionRate: this.completionRate,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      parentAuditItemId: this.parentAuditItemId,
      followups: this.followups?.map((item) => item.toJSON()),
      answers: this.answers?.map((answer) => answer.toJSON()),
      options: this.options?.map((option) => option.toJSON()),
      photos: this.photos?.map((photo) => photo.toJSON()),
      incidences: this.incidences?.map((incidence) => incidence.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
