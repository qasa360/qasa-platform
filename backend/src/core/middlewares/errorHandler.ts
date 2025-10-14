import type { ErrorRequestHandler } from 'express';
import { AppError } from '../../core/errors/appError';
import type { Logger } from '../logger/logger.interface';

export const createErrorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (error, _req, res, _next) => {
    const fallbackMessage = typeof error === 'string' ? error : error?.message ?? 'Unknown error';
    const normalizedError =
      error instanceof AppError
        ? error
        : new AppError(fallbackMessage, 500, 'APP_ERROR', typeof error === 'object' ? error : undefined);

    logger.error(normalizedError.message, {
      code: normalizedError.code,
      statusCode: normalizedError.statusCode,
      details: normalizedError.details
    });

    res.status(normalizedError.statusCode).json({
      error: {
        code: normalizedError.code,
        message: normalizedError.message
      }
    });
  };
