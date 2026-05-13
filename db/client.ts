import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const globalForDb = globalThis as typeof globalThis & {
  __portfolioDb?: ReturnType<typeof drizzle>;
};

function createDb() {
  const configuredUrl = process.env.TURSO_DATABASE_URL?.trim();
  const url = configuredUrl ? configuredUrl : "file:./db/local.db";

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
