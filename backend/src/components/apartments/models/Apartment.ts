export class Apartment {
  #id: number;
  #name: string;
  #address: string;
  #city: string;
  #country: string;
  #postalCode: string;
  #neighborhood: string;
  #agent: string;
  #createdAt: Date;
  #updatedAt: Date;

  constructor(
    id: number,
    name: string,
    address: string,
    city: string,
    country: string,
    postalCode: string,
    neighborhood: string,
    agent: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.#id = id;
    this.#name = name;
    this.#address = address;
    this.#city = city;
    this.#country = country;
    this.#postalCode = postalCode;
    this.#neighborhood = neighborhood;
    this.#agent = agent;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  /**
   * Capitalizes the first letter of each word in a string
   * @param text - The string to capitalize
   * @returns The capitalized string
   */
  #capitalizeWords(text: string): string {
    if (!text) return text;
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  get id(): number {
    return this.#id;
  }

  get name(): string {
    return this.#capitalizeWords(this.#name);
  }

  get address(): string {
    return this.#capitalizeWords(this.#address);
  }

  get city(): string {
    return this.#capitalizeWords(this.#city);
  }

  get country(): string {
    return this.#capitalizeWords(this.#country);
  }

  get postalCode(): string {
    return this.#postalCode;
  }

  get neighborhood(): string {
    return this.#capitalizeWords(this.#neighborhood);
  }

  get agent(): string {
    return this.#capitalizeWords(this.#agent);
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
      address: this.address,
      city: this.city,
      country: this.country,
      postalCode: this.postalCode,
      neighborhood: this.neighborhood,
      agent: this.agent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
