import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../dependencies/types";
import type { IPrismaCustomClient } from "../../../infrastructure/prisma/IPrismaCustomClient";
import { Element } from "../models/Element";
import { ElementType } from "../models/ElementType";
import { ElementCategory } from "../models/ElementCategory";
import type { IInventoryRepository } from "./inventory.repository.interface";

@injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    private readonly prisma: IPrismaCustomClient
  ) {}

  async getElementsBySpaceId(spaceId: number): Promise<Element[]> {
    const result = await this.prisma.client.element.findMany({
      where: {
        space_id: spaceId,
        is_active: true,
      },
      include: {
        element_type: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return result.map((element) => {
      const elementType = new ElementType({
        id: element.element_type.id,
        name: element.element_type.name,
        categoryId: element.element_type.category_id,
        description: element.element_type.description,
        isActive: element.element_type.is_active,
        createdAt: element.element_type.created_at,
        updatedAt: element.element_type.updated_at,
        category: new ElementCategory({
          id: element.element_type.category.id,
          name: element.element_type.category.name,
          description: element.element_type.category.description,
          icon: element.element_type.category.icon,
          createdAt: element.element_type.category.created_at,
          updatedAt: element.element_type.category.updated_at,
        }),
      });

      return new Element({
        id: element.id,
        uuid: element.uuid,
        spaceId: element.space_id,
        elementTypeId: element.element_type_id,
        name: element.name,
        brand: element.brand,
        model: element.model,
        material: element.material,
        color: element.color,
        condition: element.condition,
        notes: element.notes as Record<string, unknown> | null,
        dimensions: element.dimensions as Record<string, unknown> | null,
        isActive: element.is_active,
        createdAt: element.created_at,
        updatedAt: element.updated_at,
        elementType,
      });
    });
  }
}
