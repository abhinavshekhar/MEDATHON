import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function resolveDatabaseUrl() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (!url.startsWith("file:")) return url;

  const relative = url.replace("file:", "").replace(/^\.\//, "");
  const sourcePath = path.join(process.cwd(), relative);

  if (process.env.VERCEL) {
    const tmpPath = path.join("/tmp", "medathon-dev.db");
    if (!fs.existsSync(tmpPath) && fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, tmpPath);
    }
    return `file:${tmpPath}`;
  }

  return `file:${sourcePath}`;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: resolveDatabaseUrl() } },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
