import type { ElementCategory } from "./ElementCategory";

export class ElementType {
  #id: number;
  #name: string;
  #categoryId: number;
  #description: string | null;
  #isActive: boolean;
  #createdAt: Date;
  #updatedAt: Date;

  #category?: ElementCategory;

  constructor({
    id,
    name,
    categoryId,
    description,
    isActive,
    createdAt,
    updatedAt,
    category,
  }: {
    id: number;
    name: string;
    categoryId: number;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    category?: ElementCategory;
  }) {
    this.#id = id;
    this.#name = name;
    this.#categoryId = categoryId;
    this.#description = description;
    this.#isActive = isActive;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#category = category;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get categoryId(): number {
    return this.#categoryId;
  }

  get description(): string | null {
    return this.#description;
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

  get category(): ElementCategory | undefined {
    return this.#category;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      categoryName: this.category?.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      category: this.category?.toJSON(),
    };
  }
}
