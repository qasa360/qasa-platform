/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaCustomClient } from "./PrismaCustomClient";

export function Transactional(
  _target: any,
  _property: string,
  descriptor: TypedPropertyDescriptor<any>
) {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const prisma: PrismaCustomClient = (this as any).prismaCustomClient;
    if (!prisma) throw new Error("@Transactional: prismaService not found");

    return await prisma.executeInTransaction({
      callback: async () => await original.apply(this, args),
    });
  };

  return descriptor;
}
