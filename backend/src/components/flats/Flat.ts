export class Flat {
  constructor(
    private readonly _id: number,
    private _name: string,
    private _address: string,
    private _city: string,
    private _country: string,
    private _ownerName: string
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

  get ownerName(): string {
    return this._ownerName;
  }

  toJson(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      address: this._address,
      city: this._city,
      country: this._country,
      ownerName: this._ownerName,
    };
  }
}
