import { ContainerModule } from "inversify";
import { HealthController } from "./application/health.controller";
import type { IHealthService } from "./domain/healthService.interface";
import { DefaultHealthService } from "./infrastructure/health.service";
import { HEALTH_TYPES } from "./types";

export const HealthComponent = new ContainerModule((bind) => {
  bind(HealthController).toSelf();
  bind<IHealthService>(HEALTH_TYPES.HealthService)
    .to(DefaultHealthService)
    .inSingletonScope();
});
