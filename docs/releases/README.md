# Release notes (required)

Every Git tag that triggers [`.github/workflows/release.yml`](../../.github/workflows/release.yml) **must** have a matching file:

`docs/releases/<tag>.md` — e.g. `v0.1.0.md`, `v0.1.1.md`.

- **Before** you push a new tag: bump `package.json` `version`, add `docs/releases/v<version>.md` (use an existing file as a template), then run `pnpm run release:git-tag` and push the tag.
- The GitHub Release body **always** loads from that file; GitHub’s auto-generated notes are **appended** after your markdown.
- If the file is missing, the workflow **fails** and no release is created.
