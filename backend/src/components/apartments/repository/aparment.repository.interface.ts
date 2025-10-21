import type { Apartment } from "../models/Apartment";

export interface IApartmentRepository {
  getApartmentsByAgent(agent: string): Promise<Apartment[]>;
  getApartmentByIdAndAgent(
    id: number,
    agent: string
  ): Promise<Apartment | null>;
}
