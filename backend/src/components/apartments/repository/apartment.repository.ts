import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Apartment } from "../models/Apartment";
import type { IApartmentRepository } from "./aparment.repository.interface";

@injectable()
export class ApartmentRepository implements IApartmentRepository {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    private readonly prisma: IPrismaCustomClient
  ) {}

  async getApartmentsByAgent(agent: string): Promise<Apartment[]> {
    const result = await this.prisma.client.apartment.findMany({
      where: {
        agent,
      },
      orderBy: {
        name: "asc",
      },
    });

    return result.map(
      (apartment) =>
        new Apartment(
          apartment.id,
          apartment.name,
          apartment.address,
          apartment.city,
          apartment.country,
          apartment.postal_code,
          apartment.neighborhood,
          apartment.agent,
          apartment.createdAt,
          apartment.updatedAt
        )
    );
  }

  async getApartmentByIdAndAgent(
    id: number,
    agent: string
  ): Promise<Apartment | null> {
    const result = await this.prisma.client.apartment.findUnique({
      where: {
        agent,
        id,
      },
    });

    if (!result) {
      return null;
    }

    return new Apartment(
      result.id,
      result.name,
      result.address,
      result.city,
      result.country,
      result.postal_code,
      result.neighborhood,
      result.agent,
      result.createdAt,
      result.updatedAt
    );
  }
}
