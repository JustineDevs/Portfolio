export type DatabaseEnv = {
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
