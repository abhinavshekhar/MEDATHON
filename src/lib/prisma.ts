import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const options: ConstructorParameters<typeof PrismaClient>[0] = {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  };

  if (url.startsWith("file:./")) {
    const dbPath = path.join(process.cwd(), url.replace("file:", ""));
    options.datasources = { db: { url: `file:${dbPath}` } };
  }

  return new PrismaClient(options);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;