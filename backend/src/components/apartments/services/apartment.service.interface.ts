import type { Apartment } from "../models/Apartment";

export interface IApartmentService {
  getApartmentsByAgent(agent: string): Promise<Apartment[]>;
}
