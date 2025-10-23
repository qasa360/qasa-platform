import type { Element } from "../models/Element";

export interface IInventoryRepository {
  getElementsBySpaceId(spaceId: number): Promise<Element[]>;
}
