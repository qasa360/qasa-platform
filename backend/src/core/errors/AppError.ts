import { constants } from "http2";
import { appConfig } from "../../config/appConfig";
import type { IAppError } from "./IAppError";

export class AppError extends Error implements IAppError {
  #name: string = "AppError";
  #origin: string = "NotSpecified";
  #httpCode: number = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  #logWarning: boolean = false;
  #stack: string = "";
  #userId?: number;

  constructor({
    httpCode,
    message,
    logWarning = false,
    name,
    stack = "",
    origin = "NotSpecified",
    userId,
  }: {
    httpCode?: number;
    message: string;
    logWarning?: boolean;
    name?: string;
    origin?: string;
    stack?: string;
    userId?: number;
  }) {
    super(message);

    this.name = name || this.#name;
    this.httpCode = httpCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    this.logWarning = logWarning;
    this.stack = stack;
    this.origin = origin;
    this.userId = userId;
  }

  get httpCode(): number {
    return this.#httpCode;
  }

  set httpCode(httpCode: number) {
    if (httpCode === undefined || httpCode === 0) {
      this.#httpCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
      return;
    }

    this.#httpCode = httpCode;
  }

  get logWarning(): boolean {
    return this.#logWarning;
  }

  set logWarning(logWarning: boolean) {
    if (logWarning === undefined) {
      this.#logWarning = false;
      return;
    }

    this.#logWarning = logWarning;
  }

  get name(): string {
    return this.#name;
  }

  set name(name: string) {
    this.#name = name || this.#name;
  }

  get stack(): string {
    return this.#stack;
  }

  set stack(stack: string) {
    this.#stack = stack || this.#stack;
  }

  get origin(): string {
    return this.#origin;
  }

  set origin(origin: string) {
    this.#origin = origin || "NotSpecified";
  }

  get userId(): number | undefined {
    return this.#userId;
  }

  set userId(userId: number | undefined) {
    this.#userId = userId;
  }

  toJson(): Record<string, unknown> {
    return {
      name: this.name,
      origin: this.origin,
      message: this.message,
      httpCode: this.httpCode,
      stack:
        appConfig.logger.level.toLowerCase() !== "production"
          ? this.stack
          : undefined,
      userId:
        appConfig.logger.level.toLowerCase() !== "production"
          ? this.userId
          : undefined,
    };
  }
}
