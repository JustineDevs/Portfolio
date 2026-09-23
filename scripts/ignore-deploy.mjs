import process from "node:process";
import { classifyPaths, collectChangedPaths } from "./changed-surfaces.mjs";

const surface = process.argv[2];
if (!new Set(["personal", "work"]).has(surface)) {
  console.error("Usage: node scripts/ignore-deploy.mjs <personal|work>");
  process.exit(2);
}

const result = classifyPaths(collectChangedPaths());
const shouldBuild = result[surface];
console.log(`${surface} deployment ${shouldBuild ? "required" : "not required"} (${result.scope} change set)`);

// Hosting providers use exit 0 to ignore a build and exit 1 to continue it.
process.exit(shouldBuild ? 1 : 0);
