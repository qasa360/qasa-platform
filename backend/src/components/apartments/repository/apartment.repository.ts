import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Space } from "../models/Space";
import type { SpaceType } from "../models/SpaceType";
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
        new Apartment({
          id: apartment.id,
          name: apartment.name,
          address: apartment.address,
          city: apartment.city,
          country: apartment.country,
          postalCode: apartment.postal_code,
          neighborhood: apartment.neighborhood,
          agent: apartment.agent,
          isActive: apartment.is_active,
          createdAt: apartment.created_at,
          updatedAt: apartment.updated_at,
        })
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

    return new Apartment({
      id: result.id,
      name: result.name,
      address: result.address,
      city: result.city,
      country: result.country,
      postalCode: result.postal_code,
      neighborhood: result.neighborhood,
      agent: result.agent,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  async getApartmentWithSpacesByIdAndAgent(
    id: number,
    agent: string
  ): Promise<Apartment | null> {
    const result = await this.prisma.client.apartment.findUnique({
      where: {
        agent,
        id,
      },
      include: {
        spaces: true,
      },
    });

    if (!result) {
      return null;
    }

    return new Apartment({
      id: result.id,
      name: result.name,
      address: result.address,
      city: result.city,
      country: result.country,
      postalCode: result.postal_code,
      neighborhood: result.neighborhood,
      agent: result.agent,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      spaces: result.spaces.map(
        (space) =>
          new Space({
            id: space.id,
            uuid: space.uuid,
            apartmentId: space.apartment_id,
            name: space.name,
            spaceType: space.space_type as SpaceType,
            m2: space.m2 || undefined,
            order: space.order || undefined,
            notes: space.notes || undefined,
            createdAt: space.created_at,
            updatedAt: space.updated_at,
          })
      ),
    });
  }
}
