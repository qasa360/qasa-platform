import "reflect-metadata";
import { Container } from "inversify";
import { appConfig } from "../config/appConfig";
import { ConsoleLogger } from "../core/logger/consoleLogger";
import type { ILogger } from "../core/logger/logger.interface";
import { componentModules } from "../components";
import { CORE_TYPES } from "./types";

export const createContainer = (): Container => {
  const container = new Container({
    autoBindInjectable: true,
    defaultScope: "Singleton",
  });

  container.bind(CORE_TYPES.AppConfig).toConstantValue(appConfig);
  container
    .bind<ILogger>(CORE_TYPES.Logger)
    .toDynamicValue(() => new ConsoleLogger(appConfig.logger.level));

  for (const module of componentModules) {
    container.load(module);
  }

  return container;
};

export const appContainer = createContainer();
