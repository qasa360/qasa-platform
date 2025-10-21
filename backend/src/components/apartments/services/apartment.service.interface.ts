import type { Apartment } from "../models/Apartment";

export interface IApartmentService {
  getApartmentsByAgent(agent: string): Promise<Apartment[]>;
  getApartmentByIdAndAgent(
    id: number,
    agent: string
  ): Promise<Apartment | null>;
}
