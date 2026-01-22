import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // 本番環境: Tursoを使用
  // 開発環境: ローカルSQLiteを使用
  const isProduction = process.env.NODE_ENV === "production";
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  const adapter = new PrismaLibSql({
    url: isProduction && tursoUrl ? tursoUrl : "file:prisma/dev.db",
    authToken: isProduction && tursoToken ? tursoToken : undefined,
  });

  return new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
