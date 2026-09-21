import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";
import { resolveDatabaseUrl } from "@/db/config";

const globalForDb = globalThis as typeof globalThis & {
  __portfolioDb?: ReturnType<typeof drizzle>;
};

export { resolveDatabaseUrl } from "@/db/config";

function createDb() {
  const url = resolveDatabaseUrl();

  // The web transport is the production path and avoids bundling libSQL's
  // optional native addon into Turbopack route chunks. Keep the native node
  // transport only for the local file database used by tests and local tools.
  if (url.startsWith("file:")) {
    const nodeRequire = eval("require") as NodeRequire;
    const { createClient: createNodeClient } = nodeRequire("@libsql/client/node") as typeof import("@libsql/client/node");
    const { drizzle: drizzleNode } = nodeRequire("drizzle-orm/libsql/node") as typeof import("drizzle-orm/libsql/node");
    return drizzleNode(createNodeClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }));
  }

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
