import type { PrismaClient } from "@prisma/client";

export interface IPrismaCustomClient {
  client: PrismaClient;
  executeInTransaction<T>({
    callback,
    requestId,
  }: {
    callback: () => Promise<T>;
    requestId?: string;
  }): Promise<T>;
}
