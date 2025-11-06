import type { ContainerModule } from "inversify";
import { HealthComponent } from "./health";
import { ApartmentComponent } from "./apartments";
import { InventoryComponent } from "./inventory";

export const componentModules: ContainerModule[] = [
  HealthComponent,
  ApartmentComponent,
  InventoryComponent,
];
