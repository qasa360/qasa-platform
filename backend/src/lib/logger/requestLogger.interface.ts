export interface IRequestLogger {
  readonly REQUEST_ID_GENERATED: string;
  debug(message: string, requestId?: string): void;
  info(message: string, requestId?: string): void;
  warn(message: string, requestId?: string): void;
  error(error: Error, message?: string, requestId?: string): void;

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
  }): void;
}
