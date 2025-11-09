import type { Apartment } from "../models/Apartment";

export interface IApartmentService {
  getApartmentsByAgent(agent: string): Promise<Apartment[]>;
  getApartmentByIdAndAgent(
    id: number,
    agent: string
  ): Promise<Apartment | null>;
  getApartmentWithSpacesAndElements(apartmentId: number): Promise<{
    id: number;
    spaces: Array<{
      id: number;
      spaceTypeId: number;
      elements: Array<{
        id: number;
        elementTypeId: number;
      }>;
    }>;
  } | null>;
}
