import type { AuditPhoto } from "./AuditPhoto";
import type { AuditResponseOption } from "./AuditResponseOption";

export class AuditResponse {
  #id: number | null;
  #auditItemId: number;
  #booleanValue?: boolean;
  #textValue?: string;
  #numberValue?: number;
  #notes?: string;
  #selectedOptions?: AuditResponseOption[];
  #photos?: AuditPhoto[];
  #startedAt?: Date;
  #completedAt?: Date;
  #createdAt: Date | null;
  #updatedAt: Date | null;

  constructor({
    id,
    auditItemId,
    booleanValue,
    textValue,
    numberValue,
    notes,
    selectedOptions,
    photos,
    startedAt,
    completedAt,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    auditItemId: number;
    booleanValue?: boolean;
    textValue?: string;
    numberValue?: number;
    notes?: string;
    selectedOptions?: AuditResponseOption[];
    photos?: AuditPhoto[];
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    this.#id = id;
    this.#auditItemId = auditItemId;
    this.#booleanValue = booleanValue;
    this.#textValue = textValue;
    this.#numberValue = numberValue;
    this.#notes = notes;
    this.#selectedOptions = selectedOptions;
    this.#photos = photos;
    this.#startedAt = startedAt;
    this.#completedAt = completedAt;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): number | null {
    return this.#id;
  }

  get auditItemId(): number {
    return this.#auditItemId;
  }

  get booleanValue(): boolean | undefined {
    return this.#booleanValue;
  }

  get textValue(): string | undefined {
    return this.#textValue;
  }

  get numberValue(): number | undefined {
    return this.#numberValue;
  }

  get notes(): string | undefined {
    return this.#notes;
  }

  get selectedOptions(): AuditResponseOption[] | undefined {
    return this.#selectedOptions;
  }

  get photos(): AuditPhoto[] | undefined {
    return this.#photos;
  }

  get startedAt(): Date | undefined {
    return this.#startedAt;
  }

  get completedAt(): Date | undefined {
    return this.#completedAt;
  }

  get createdAt(): Date | null {
    return this.#createdAt;
  }

  get updatedAt(): Date | null {
    return this.#updatedAt;
  }

  isCompleted(): boolean {
    return this.#completedAt !== undefined;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      auditItemId: this.auditItemId,
      booleanValue: this.booleanValue,
      textValue: this.textValue,
      numberValue: this.numberValue,
      notes: this.notes,
      selectedOptions: this.selectedOptions?.map((opt) => opt.toJSON()),
      photos: this.photos?.map((photo) => photo.toJSON()),
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
