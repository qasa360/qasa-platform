import { AuditStatus } from "./AuditStatus";
import type { AuditItem } from "./AuditItem";
import type { AuditIncidence } from "./AuditIncidence";
import type { AuditPhoto } from "./AuditPhoto";
import type { AuditStatusHistory } from "./AuditStatusHistory";

export class Audit {
  #id: number | null;
  #uuid: string | null;
  #apartmentId: number;
  #auditTemplateVersionId: number;
  #status: AuditStatus;
  #completionRate: number;
  #score?: number;
  #startedAt?: Date;
  #completedAt?: Date;
  #cancelledAt?: Date;
  #cancelledReason?: string;
  #createdBy?: string;
  #createdAt: Date | null;
  #updatedAt: Date | null;

  #items?: AuditItem[];
  #incidences?: AuditIncidence[];
  #photos?: AuditPhoto[];
  #history?: AuditStatusHistory[];
  #apartment?: {
    id: number;
    name: string;
    address: string;
    city: string;
    neighborhood?: string;
    spaces?: Array<{
      id: number;
      name: string;
      spaceTypeId: number;
      order: number | null;
    }>;
  };

  constructor({
    id,
    uuid,
    apartmentId,
    auditTemplateVersionId,
    status,
    completionRate,
    score,
    startedAt,
    completedAt,
    cancelledAt,
    cancelledReason,
    createdBy,
    createdAt,
    updatedAt,
    items,
    incidences,
    photos,
    history,
    apartment,
  }: {
    id: number | null;
    uuid: string | null;
    apartmentId: number;
    auditTemplateVersionId: number;
    status: AuditStatus;
    completionRate: number;
    score?: number;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancelledReason?: string;
    createdBy?: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    items?: AuditItem[];
    incidences?: AuditIncidence[];
    photos?: AuditPhoto[];
    history?: AuditStatusHistory[];
    apartment?: {
      id: number;
      name: string;
      address: string;
      city: string;
      neighborhood?: string;
      spaces?: Array<{
        id: number;
        name: string;
        spaceTypeId: number;
        order: number | null;
      }>;
    };
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#apartmentId = apartmentId;
    this.#auditTemplateVersionId = auditTemplateVersionId;
    this.#status = status;
    this.#completionRate = completionRate;
    this.#score = score;
    this.#startedAt = startedAt;
    this.#completedAt = completedAt;
    this.#cancelledAt = cancelledAt;
    this.#cancelledReason = cancelledReason;
    this.#createdBy = createdBy;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#items = items;
    this.#incidences = incidences;
    this.#photos = photos;
    this.#history = history;
    this.#apartment = apartment;
  }

  get id(): number | null {
    return this.#id;
  }

  get uuid(): string | null {
    return this.#uuid;
  }

  get apartmentId(): number {
    return this.#apartmentId;
  }

  get auditTemplateVersionId(): number {
    return this.#auditTemplateVersionId;
  }

  get status(): AuditStatus {
    return this.#status;
  }

  get completionRate(): number {
    return this.#completionRate;
  }

  get score(): number | undefined {
    return this.#score;
  }

  get startedAt(): Date | undefined {
    return this.#startedAt;
  }

  get completedAt(): Date | undefined {
    return this.#completedAt;
  }

  get cancelledAt(): Date | undefined {
    return this.#cancelledAt;
  }

  get cancelledReason(): string | undefined {
    return this.#cancelledReason;
  }

  get createdBy(): string | undefined {
    return this.#createdBy;
  }

  get createdAt(): Date | null {
    return this.#createdAt;
  }

  get updatedAt(): Date | null {
    return this.#updatedAt;
  }

  get items(): AuditItem[] | undefined {
    return this.#items;
  }

  get incidences(): AuditIncidence[] | undefined {
    return this.#incidences;
  }

  get photos(): AuditPhoto[] | undefined {
    return this.#photos;
  }

  get history(): AuditStatusHistory[] | undefined {
    return this.#history;
  }

  get apartment(): {
    id: number;
    name: string;
    address: string;
    city: string;
    neighborhood?: string;
    spaces?: Array<{
      id: number;
      name: string;
      spaceTypeId: number;
      order: number | null;
    }>;
  } | undefined {
    return this.#apartment;
  }

  canStart(): boolean {
    return this.#status === AuditStatus.DRAFT;
  }

  canComplete(): boolean {
    return this.#status === AuditStatus.IN_PROGRESS;
  }

  canCancel(): boolean {
    return (
      this.#status === AuditStatus.DRAFT ||
      this.#status === AuditStatus.IN_PROGRESS
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      uuid: this.uuid,
      apartmentId: this.apartmentId,
      auditTemplateVersionId: this.auditTemplateVersionId,
      status: this.status,
      completionRate: this.completionRate,
      score: this.score,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      cancelledAt: this.cancelledAt,
      cancelledReason: this.cancelledReason,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      apartment: this.#apartment,
      items: this.items?.map((item) => item.toJSON()),
      incidences: this.incidences?.map((incidence) => incidence.toJSON()),
      photos: this.photos?.map((photo) => photo.toJSON()),
      history: this.history?.map((h) => h.toJSON()),
    };
  }
}
