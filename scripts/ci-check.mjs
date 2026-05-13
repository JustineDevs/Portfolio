/**
 * Same gates as .github/workflows/ci.yml (lint, unit tests, production build).
 * Used by the pre-push hook and `pnpm run ci:check`.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const shell = process.platform === "win32";

const auth =
  process.env.AUTH_SECRET || "ci-placeholder-auth-secret-must-be-at-least-32-chars";
const baseEnv = { ...process.env, AUTH_SECRET: auth, CI: "true" };

function run(cmd, args, env = baseEnv) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    cwd: root,
    env,
    shell,
  });
  if (r.status !== 0 && r.status != null) {
    process.exit(r.status);
  }
  if (r.error) {
    console.error(r.error);
    process.exit(1);
  }
}

console.log("ci:check — lint\n");
run("pnpm", ["run", "lint"]);

console.log("\nci:check — unit tests\n");
run("pnpm", ["run", "test"]);

console.log("\nci:check — production build\n");
run("pnpm", ["run", "build"], { ...baseEnv, NODE_ENV: "production" });

console.log("\nci:check OK\n");
