/* eslint-disable @typescript-eslint/no-explicit-any */
import type * as pg from "pg";

export interface IPgClient {
  query<T extends pg.QueryResultRow>({
    query,
    values,
    requestId,
  }: {
    query: string;
    values?: any[];
    requestId?: string;
  }): Promise<pg.QueryResult<T>>;

  // Main method for transactions
  executeInTransaction<T>({
    callback,
    requestId,
  }: {
    callback: () => Promise<T>;
    requestId?: string;
  }): Promise<T>;

  checkConnection(): Promise<boolean>;
}
