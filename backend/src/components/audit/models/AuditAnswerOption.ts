export class AuditAnswerOption {
  #id: number | null;
  #auditItemId: number;
  #answerOptionTemplateId: number;
  #code: string;
  #label: string;
  #sortOrder?: number;
  #penaltyWeight?: number;
  #createdAt: Date | null;

  constructor({
    id,
    auditItemId,
    answerOptionTemplateId,
    code,
    label,
    sortOrder,
    penaltyWeight,
    createdAt,
  }: {
    id: number | null;
    auditItemId: number;
    answerOptionTemplateId: number;
    code: string;
    label: string;
    sortOrder?: number;
    penaltyWeight?: number;
    createdAt: Date | null;
  }) {
    this.#id = id;
    this.#auditItemId = auditItemId;
    this.#answerOptionTemplateId = answerOptionTemplateId;
    this.#code = code;
    this.#label = label;
    this.#sortOrder = sortOrder;
    this.#penaltyWeight = penaltyWeight;
    this.#createdAt = createdAt;
  }

  get id(): number | null {
    return this.#id;
  }

  get auditItemId(): number {
    return this.#auditItemId;
  }

  get answerOptionTemplateId(): number {
    return this.#answerOptionTemplateId;
  }

  get code(): string {
    return this.#code;
  }

  get label(): string {
    return this.#label;
  }

  get sortOrder(): number | undefined {
    return this.#sortOrder;
  }

  get penaltyWeight(): number | undefined {
    return this.#penaltyWeight;
  }

  get createdAt(): Date | null {
    return this.#createdAt;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      auditItemId: this.auditItemId,
      answerOptionTemplateId: this.answerOptionTemplateId,
      code: this.code,
      label: this.label,
      sortOrder: this.sortOrder,
      penaltyWeight: this.penaltyWeight,
      createdAt: this.createdAt,
    };
  }
}
