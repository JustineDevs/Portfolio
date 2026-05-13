/**
 * Creates an annotated git tag v<version> from package.json "version".
 * Usage: node version/scripts/git-tag-from-package.js
 * Run from repository root. Fails if the tag already exists or curated release notes are missing.
 *
 * Required: docs/releases/v<version>.md (see docs/releases/README.md).
 */
const { readFileSync, existsSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const v = pkg.version;
const tag = `v${v}`;
const notesPath = path.join(root, "docs", "releases", `${tag}.md`);
if (!existsSync(notesPath)) {
  console.error(`Missing required release notes: docs/releases/${tag}.md`);
  console.error("Add that file before tagging (see docs/releases/README.md).");
  process.exit(1);
}
execSync(`git tag -a ${tag} -m "Release ${tag}"`, { stdio: "inherit", cwd: root });
