import assert from "node:assert/strict";
import { classifyPaths } from "../scripts/changed-surfaces.mjs";

assert.deepEqual(classifyPaths(["components/Navbar.tsx"]), {
  changed: true,
  runtime: true,
  personal: true,
  work: false,
  shared: false,
  runQuality: true,
  scope: "personal",
});

assert.equal(classifyPaths(["components/HorizontalScrollPage.tsx"]).scope, "work");
assert.equal(classifyPaths(["components/UnderConstructionPage.tsx"]).scope, "work");
assert.equal(classifyPaths(["app/globals.css"]).scope, "shared");
assert.equal(classifyPaths(["docs/deployment-path-strategy.md"]).scope, "documentation-only");
assert.equal(classifyPaths(["test/change-surfaces.test.ts"]).scope, "ci-only");
assert.equal(classifyPaths([".github/workflows/ci.yml"]).scope, "ci-only");

console.log("change-surfaces.test: ok");
