import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";
import type * as pg from "pg";
import type { IDbLogger } from "../../lib/logger/dbLogger.interface";

interface TransactionState {
  client: pg.PoolClient;
  isActive: boolean;
  startTime: number;
  id: string;
}

export class TransactionContext {
  private static storage = new AsyncLocalStorage<TransactionState>();
  private static readonly TRANSACTION_TIMEOUT = 60000;
  private static dbLogger?: IDbLogger;

  static setLogger(logger: IDbLogger): void {
    this.dbLogger = logger;
  }

  static getTransactionTimeout(): number {
    return this.TRANSACTION_TIMEOUT;
  }

  static getCurrentClient(): pg.PoolClient | null {
    const state = this.storage.getStore();
    if (!state) {
      return null;
    }

    // Prevent hanging transactions
    const now = Date.now();
    const timeout = this.getTransactionTimeout();

    if (!state.isActive || now - state.startTime > timeout) {
      // Cleanup expired transactions to prevent connection leaks
      if (state.isActive) {
        // Fire-and-forget cleanup to avoid blocking the current flow
        this.cleanupExpiredTransaction(state).catch((error) => {
          // Use logger if available, fallback to console for critical errors
          if (this.dbLogger) {
            this.dbLogger.error({
              message: "Failed to cleanup expired transaction",
              meta: {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                transactionId: state.id,
              },
            });
          } else {
            console.error("Failed to cleanup expired transaction:", error);
          }
        });
      }
      return null;
    }

    return state.client;
  }

  private static async cleanupExpiredTransaction(
    state: TransactionState
  ): Promise<void> {
    // Atomic check-and-set to prevent race conditions
    if (!state.isActive) return;
    state.isActive = false;

    try {
      // Attempt to rollback the expired transaction (wait for completion)
      try {
        await state.client.query("ROLLBACK");
      } catch (rollbackError) {
        // Log rollback failure but continue with cleanup
        if (this.dbLogger) {
          this.dbLogger.error({
            message: "Failed to rollback expired transaction",
            meta: {
              error:
                rollbackError instanceof Error
                  ? rollbackError.message
                  : String(rollbackError),
              stack:
                rollbackError instanceof Error
                  ? rollbackError.stack
                  : undefined,
              transactionId: state.id,
            },
          });
        } else {
          console.error(
            "Failed to rollback expired transaction:",
            rollbackError
          );
        }
      }
    } finally {
      state.isActive = false;
    }
  }

  static runWithTransaction<T>(
    client: pg.PoolClient,
    fn: () => Promise<T>
  ): Promise<T> {
    const state: TransactionState = {
      client,
      isActive: true,
      startTime: Date.now(),
      id: crypto.randomUUID(),
    };

    return this.storage.run(state, fn);
  }

  static getCurrentTransactionId(): string | null {
    const state = this.storage.getStore();
    return state?.id || null;
  }

  static getCurrentState(): TransactionState | null {
    return this.storage.getStore() || null;
  }
}
