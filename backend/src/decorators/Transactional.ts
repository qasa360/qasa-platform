/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IRequestLogger } from "../lib/logger/requestLogger.interface";
import type { IPgClient } from "../infrastructure/pgClient/IPgClient";

export function Transactional(
  _target: any,
  _propertyName: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const pgClient: IPgClient = (this as any).pgClient;
    const requestLogger: IRequestLogger = (this as any).requestLogger;

    const requestId = requestLogger?.REQUEST_ID_GENERATED
      ? requestLogger.REQUEST_ID_GENERATED
      : undefined;

    if (!pgClient) {
      throw new Error("@Transactional: pgClient not found in service context");
    }

    return await pgClient.executeInTransaction({
      callback: async () => {
        return await originalMethod.apply(this, args);
      },
      requestId,
    });
  };

  return descriptor;
}
