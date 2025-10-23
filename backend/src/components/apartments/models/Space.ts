import { capitalizeWords } from "../../common/capitalizeWords";
import type { SpaceType } from "./SpaceType";

export class Space {
  #id: number;
  #uuid: string;
  #apartmentId: number;
  #name: string;
  #spaceType: SpaceType;
  #m2?: number;
  #order?: number;
  #notes?: string;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    uuid,
    apartmentId,
    name,
    spaceType,
    m2,
    order,
    notes,
    createdAt,
    updatedAt,
  }: {
    id: number;
    uuid: string;
    apartmentId: number;
    name: string;
    spaceType: SpaceType;
    m2?: number;
    order?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#apartmentId = apartmentId;
    this.#name = name;
    this.#spaceType = spaceType;
    this.#m2 = m2;
    this.#order = order;
    this.#notes = notes;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  // ---- Getters ----
  get id(): number {
    return this.#id;
  }

  get uuid(): string {
    return this.#uuid;
  }

  get apartmentId(): number {
    return this.#apartmentId;
  }

  get name(): string {
    return capitalizeWords(this.#name);
  }

  get spaceType(): SpaceType {
    return this.#spaceType;
  }

  get m2(): number | undefined {
    return this.#m2;
  }

  get order(): number | undefined {
    return this.#order;
  }

  get notes(): string | undefined {
    return this.#notes;
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
      uuid: this.uuid,
      apartmentId: this.apartmentId,
      name: this.name,
      spaceType: this.spaceType,
      m2: this.m2,
      order: this.order,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
