export interface IDbLogger {
  info(params: {
    message: string;
    meta?: Record<string, unknown>;
    requestId?: string;
  }): void;

  warn(params: {
    message: string;
    meta?: Record<string, unknown>;
    requestId?: string;
  }): void;

  error(params: {
    message: string;
    meta?: Record<string, unknown>;
    requestId?: string;
  }): void;

  recordDuration(params: {
    start: bigint;
    metric: string;
    thresholdMs?: number;
    requestId?: string;
    meta?: Record<string, unknown>;
  }): void;

  recordMemoryStats(params: {
    metric: string;
    requestId?: string;
    stats: {
      heapUsedMB: number;
      rssMB: number;
    };
    meta?: Record<string, unknown>;
  }): void;

  interpolateQuery(query: string, values?: unknown[]): string;
}
