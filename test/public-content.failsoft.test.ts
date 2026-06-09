import assert from "node:assert/strict";

async function main() {
  const globalForDb = globalThis as typeof globalThis & { __portfolioDb?: unknown };
  const originalDb = globalForDb.__portfolioDb;
  const originalError = console.error;
  const errors: unknown[][] = [];

  globalForDb.__portfolioDb = {
    select() {
      throw new Error("db unavailable");
    },
  };

  console.error = (...args: unknown[]) => {
    errors.push(args);
  };

  try {
    const publicContent = await import("../lib/content/public");

    assert.deepEqual(await publicContent.getPublishedProjects(), []);
    assert.equal(await publicContent.getPublishedProjectBySlug("missing"), null);
    assert.deepEqual(await publicContent.getPublishedPosts(), []);
    assert.equal(await publicContent.getPublishedPostBySlug("missing"), null);
    assert.deepEqual(await publicContent.getPublishedPageSections("about"), []);
    assert.equal(await publicContent.getSiteSetting("privacyPolicyUrl"), null);
    assert.ok(errors.length >= 1);

    console.log("public-content.failsoft: ok");
  } finally {
    console.error = originalError;
    globalForDb.__portfolioDb = originalDb;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
