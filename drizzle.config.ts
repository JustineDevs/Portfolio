import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { Config } from "drizzle-kit";

const root = process.cwd();
const envPath = resolve(root, ".env");
const envLocalPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  loadEnv({ path: envPath });
}
if (existsSync(envLocalPath)) {
  loadEnv({ path: envLocalPath, override: true });
}

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
if (!tursoUrl) {
  console.warn(
    "[drizzle.config] TURSO_DATABASE_URL is not set after loading .env and .env.local.\n" +
      "drizzle-kit migrate will apply to file:./db/local.db only (Turso Cloud will NOT change).\n" +
      "Set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN in .env or .env.local, then run pnpm db:migrate again.",
  );
}

const resolvedDbUrl = tursoUrl || "file:./db/local.db";

function migrateTargetDescription(url: string): string {
  if (url.startsWith("file:")) {
    return `${url} (local SQLite — not your Turso dashboard)`;
  }
  try {
    const { hostname } = new URL(url);
    return `remote ${hostname} (this is what drizzle-kit will migrate)`;
  } catch {
    return "remote URL (this is what drizzle-kit will migrate)";
  }
}

console.info("[drizzle.config] drizzle-kit DB:", migrateTargetDescription(resolvedDbUrl));

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: resolvedDbUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
} satisfies Config;
