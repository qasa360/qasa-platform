export interface IPrismaCustomClient {
  executeInTransaction<T>({
    callback,
    requestId,
  }: {
    callback: () => Promise<T>;
    requestId?: string;
  }): Promise<T>;
}
