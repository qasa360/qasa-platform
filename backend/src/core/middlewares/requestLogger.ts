import type { RequestHandler } from 'express';
import type { Logger } from '../logger/logger.interface';

export const createRequestLogger =
  (logger: Logger): RequestHandler =>
  (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('HTTP Request completed', {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration
      });
    });
    next();
  };
