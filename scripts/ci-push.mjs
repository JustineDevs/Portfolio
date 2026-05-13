/**
 * Run the same checks as CI (`ci:check`); on success, run `git push` with any extra args.
 * Sets GIT_PUSH_BYPASS_HOOK so the pre-push hook does not run checks a second time.
 *
 * Usage:
 *   pnpm run ci:push
 *   pnpm run ci:push -- origin main
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const shell = process.platform === "win32";

const check = spawnSync("pnpm", ["run", "ci:check"], {
  stdio: "inherit",
  cwd: root,
  shell,
});
if (check.status !== 0 && check.status != null) {
  process.exit(check.status);
}
if (check.error) {
  console.error(check.error);
  process.exit(1);
}

const pushArgs = process.argv.slice(2);
const env = {
  ...process.env,
  GIT_PUSH_BYPASS_HOOK: "1",
};

console.log("\nci:push — git push", pushArgs.length ? pushArgs.join(" ") : "(default upstream)\n");

const push = spawnSync("git", ["push", ...pushArgs], {
  stdio: "inherit",
  cwd: root,
  env,
  shell,
});
if (push.status !== 0 && push.status != null) {
  process.exit(push.status);
}
if (push.error) {
  console.error(push.error);
  process.exit(1);
}
