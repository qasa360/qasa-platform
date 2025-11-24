import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";
import type { IDbLogger } from "../../lib/logger/dbLogger.interface";
import type { IMetrics } from "../../lib/metrics/metrics.interface";
import { LIBS_TYPES } from "../../dependencies/types";
import { PrismaTransactionContext } from "./PrismaTransactionContext";
import type { IPrismaCustomClient } from "./IPrismaCustomClient";

@injectable()
export class PrismaCustomClient implements IPrismaCustomClient {
  #metrics: IMetrics;
  #dbLogger: IDbLogger;
  #prisma: PrismaClient;
  #ORIGIN_NAME = "PrismaCustomClient";

  constructor(
    @inject(LIBS_TYPES.IMetrics) metrics: IMetrics,
    @inject(LIBS_TYPES.IDbLogger) dbLogger: IDbLogger
  ) {
    this.#metrics = metrics;
    this.#dbLogger = dbLogger;
    this.#prisma = new PrismaClient();
    PrismaTransactionContext.setLogger(dbLogger);
  }

  /**
   * Devuelve el cliente actual (global o transaccional).
   */
  get client(): PrismaClient {
    return PrismaTransactionContext.getCurrentClient() ?? this.#prisma;
  }

  /**
   * Ejecuta un bloque de código dentro de una transacción Prisma.
   * Compatible con el decorador @Transactional.
   */
  async executeInTransaction<T>({
    callback,
    requestId,
  }: {
    callback: () => Promise<T>;
    requestId?: string;
  }): Promise<T> {
    const existing = PrismaTransactionContext.getCurrentClient();
    if (existing) {
      this.#metrics.increment("db_transaction_nested");
      return callback();
    }

    this.#metrics.increment("db_transaction_new");
    const txStart = process.hrtime.bigint();
    let txId: string | null = null;

    try {
      const result = await this.#prisma.$transaction(async (tx) => {
        return PrismaTransactionContext.runWithTransaction(tx, async () => {
          txId = PrismaTransactionContext.getCurrentTransactionId();
          return callback();
        });
      });

      this.#metrics.increment("db_transaction_commit");
      return result;
    } catch (error) {
      this.#metrics.increment("db_transaction_rollback");
      this.#dbLogger.error({
        message: "db_transaction_error",
        meta: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          transactionId: txId,
        },
        requestId,
      });
      throw error;
    } finally {
      this.#dbLogger.recordDuration({
        start: txStart,
        metric: "db_transaction_execution",
        requestId,
        meta: {
          pool: "prisma",
          transactionId: txId ?? "unknown-tx-id",
        },
      });
    }
  }

  /**
   * Healthcheck simple.
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.#prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      this.#metrics.increment("db_connection_healthcheck_error");
      return false;
    }
  }
}
