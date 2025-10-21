import { inject, injectable } from "inversify";
import { APARTMENT_TYPES } from "../types";
import type { Apartment } from "../models/Apartment";
import type { IApartmentRepository } from "../repository/aparment.repository.interface";
import type { IApartmentService } from "./apartment.service.interface";

@injectable()
export class ApartmentService implements IApartmentService {
  constructor(
    @inject(APARTMENT_TYPES.IApartmentRepository)
    private readonly apartmentRepository: IApartmentRepository
  ) {}

  async getApartmentsByAgent(agent: string): Promise<Apartment[]> {
    return this.apartmentRepository.getApartmentsByAgent(agent);
  }
}
