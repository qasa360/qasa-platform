export enum AuditPhotoContext {
  AUDIT = "AUDIT",
  SPACE = "SPACE",
  ELEMENT = "ELEMENT",
  QUESTION = "QUESTION",
  RESPONSE = "RESPONSE",
  INCIDENCE = "INCIDENCE",
}

export class AuditPhoto {
  #id: number | null;
  #uuid: string | null;
  #auditId: number;
  #context: AuditPhotoContext;
  #url: string;
  #description?: string;
  #metadata?: Record<string, unknown>;
  #spaceId?: number;
  #elementId?: number;
  #auditItemId?: number;
  #auditResponseId?: number;
  #auditIncidenceId?: number;
  #createdBy?: string;
  #createdAt: Date | null;

  constructor({
    id,
    uuid,
    auditId,
    context,
    url,
    description,
    metadata,
    spaceId,
    elementId,
    auditItemId,
    auditResponseId,
    auditIncidenceId,
    createdBy,
    createdAt,
  }: {
    id: number | null;
    uuid: string | null;
    auditId: number;
    context: AuditPhotoContext;
    url: string;
    description?: string;
    metadata?: Record<string, unknown>;
    spaceId?: number;
    elementId?: number;
    auditItemId?: number;
    auditResponseId?: number;
    auditIncidenceId?: number;
    createdBy?: string;
    createdAt: Date | null;
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#auditId = auditId;
    this.#context = context;
    this.#url = url;
    this.#description = description;
    this.#metadata = metadata;
    this.#spaceId = spaceId;
    this.#elementId = elementId;
    this.#auditItemId = auditItemId;
    this.#auditResponseId = auditResponseId;
    this.#auditIncidenceId = auditIncidenceId;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
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

  get context(): AuditPhotoContext {
    return this.#context;
  }

  get url(): string {
    return this.#url;
  }

  get description(): string | undefined {
    return this.#description;
  }

  get metadata(): Record<string, unknown> | undefined {
    return this.#metadata;
  }

  get spaceId(): number | undefined {
    return this.#spaceId;
  }

  get elementId(): number | undefined {
    return this.#elementId;
  }

  get auditItemId(): number | undefined {
    return this.#auditItemId;
  }

  get auditResponseId(): number | undefined {
    return this.#auditResponseId;
  }

  get auditIncidenceId(): number | undefined {
    return this.#auditIncidenceId;
  }

  get createdBy(): string | undefined {
    return this.#createdBy;
  }

  get createdAt(): Date | null {
    return this.#createdAt;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      auditId: this.auditId,
      context: this.context,
      url: this.url,
      description: this.description,
      metadata: this.metadata,
      spaceId: this.spaceId,
      elementId: this.elementId,
      auditItemId: this.auditItemId,
      auditResponseId: this.auditResponseId,
      auditIncidenceId: this.auditIncidenceId,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}
