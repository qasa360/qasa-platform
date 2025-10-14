import { appConfig } from "./config/appConfig";
import type { Logger } from "./core/logger/logger.interface";
import { appContainer } from "./dependencies/inversify.config";
import { CORE_TYPES } from "./dependencies/types";
import { app } from "./app";

const logger = appContainer.get<Logger>(CORE_TYPES.Logger);

const { port, host } = appConfig.server;

app.listen(port, host, () => {
  logger.info(`HTTP server listening at http://${host}:${port}`);
});
