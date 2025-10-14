import type { ContainerModule } from "inversify";
import { HealthComponent } from "./health";

export const componentModules: ContainerModule[] = [HealthComponent];
