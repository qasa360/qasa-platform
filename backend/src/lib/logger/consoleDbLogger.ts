import { injectable } from "inversify";
import type { IDbLogger } from "./dbLogger.interface";

@injectable()
export class ConsoleDbLogger implements IDbLogger {
  info(params: {
    message: string;
    meta?: Record<string, unknown>;
    requestId?: string;
  }): void {
    console.log(
      `[DB-INFO] ${params.message}`,
      params.requestId ? `[${params.requestId}]` : "",
      params.meta
    );
  }

  warn(params: {
    message: string;
    meta?: Record<string, unknown>;
    requestId?: string;
  }): void {
    console.warn(
      `[DB-WARN] ${params.message}`,
      params.requestId ? `[${params.requestId}]` : "",
      params.meta
    );
  }

  error(params: {
    message: string;
    meta?: Record<string, unknown>;
    requestId?: string;
  }): void {
    console.error(
      `[DB-ERROR] ${params.message}`,
      params.requestId ? `[${params.requestId}]` : "",
      params.meta
    );
  }

  recordDuration(params: {
    start: bigint;
    metric: string;
    thresholdMs?: number;
    requestId?: string;
    meta?: Record<string, unknown>;
  }): void {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - params.start) / 1e6;

    if (!params.thresholdMs || durationMs >= params.thresholdMs) {
      console.log(
        `[DB-DURATION] ${params.metric}: ${durationMs.toFixed(2)}ms`,
        params.requestId ? `[${params.requestId}]` : "",
        params.meta
      );
    }
  }

  recordMemoryStats(params: {
    metric: string;
    requestId?: string;
    stats: {
      heapUsedMB: number;
      rssMB: number;
    };
    meta?: Record<string, unknown>;
  }): void {
    console.log(
      `[DB-MEMORY] ${params.metric}`,
      params.requestId ? `[${params.requestId}]` : "",
      `Heap: ${params.stats.heapUsedMB}MB, RSS: ${params.stats.rssMB}MB`,
      params.meta
    );
  }

  interpolateQuery(query: string, values?: unknown[]): string {
    if (!values || values.length === 0) {
      return query;
    }

    let result = query;
    values.forEach((value, index) => {
      const placeholder = `$${index + 1}`;
      const replacement =
        typeof value === "string" ? `'${value}'` : String(value);
      result = result.replace(placeholder, replacement);
    });

    return result;
  }
}
