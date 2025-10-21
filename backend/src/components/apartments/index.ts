import { ContainerModule } from "inversify";
import { APARTMENT_TYPES } from "./types";
import type { IApartmentRepository } from "./repository/aparment.repository.interface";
import { ApartmentRepository } from "./repository/apartment.repository";
import type { IApartmentService } from "./services/apartment.service.interface";
import { ApartmentService } from "./services/apartment.service";
import { ApartmentController } from "./apartment.controller";

export const ApartmentComponent = new ContainerModule((bind) => {
  bind(ApartmentController).toSelf();
  bind<IApartmentRepository>(APARTMENT_TYPES.IApartmentRepository)
    .to(ApartmentRepository)
    .inSingletonScope();
  bind<IApartmentService>(APARTMENT_TYPES.IApartmentService)
    .to(ApartmentService)
    .inSingletonScope();
});
