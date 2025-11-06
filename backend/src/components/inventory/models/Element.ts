import type { ElementType } from "./ElementType";

export class Element {
  #id: number;
  #uuid: string;
  #spaceId: number;
  #elementTypeId: number;
  #name: string;
  #brand: string | null;
  #model: string | null;
  #material: string | null;
  #color: string | null;
  #condition: string | null;
  #notes: Record<string, unknown> | null;
  #dimensions: Record<string, unknown> | null;
  #isActive: boolean;
  #createdAt: Date;
  #updatedAt: Date;

  #elementType?: ElementType;

  constructor({
    id,
    uuid,
    spaceId,
    elementTypeId,
    name,
    brand,
    model,
    material,
    color,
    condition,
    notes,
    dimensions,
    isActive,
    createdAt,
    updatedAt,
    elementType,
  }: {
    id: number;
    uuid: string;
    spaceId: number;
    elementTypeId: number;
    name: string;
    brand: string | null;
    model: string | null;
    material: string | null;
    color: string | null;
    condition: string | null;
    notes: Record<string, unknown> | null;
    dimensions: Record<string, unknown> | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    elementType?: ElementType;
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#spaceId = spaceId;
    this.#elementTypeId = elementTypeId;
    this.#name = name;
    this.#brand = brand;
    this.#model = model;
    this.#material = material;
    this.#color = color;
    this.#condition = condition;
    this.#notes = notes;
    this.#dimensions = dimensions;
    this.#isActive = isActive;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#elementType = elementType;
  }

  get id(): number {
    return this.#id;
  }

  get uuid(): string {
    return this.#uuid;
  }

  get spaceId(): number {
    return this.#spaceId;
  }

  get elementTypeId(): number {
    return this.#elementTypeId;
  }

  get name(): string {
    return this.#name;
  }

  get brand(): string | null {
    return this.#brand;
  }

  get model(): string | null {
    return this.#model;
  }

  get material(): string | null {
    return this.#material;
  }

  get color(): string | null {
    return this.#color;
  }

  get condition(): string | null {
    return this.#condition;
  }

  get notes(): Record<string, unknown> | null {
    return this.#notes;
  }

  get dimensions(): Record<string, unknown> | null {
    return this.#dimensions;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  get elementType(): ElementType | undefined {
    return this.#elementType;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      uuid: this.uuid,
      spaceId: this.spaceId,
      name: this.name,
      brand: this.brand,
      model: this.model,
      material: this.material,
      color: this.color,
      condition: this.condition,
      notes: this.notes,
      dimensions: this.dimensions,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      elementType: this.elementType?.toJSON(),
    };
  }
}
