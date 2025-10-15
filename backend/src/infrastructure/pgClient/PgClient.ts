import { constants } from "http2";
import * as pg from "pg";
import { inject, injectable } from "inversify";
import { appConfig } from "../../config/appConfig";
import { AppError } from "../../core/errors/AppError";
import { LIBS_TYPES } from "../../dependencies/types";
import type { IDbLogger } from "../../lib/logger/dbLogger.interface";
import type { IMetrics } from "../../lib/metrics/metrics.interface";
import type { IPgClient } from "./IPgClient";
import { TransactionContext } from "./TransactionContext";

// Singleton pool to prevent connection leaks
let globalPool: pg.Pool | null = null;

function getGlobalPool(): pg.Pool {
  if (!globalPool) {
    if (!appConfig.database?.host) {
      throw new AppError({
        origin: "PgClient",
        name: "database_configuration_missing",
        message: "Database configuration is missing",
        httpCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      });
    }

    globalPool = new pg.Pool({
      host: appConfig.database.host,
      port: appConfig.database.port,
      user: appConfig.database.user,
      password: appConfig.database.password,
      database: appConfig.database.database,
      max: appConfig.database.pool.maxConnections,
      min: appConfig.database.pool.minConnections,
      idleTimeoutMillis: appConfig.database.pool.idleTimeoutMillis,
      connectionTimeoutMillis: appConfig.database.pool.connectionTimeoutMillis,
      maxUses: appConfig.database.pool.maxUses,
    });
  }

  return globalPool;
}

@injectable()
export class PgClient implements IPgClient {
  #metrics: IMetrics;
  #dbLogger: IDbLogger;
  #ORIGIN_NAME = "PgClient";

  constructor(
    @inject(LIBS_TYPES.IMetrics) metrics: IMetrics,
    @inject(LIBS_TYPES.IDbLogger) dbLogger: IDbLogger
  ) {
    this.#metrics = metrics;
    this.#dbLogger = dbLogger;

    // Initialize TransactionContext with logger for consistent logging
    TransactionContext.setLogger(dbLogger);
  }

