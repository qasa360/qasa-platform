/* eslint-disable @typescript-eslint/no-explicit-any */
import { constants } from "http2";
import type { ErrorRequestHandler, Request, Response } from "express";
import { environment } from "../../config/environment";
import { implementsIAppError, type IAppError } from "../errors/IAppError";
import type { ILogger } from "../../lib/logger/logger.interface";
import type { IMetrics } from "../../lib/metrics/metrics.interface";

export const createErrorHandler =
  (logger: ILogger, metrics: IMetrics): ErrorRequestHandler =>
  (err: any | IAppError, req, res, _next) => {
    // Handle specific error types first
    if (err.httpCode === constants.HTTP_STATUS_NOT_FOUND) {
      logger.debug(
        `HTTP Request | Page not found | path=${req.originalUrl} method=${req.method}`,
        err.userId
      );
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json(err.toJson());
    }

    if (err.name === "InvalidAuthToken") {
      return res.status(307).redirect(err.message);
    }

    if (err.name === "AuthenticationError") {
      logger.warn(
        `HTTP Request | Unauthorized | path=${req.originalUrl} method=${req.method}`,
        err.userId
      );
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).send({});
    }

    if (err.name === "UserBannedError") {
      logger.warn(
        `HTTP Request | User Banned | path=${req.originalUrl} method=${req.method}`,
        err.userId
      );
      return res.status(constants.HTTP_STATUS_FORBIDDEN).json(err.toJson());
    }

    // Handle generic errors
    logError(logger, req, err);
    recordMetrics(metrics, err);
    sendErrorResponse(res, err);
  };

const logError = (
  logger: ILogger,
  req: Request,
  err: any | IAppError
): void => {
  // Log raw errors that don't implement IAppError
  if (!implementsIAppError(err)) {
    logger.error(
      err,
      `request | url=${req.url} body=${JSON.stringify(req.body)} query=${JSON.stringify(req.query)}`,
      err.userId
    );
  }

  // Log warnings for production, 500 errors, or when explicitly requested
  if (
    environment.isProduction ||
    err.httpCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ||
    err.logWarning
  ) {
    logger.warn(
      `HTTP Request ${req.method} ${req.originalUrl} | code=${err.httpCode} from=${req.ip} | ${err.name}: ${err.message} | ${!err.stack ? "No stack available" : err.stack}`,
      err.userId
    );
  }

  // Log unauthorized attempts
  if (err.httpCode === constants.HTTP_STATUS_UNAUTHORIZED) {
    logger.warn(
      `HTTP Request | Unauthorized | path=${req.originalUrl} method=${req.method}`,
      err.userId
    );
  }
};

const recordMetrics = (metrics: IMetrics, err: any | IAppError): void => {
  if (implementsIAppError(err)) {
    metrics.increment("app_error");
  } else {
    metrics.increment("error_not_handled");
  }
};

const sendErrorResponse = (res: Response, err: any | IAppError): void => {
  res.status(err.httpCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);

  if (implementsIAppError(err)) {
    res.json(err.toJson());
    return;
  }

  res.json(
    Object.assign(err.data || {}, {
      error: err.name,
      message: "Unexpected error, please try again later, or contact support",
      description: err.message,
    })
  );
};
