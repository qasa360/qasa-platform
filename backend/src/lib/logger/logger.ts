import "winston-daily-rotate-file";
import winston from "winston";
import { injectable } from "inversify";
import { format } from "logform";
import { appConfig } from "../../config/appConfig";
import type { ILogger } from "./logger.interface";

const { isProduction, appName, logger, isTest } = appConfig;

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: logger.general.logLevel,
    }),
  ],
};

if (!isTest) {
  // @ts-expect-error - winston-daily-rotate-file is not typed
  options.transports!.push(
    new winston.transports.DailyRotateFile({
      level: logger.general.logLevel,
      filename: `logs/${appName}-%DATE%.log`,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    })
  );
}

if (!isProduction) {
  options.format = format.simple();
}

@injectable()
export class Logger implements ILogger {
  #logger: winston.Logger = winston.createLogger(options);

  constructor() {
    if (isProduction) {
      this.#logger.exitOnError = false;
      this.#logger.on("error", () => {
        console.error("Error in logger");
      });
    } else {
      this.#logger.debug("Logging initialized at debug level");
    }
  }

  private formatMessage(message: string, userId?: string | number): string {
    return userId ? `[userId=${userId}] ${message}` : message;
  }

  debug(message: string, userId?: string | number): void {
    this.#logger.debug(this.formatMessage(message, userId));
  }

  info(message: string, userId?: string | number): void {
    this.#logger.info(this.formatMessage(message, userId));
  }

  warn(message: string, userId?: string | number): void {
    this.#logger.warn(this.formatMessage(message, userId));
  }

  error(error: Error, prefixMessage?: string, userId?: string | number): void {
    const userIdPart = userId ? `[userId=${userId}] ` : "";
    if (prefixMessage) {
      this.#logger.error(`${userIdPart}${prefixMessage} - ${error.message}`, {
        stack: error.stack,
      });
    } else {
      this.#logger.error(`${userIdPart}${error.message}`, {
        stack: error.stack,
      });
    }
  }
}
