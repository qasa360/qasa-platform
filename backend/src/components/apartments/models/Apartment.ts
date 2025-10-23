import { capitalizeWords } from "../../common/capitalizeWords";
import type { Space } from "./Space";

export class Apartment {
  #id: number;
  #name: string;
  #address: string;
  #city: string;
  #country: string;
  #postalCode: string;
  #neighborhood: string;
  #agent: string;
  #isActive: boolean;
  #createdAt: Date;
  #updatedAt: Date;

  #spaces?: Space[];

  constructor({
    id,
    name,
    address,
    city,
    country,
    postalCode,
    neighborhood,
    agent,
    isActive,
    createdAt,
    updatedAt,
    spaces,
  }: {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    neighborhood: string;
    agent: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    spaces?: Space[];
  }) {
    this.#id = id;
    this.#name = name;
    this.#address = address;
    this.#city = city;
    this.#country = country;
    this.#postalCode = postalCode;
    this.#neighborhood = neighborhood;
    this.#agent = agent;
    this.#isActive = isActive;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
    this.#spaces = spaces;
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return capitalizeWords(this.#name);
  }

  get address(): string {
    return capitalizeWords(this.#address);
  }

  get city(): string {
    return capitalizeWords(this.#city);
  }

  get country(): string {
    return capitalizeWords(this.#country);
  }

  get postalCode(): string {
    return this.#postalCode;
  }

  get neighborhood(): string {
    return capitalizeWords(this.#neighborhood);
  }

  get agent(): string {
    return capitalizeWords(this.#agent);
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

  get spaces(): Space[] | undefined {
    return this.#spaces;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      city: this.city,
      country: this.country,
      postalCode: this.postalCode,
      neighborhood: this.neighborhood,
      agent: this.agent,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      spaces: this.spaces?.map((space) => space.toJSON()),
    };
  }
}
