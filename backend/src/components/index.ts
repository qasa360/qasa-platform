import type { ContainerModule } from "inversify";
import { HealthComponent } from "./health";
import { ApartmentComponent } from "./apartments";

export const componentModules: ContainerModule[] = [
  HealthComponent,
  ApartmentComponent,
];
