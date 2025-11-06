import type { Element } from "../models/Element";

export interface IInventoryService {
  getInventoryBySpaceId(spaceId: number): Promise<Element[]>;
}
