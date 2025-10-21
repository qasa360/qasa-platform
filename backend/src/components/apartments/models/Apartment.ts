export class Apartment {
  constructor(
    private readonly _id: number,
    private _name: string,
    private _address: string,
    private _city: string,
    private _country: string,
    private _postalCode: string,
    private _neighborhood: string,
    private _agent: string,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {}

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get address(): string {
    return this._address;
  }

  get city(): string {
    return this._city;
  }

  get country(): string {
    return this._country;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get agent(): string {
    return this._agent;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJson(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      address: this._address,
      city: this._city,
      country: this._country,
      postalCode: this._postalCode,
      neighborhood: this._neighborhood,
      agent: this._agent,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
