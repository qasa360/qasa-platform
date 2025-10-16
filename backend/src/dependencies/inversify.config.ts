import "reflect-metadata";
import { Container } from "inversify";
import { appConfig } from "../config/appConfig";
import { componentModules } from "../components";
import { PgClient } from "../infrastructure/pgClient/PgClient";
import type { IPgClient } from "../infrastructure/pgClient/IPgClient";
import { ConsoleMetrics } from "../lib/metrics/consoleMetrics";
import type { IMetrics } from "../lib/metrics/metrics.interface";
import { ConsoleDbLogger } from "../lib/logger/consoleDbLogger";
import type { IDbLogger } from "../lib/logger/dbLogger.interface";
import { Logger } from "../lib/logger/logger";
import type { ILogger } from "../lib/logger/logger.interface";
import { RequestLogger } from "../lib/logger/requestLogger";
import type { IRequestLogger } from "../lib/logger/requestLogger.interface";
import { PrismaCustomClient } from "../infrastructure/prisma/PrismaCustomClient";
import type { IPrismaCustomClient } from "../infrastructure/prisma/IPrismaCustomClient";
import { CORE_TYPES, INFRASTRUCTURE_TYPES, LIBS_TYPES } from "./types";

export const createContainer = (): Container => {
  const container = new Container({
    autoBindInjectable: true,
    defaultScope: "Singleton",
  });

  // Core bindings
  container.bind(CORE_TYPES.AppConfig).toConstantValue(appConfig);
  container.bind<ILogger>(LIBS_TYPES.ILogger).to(Logger).inSingletonScope();

  // Lib bindings (Metrics & DB Logger)
  container
    .bind<IMetrics>(LIBS_TYPES.IMetrics)
    .to(ConsoleMetrics)
    .inSingletonScope();
  container
    .bind<IDbLogger>(LIBS_TYPES.IDbLogger)
    .to(ConsoleDbLogger)
    .inSingletonScope();
  container
    .bind<IRequestLogger>(LIBS_TYPES.IRequestLogger)
    .to(RequestLogger)
    .inSingletonScope();

  // Infrastructure bindings (PgClient)
  container
    .bind<IPgClient>(INFRASTRUCTURE_TYPES.IPgClient)
    .to(PgClient)
    .inSingletonScope();

  // Infrastructure bindings (PrismaCustomClient)
  container
    .bind<IPrismaCustomClient>(INFRASTRUCTURE_TYPES.IPrismaCustomClient)
    .to(PrismaCustomClient)
    .inSingletonScope();

  // Component modules
  for (const module of componentModules) {
    container.load(module);
  }

  return container;
};

export const appContainer = createContainer();
