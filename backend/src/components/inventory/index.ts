import { ContainerModule } from "inversify";
import { INVENTORY_TYPES } from "./types";
import type { IInventoryRepository } from "./repository/inventory.repository.interface";
import { InventoryRepository } from "./repository/inventory.repository";
import type { IInventoryService } from "./services/inventory.service.interface";
import { InventoryService } from "./services/inventory.service";
import { ElementController } from "./inventory.controller";

export const InventoryComponent = new ContainerModule((bind) => {
  bind(ElementController).toSelf();
  bind<IInventoryRepository>(INVENTORY_TYPES.IInventoryRepository)
    .to(InventoryRepository)
    .inSingletonScope();
  bind<IInventoryService>(INVENTORY_TYPES.IInventoryService)
    .to(InventoryService)
    .inSingletonScope();
});
