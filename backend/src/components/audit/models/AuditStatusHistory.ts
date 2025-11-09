import type { AuditStatus } from "./AuditStatus";

export class AuditStatusHistory {
  #id: number | null;
  #auditId: number;
  #fromStatus?: AuditStatus;
  #toStatus: AuditStatus;
  #changedBy: string;
  #changedAt: Date | null;
  #reason?: string;

  constructor({
    id,
    auditId,
    fromStatus,
    toStatus,
    changedBy,
    changedAt,
    reason,
  }: {
    id: number | null;
    auditId: number;
    fromStatus?: AuditStatus;
    toStatus: AuditStatus;
    changedBy: string;
    changedAt: Date | null;
    reason?: string;
  }) {
    this.#id = id;
    this.#auditId = auditId;
    this.#fromStatus = fromStatus;
    this.#toStatus = toStatus;
    this.#changedBy = changedBy;
    this.#changedAt = changedAt;
    this.#reason = reason;
  }

  get id(): number | null {
    return this.#id;
  }

  get auditId(): number {
    return this.#auditId;
  }

  get fromStatus(): AuditStatus | undefined {
    return this.#fromStatus;
  }

  get toStatus(): AuditStatus {
    return this.#toStatus;
  }

  get changedBy(): string {
    return this.#changedBy;
  }

  get changedAt(): Date | null {
    return this.#changedAt;
  }

  get reason(): string | undefined {
    return this.#reason;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      auditId: this.auditId,
      fromStatus: this.fromStatus,
      toStatus: this.toStatus,
      changedBy: this.changedBy,
      changedAt: this.changedAt,
      reason: this.reason,
    };
  }
}
