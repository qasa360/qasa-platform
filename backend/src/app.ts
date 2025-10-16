import "reflect-metadata";
import cors, { type CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import { InversifyExpressServer } from "inversify-express-utils";
import { appConfig } from "./config/appConfig";
import { createErrorHandler } from "./core/middlewares/errorHandler";
import { notFoundHandler } from "./core/middlewares/notFoundHandler";
import { createRequestLogger } from "./core/middlewares/requestLogger";
import { appContainer } from "./dependencies/inversify.config";
import { LIBS_TYPES } from "./dependencies/types";
import type { ILogger } from "./lib/logger/logger.interface";
import type { IMetrics } from "./lib/metrics/metrics.interface";

const logger = appContainer.get<ILogger>(LIBS_TYPES.ILogger);
const metrics = appContainer.get<IMetrics>(LIBS_TYPES.IMetrics);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      appConfig.cors.allowedOrigins.includes("*") ||
      appConfig.cors.allowedOrigins.includes(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
};

const server = new InversifyExpressServer(appContainer);

server.setConfig((app) => {
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(createRequestLogger(logger));
});

server.setErrorConfig((app) => {
  app.use(notFoundHandler);
  app.use(createErrorHandler(logger, metrics));
});

export const app = server.build();

export default app;
