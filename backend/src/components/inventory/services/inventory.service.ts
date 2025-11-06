import { inject, injectable } from "inversify";
import { INVENTORY_TYPES } from "../types";
import type { Element } from "../models/Element";
import type { IInventoryRepository } from "../repository/inventory.repository.interface";
import type { IInventoryService } from "./inventory.service.interface";

@injectable()
export class InventoryService implements IInventoryService {
  constructor(
    @inject(INVENTORY_TYPES.IInventoryRepository)
    private readonly inventoryRepository: IInventoryRepository
  ) {}

  async getInventoryBySpaceId(spaceId: number): Promise<Element[]> {
    return this.inventoryRepository.getElementsBySpaceId(spaceId);
  }
}
