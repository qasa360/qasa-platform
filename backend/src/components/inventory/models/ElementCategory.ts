export class ElementCategory {
  #id: number;
  #name: string;
  #description: string | null;
  #icon: string | null;
  #createdAt: Date;
  #updatedAt: Date;

  constructor({
    id,
    name,
    description,
    icon,
    createdAt,
    updatedAt,
  }: {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#icon = icon;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string | null {
    return this.#description;
  }

  get icon(): string | null {
    return this.#icon;
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
      name: this.name,
      description: this.description,
      icon: this.icon,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
