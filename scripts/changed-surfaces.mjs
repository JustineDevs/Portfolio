import { appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const workOnlyFiles = new Set([
  "components/HorizontalScrollPage.tsx",
  "components/UnderConstructionPage.tsx",
]);

const docsOnlyPrefixes = [
  ".internal/",
  ".omx/",
  ".codex/",
  "docs/",
  "planning/",
];

const docsOnlyFiles = new Set([
  "CHANGELOG.md",
  "DESIGN.md",
  "LICENSE",
  "README.md",
]);

const nonDeployPrefixes = [
  ".github/",
  ".devcontainer/",
  ".cursor/",
  ".internal/",
  ".omx/",
  "docs/",
  "planning/",
  "scripts/",
  "test/",
  "version/",
];

const nonDeployFiles = new Set([
  ".dev.vars.example",
  ".env.example",
  "AGENTS.md",
  "OPTIMIZATION_GUIDE.md",
]);

const personalPrefixes = [
  "app/about/",
  "app/blog/",
  "app/changelog/",
  "app/experience/",
  "app/license/",
  "app/privacy/",
  "app/projects/",
  "app/terms/",
  "components/sections/",
];

const personalFiles = new Set([
  "components/Footer.tsx",
  "components/HomeEntry.tsx",
  "components/HomePageClient.tsx",
  "components/Navbar.tsx",
  "components/SiteOnboarding.tsx",
]);

function isDocsOnly(path) {
  return docsOnlyFiles.has(path) || docsOnlyPrefixes.some((prefix) => path.startsWith(prefix));
}

function isPersonalOnly(path) {
  return personalFiles.has(path) || personalPrefixes.some((prefix) => path.startsWith(prefix));
}

function isNonDeploy(path) {
  return nonDeployFiles.has(path) || nonDeployPrefixes.some((prefix) => path.startsWith(prefix));
}

export function classifyPaths(paths) {
  const changed = paths.map((path) => path.trim()).filter(Boolean);
  const ciPaths = changed.filter((path) => !isDocsOnly(path));
  const runtimePaths = ciPaths.filter((path) => !isNonDeploy(path));
  let personal = false;
  let work = false;
  let shared = false;

  for (const path of runtimePaths) {
    if (workOnlyFiles.has(path)) {
      work = true;
    } else if (isPersonalOnly(path)) {
      personal = true;
    } else {
      // Unknown and shared files are intentionally treated as affecting both
      // deployments so a new shared dependency cannot leave one host stale.
      shared = true;
      personal = true;
      work = true;
    }
  }

  return {
    changed: changed.length > 0,
    runtime: runtimePaths.length > 0,
    personal,
    work,
    shared,
    runQuality: ciPaths.length > 0,
    scope: runtimePaths.length === 0 ? (ciPaths.length === 0 ? "documentation-only" : "ci-only") : shared ? "shared" : personal && work ? "personal-and-work" : personal ? "personal" : "work",
  };
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

export function collectChangedPaths() {
  const explicit = process.env.CI_CHANGED_FILES;
  if (explicit) return explicit.split(/\r?\n/);

  const head = process.env.GITHUB_SHA || "HEAD";
  let base = process.env.GITHUB_EVENT_BEFORE;
  if (!base || /^0+$/.test(base)) {
    base = `${head}^`;
  }

  if (process.env.GITHUB_EVENT_NAME === "pull_request" && process.env.GITHUB_BASE_REF) {
    const baseRef = `origin/${process.env.GITHUB_BASE_REF}`;
    base = git(["merge-base", head, baseRef]);
  }

  return git(["diff", "--name-only", base, head]).split(/\r?\n/);
}

function writeOutputs(result) {
  const outputs = [
    ["personal", String(result.personal)],
    ["work", String(result.work)],
    ["shared", String(result.shared)],
    ["run_quality", String(result.runQuality)],
    ["scope", result.scope],
  ];
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) appendFileSync(outputFile, `${outputs.map(([key, value]) => `${key}=${value}`).join("\n")}\n`);
  console.log(`change-surface: ${result.scope}`);
  for (const [key, value] of outputs) console.log(`${key}=${value}`);
}

if (resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])) {
  writeOutputs(classifyPaths(collectChangedPaths()));
}
