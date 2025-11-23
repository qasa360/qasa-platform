import type { ContainerModule } from "inversify";
import { HealthComponent } from "./health";
import { ApartmentComponent } from "./apartments";
import { InventoryComponent } from "./inventory";
import { AuditComponent } from "./audit";
import { AuditTemplateComponent } from "./auditTemplates";
import { StorageComponent } from "./storage";

export const componentModules: ContainerModule[] = [
  HealthComponent,
  ApartmentComponent,
  InventoryComponent,
  AuditComponent,
  AuditTemplateComponent,
  StorageComponent,
];
