/**
 * Creates an annotated git tag v<version> from package.json "version".
 * Usage: node version/scripts/git-tag-from-package.js
 * Run from repository root. Fails if the tag already exists.
 */
const { readFileSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const v = pkg.version;
const tag = `v${v}`;
execSync(`git tag -a ${tag} -m "Release ${tag}"`, { stdio: "inherit", cwd: root });
