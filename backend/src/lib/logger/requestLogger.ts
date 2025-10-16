import crypto from "crypto";
import { injectable, inject } from "inversify";
import { appConfig } from "../../config/appConfig";
import { LIBS_TYPES } from "../../dependencies/types";
import type { ILogger } from "./logger.interface";
import type { IRequestLogger } from "./requestLogger.interface";

@injectable()
export class RequestLogger implements IRequestLogger {
  private baseLogger: ILogger;

  public static readonly REQUEST_RESPONSE_THRESHOLD_MS =
    appConfig.logger.request.endpointThresholdMs;

  readonly REQUEST_ID_GENERATED = crypto.randomUUID();
  readonly REQUEST_PREFIX = `[REQUEST] ${this.REQUEST_ID_GENERATED}`;

  constructor(@inject(LIBS_TYPES.ILogger) logger: ILogger) {
    this.baseLogger = logger;
  }

  private getRequestPrefix(requestId?: string): string {
    return `[REQUEST] | ${requestId ? `${requestId}` : `${this.REQUEST_ID_GENERATED}`}`;
  }

  debug(message: string, requestId?: string): void {
    if (!appConfig.logger.request.enabled) return;
    this.baseLogger.debug(`${this.getRequestPrefix(requestId)} | ${message}`);
  }

  info(message: string, requestId?: string): void {
    if (!appConfig.logger.request.enabled) return;
    this.baseLogger.debug(`${this.getRequestPrefix(requestId)} | ${message}`);
  }

  warn(message: string, requestId?: string): void {
    if (!appConfig.logger.request.enabled) return;
    this.baseLogger.debug(`${this.getRequestPrefix(requestId)} | ${message}`);
  }

  error(error: Error, message?: string, requestId?: string): void {
    if (!appConfig.logger.request.enabled) return;
    this.baseLogger.error(
      error,
      `${this.getRequestPrefix(requestId)} | ${message}`
    );
  }

  /**
   * This function will log the duration of the metric
   * @param start This value is from process.hrtime.bigint(), must be in nanoseconds
   * @param metric This is the metric name
   * @returns This function will log the duration of the metric
   */
  logDuration({
    start,
    metric,
    message,
    thresholdMs,
    requestId,
  }: {
    start: bigint; // in nanoseconds
    metric: string;
    message?: string;
    thresholdMs?: number;
    requestId?: string;
  }): void {
    if (!appConfig.logger.request.enabled) return;

    // Get the duration in milliseconds
    const durationMs = this.getDurationMs(start);
    const messageBlock = message ? `| ${message}` : "";

    // Check threshold levels and get appropriate message
    const thresholdMessage = this.getThresholdMessage(durationMs, thresholdMs);

    // Build the final message
    const finalMessage = `${this.getRequestPrefix(
      requestId
    )} | [DURATION] time=${durationMs}ms | ${metric} ${messageBlock} ${thresholdMessage}`;

    // Log the message with appropriate level
    this.baseLogger.debug(finalMessage);
  }

  /**
   * Get threshold message based on duration and threshold
   * @param durationMs Duration in milliseconds
   * @param thresholdMs Threshold in milliseconds
   * @returns Threshold message with appropriate emoji
   */
  private getThresholdMessage(
    durationMs: number,
    thresholdMs?: number
  ): string {
    if (!thresholdMs) return "";

    const threshold150 = thresholdMs * 1.5; // 50% greater than threshold
    const threshold200 = thresholdMs * 2; // 100% greater than threshold

    if (durationMs < thresholdMs) {
      return `| 🟢 Below threshold`;
    } else if (durationMs >= thresholdMs && durationMs < threshold150) {
      return `| 🟡 Between 0-50% above threshold`;
    } else if (durationMs >= threshold150 && durationMs < threshold200) {
      return `| 🟠 Between 50-100% above threshold`;
    } else {
      return `| 🚨 Critical threshold exceeded`;
    }
  }

  private getDurationMs(start: bigint): number {
    const end = process.hrtime.bigint();
    const diff = end - start;
    // Convert nanoseconds to milliseconds with proper precision
    return Number(diff) / 1e6;
  }
}
