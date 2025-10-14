import { appConfig } from "./config/appConfig";
import type { ILogger } from "./core/logger/logger.interface";
import { appContainer } from "./dependencies/inversify.config";
import { CORE_TYPES } from "./dependencies/types";
import { app } from "./app";

const logger = appContainer.get<ILogger>(CORE_TYPES.Logger);

const { port, host } = appConfig.server;

app.listen(port, host, () => {
  logger.info(`QASA Server is running on http://${host}:${port} 🚀`);
});
