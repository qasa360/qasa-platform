import { ContainerModule } from "inversify";
import { STORAGE_TYPES } from "./types";
import type { IStorageService } from "./services/storage.service.interface";
import { StorageService } from "./services/storage.service";

export const StorageComponent = new ContainerModule((bind) => {
  bind<IStorageService>(STORAGE_TYPES.IStorageService)
    .to(StorageService)
    .inSingletonScope();
});
