import { PrismaClient as PrismaClientBase } from '@repo/database';

let prismaInstance: PrismaClientBase | null = null;

export function getPrismaClient(): PrismaClientBase {
  prismaInstance ??= new PrismaClientBase();

  return prismaInstance;
}

export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

export type PrismaClient = PrismaClientBase;