  /**
   * Executes a promise with timeout and proper cleanup
   */
  private async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string,
    context?: Record<string, unknown>,
    requestId?: string
  ): Promise<T> {
    let timeoutId: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        this.#dbLogger.warn({
          message: "QUERY_TIMEOUT_EXCEEDED",
          meta: {
            timeoutMs,
            pool: context?.pool || "unknown",
            fingerprint: context?.fingerprint || "unknown",
          },
          requestId,
        });
        reject(new Error(timeoutMessage));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Priority-based connection selection: active transaction → pool
   */
  public async query<T extends pg.QueryResultRow>({
    query,
    values = [],
    requestId,
  }: {
    query: string;
    values?: unknown[];
    requestId?: string;
  }): Promise<pg.QueryResult<T>> {
    const hasForUpdate = /FOR UPDATE/i.test(query);

    try {
      const startGettingClient = process.hrtime.bigint();
      const txClient = TransactionContext.getCurrentClient();
      const poolClient = txClient ?? getGlobalPool();

      this.#dbLogger.recordDuration({
        start: startGettingClient,
        metric: "db_pool_acquire_wait",
        requestId,
        meta: {
          pool: txClient ? "tx" : "pool",
          transactionId: TransactionContext.getCurrentTransactionId(),
        },
      });

      const startQuery = process.hrtime.bigint();
      const result = await poolClient.query(query, values);
      const executedSql = this.#dbLogger.interpolateQuery(query, values);

      this.#dbLogger.recordDuration({
        start: startQuery,
        metric: "db_query",
        requestId,
        meta: {
          pool: txClient ? "tx" : "pool",
          transactionId: TransactionContext.getCurrentTransactionId(),
          executedSql,
          hasForUpdate,
        },
      });

      return result;
    } catch (error) {
      this.#metrics.increment("db_query_error");
      const transactionId = TransactionContext.getCurrentTransactionId();

      this.#dbLogger.error({
        message: "db_query_error",
        meta: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          transactionId,
        },
        requestId,
      });
      throw new AppError({
        origin: this.#ORIGIN_NAME,
        name: "db_query_error",
        message: `Failed to query database: ${
          error instanceof Error ? error.message : String(error)
        }`,
        stack: error instanceof Error ? error.stack : undefined,
        logWarning: true,
        httpCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Automatic transaction management with nested transaction support
   */
  public async executeInTransaction<T>({
    callback,
    requestId,
  }: {
    callback: () => Promise<T>;
    requestId?: string;
  }): Promise<T> {
    // Reuse existing transaction context
    const existingClient = TransactionContext.getCurrentClient();
    if (existingClient) {
      this.#metrics.increment("db_transaction_nested");
      return await callback();
    }

    const pool = getGlobalPool();
    this.#metrics.increment("db_transaction_new");

    const acquireTimeout = appConfig.database.pool.acquireTimeoutMillis;
    const acquireStart = process.hrtime.bigint();
    const client = await this.executeWithTimeout(
      pool.connect(),
      acquireTimeout,
      `Connection acquisition timeout after ${acquireTimeout}ms`,
      {
        pool: "pool",
        transactionId: null,
        acquireTimeout,
      },
      requestId
    );

    this.#dbLogger.recordDuration({
      start: acquireStart,
      metric: "db_pool_acquire_wait",
      meta: {
        pool: "pool",
        transactionId: null,
        acquireTimeout,
      },
      requestId,
    });

    const txStart = process.hrtime.bigint();
    let actualTransactionId: string | null = null;

    try {
      const beginStart = process.hrtime.bigint();
      await client.query("BEGIN");
      this.#dbLogger.recordDuration({
        start: beginStart,
        metric: "db_transaction_begin",
        requestId,
        meta: {
          pool: "pool",
          transactionId: null,
        },
      });

      const result = await TransactionContext.runWithTransaction(client, () => {
        // Capture the transaction ID inside the transaction context
        actualTransactionId = TransactionContext.getCurrentTransactionId();
        return callback();
      });

      const commitStart = process.hrtime.bigint();
      await client.query("COMMIT");
      this.#dbLogger.recordDuration({
        start: commitStart,
        metric: "db_transaction_commit",
        requestId,
        meta: {
          pool: "pool",
          transactionId: actualTransactionId,
        },
      });

      this.#metrics.increment("db_transaction_commit");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
        this.#metrics.increment("db_transaction_rollback");
      } catch (rollbackError) {
        this.#dbLogger.error({
          message: "rollback_failed",
          meta: {
            error:
              rollbackError instanceof Error
                ? rollbackError.message
                : String(rollbackError),
            stack:
              rollbackError instanceof Error ? rollbackError.stack : undefined,
            transactionId: actualTransactionId,
          },
          requestId,
        });
        this.#metrics.increment("db_rollback_error");
      }
      throw error;
    } finally {
      try {
        client.release();
        this.logTransactionFinalTiming({
          txStart,
          actualTransactionId: actualTransactionId ?? "unknown-tx-id",
          requestId,
        });
      } catch (releaseError) {
        this.#dbLogger.error({
          message: "RELEASE_FAILED",
          meta: {
            error:
              releaseError instanceof Error
                ? releaseError.message
                : String(releaseError),
            stack:
              releaseError instanceof Error ? releaseError.stack : undefined,
            transactionId: actualTransactionId ?? "unknown-tx-id",
          },
          requestId,
        });
        this.#metrics.increment("db_release_error");
      }
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const pool = getGlobalPool();
      await pool.query("SELECT 1");
      return true;
    } catch (error) {
      this.#metrics.increment("db_connection_healthcheck_error");
      return false;
    }
  }

  private logTransactionFinalTiming({
    txStart,
    actualTransactionId,
    requestId,
  }: {
    txStart: bigint;
    actualTransactionId: string;
    requestId?: string;
  }): void {
    this.#dbLogger.recordDuration({
      start: txStart,
      metric: "db_transaction_execution",
      thresholdMs: appConfig.database.logging.transactionThresholdMs,
      requestId,
      meta: {
        pool: "pool",
        transactionId: actualTransactionId,
      },
    });
  }
}
