/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPrismaCustomClient } from "./IPrismaCustomClient";

export function Transactional(
  _target: any,
  _property: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const prisma: IPrismaCustomClient = (this as any).prismaCustomClient;
    if (!prisma) {
      throw new Error(
        "@Transactional: prismaCustomClient not found. Ensure the service has a public 'prismaCustomClient' property of type IPrismaCustomClient."
      );
    }

    return await prisma.executeInTransaction({
      callback: async () => await original.apply(this, args),
    });
  };

  return descriptor;
}
