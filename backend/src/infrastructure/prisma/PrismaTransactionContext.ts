import crypto from "crypto";
import { AsyncLocalStorage } from "async_hooks";
import type { PrismaClient } from "@prisma/client";
import type { IDbLogger } from "../../lib/logger/dbLogger.interface";

type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

interface TransactionState {
  client: PrismaTransactionClient | PrismaClient;
  isActive: boolean;
  startTime: number;
  id: string;
}

export class PrismaTransactionContext {
  private static storage = new AsyncLocalStorage<TransactionState>();
  private static readonly TRANSACTION_TIMEOUT = 60000;
  private static dbLogger?: IDbLogger;

  static setLogger(logger: IDbLogger): void {
    this.dbLogger = logger;
  }

  static getCurrentClient(): PrismaClient | null {
    const state = this.storage.getStore();
    if (!state) return null;

    const now = Date.now();
    const timeout = this.TRANSACTION_TIMEOUT;
    if (!state.isActive || now - state.startTime > timeout) {
      this.cleanupExpiredTransaction(state).catch(console.error);
      return null;
    }

    return state.client as PrismaClient;
  }

  static async runWithTransaction<T>(
    client: PrismaTransactionClient | PrismaClient,
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
    return state?.id ?? null;
  }

  private static async cleanupExpiredTransaction(
    state: TransactionState
  ): Promise<void> {
    if (!state.isActive) return;
    state.isActive = false;

    try {
      // Transaction clients don't have $disconnect, only regular clients do
      if ("$disconnect" in state.client) {
        await state.client.$disconnect();
      }
    } catch (err) {
      this.dbLogger?.error({
        message: "Failed to cleanup expired Prisma transaction",
        meta: {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          transactionId: state.id,
        },
      });
    }
  }
}
