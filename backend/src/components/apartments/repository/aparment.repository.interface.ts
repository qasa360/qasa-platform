import type { Apartment } from "../models/Apartment";

export interface IApartmentRepository {
  getApartmentsByAgent(agent: string): Promise<Apartment[]>;
}
