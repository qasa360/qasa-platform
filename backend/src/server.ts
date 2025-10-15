import { appConfig } from "./config/appConfig";
import type { ILogger } from "./lib/logger/logger.interface";
import { appContainer } from "./dependencies/inversify.config";
import { LIBS_TYPES } from "./dependencies/types";
import { app } from "./app";

const logger = appContainer.get<ILogger>(LIBS_TYPES.ILogger);

const { port, host } = appConfig.server;

app.listen(port, host, () => {
  logger.info(`QASA Server is running on http://${host}:${port} 🚀`);
});
