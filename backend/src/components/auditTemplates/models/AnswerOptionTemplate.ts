export class AnswerOptionTemplate {
  #id: number;
  #questionId: number;
  #code: string;
  #label: string;
  #sortOrder: number | null;
  #penaltyWeight: number | null;
  #createdBy: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    questionId,
    code,
    label,
    sortOrder,
    penaltyWeight,
    createdBy,
    createdAt,
    updatedAt,
  }: {
    id: number;
    questionId: number;
    code: string;
    label: string;
    sortOrder: number | null;
    penaltyWeight: number | null;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
    this.#questionId = questionId;
    this.#code = code;
    this.#label = label;
    this.#sortOrder = sortOrder;
    this.#penaltyWeight = penaltyWeight;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): number {
    return this.#id;
  }

  get questionId(): number {
    return this.#questionId;
  }

  get code(): string {
    return this.#code;
  }

  get label(): string {
    return this.#label;
  }

  get sortOrder(): number | null {
    return this.#sortOrder;
  }

  get penaltyWeight(): number | null {
    return this.#penaltyWeight;
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
      questionId: this.questionId,
      code: this.code,
      label: this.label,
      sortOrder: this.sortOrder,
      penaltyWeight: this.penaltyWeight,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
