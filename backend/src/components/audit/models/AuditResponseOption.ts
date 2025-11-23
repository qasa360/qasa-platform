export class AuditResponseOption {
  #id: number | null;
  #auditResponseId: number;
  #auditAnswerOptionId: number;

  constructor({
    id,
    auditResponseId,
    auditAnswerOptionId,
  }: {
    id: number | null;
    auditResponseId: number;
    auditAnswerOptionId: number;
  }) {
    this.#id = id;
    this.#auditResponseId = auditResponseId;
    this.#auditAnswerOptionId = auditAnswerOptionId;
  }

  get id(): number | null {
    return this.#id;
  }

  get auditResponseId(): number {
    return this.#auditResponseId;
  }

  get auditAnswerOptionId(): number {
    return this.#auditAnswerOptionId;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      auditResponseId: this.auditResponseId,
      auditAnswerOptionId: this.auditAnswerOptionId,
    };
  }
}
