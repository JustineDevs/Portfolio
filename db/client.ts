import { createClient } from "@libsql/client";
import "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";

const globalForDb = globalThis as typeof globalThis & {
  __portfolioDb?: ReturnType<typeof drizzle>;
};

type DatabaseEnv = {
  TURSO_DATABASE_URL?: string;
  NODE_ENV?: string;
};

export function resolveDatabaseUrl(env: DatabaseEnv = process.env) {
  const configuredUrl = env.TURSO_DATABASE_URL?.trim();
  if (configuredUrl) return configuredUrl;
  if (env.NODE_ENV === "production") {
    throw new Error("TURSO_DATABASE_URL is required in production.");
  }
  return "file:./db/local.db";
}

function createDb() {
  const url = resolveDatabaseUrl();

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return drizzle(client);
}

export const db = globalForDb.__portfolioDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__portfolioDb = db;
}
