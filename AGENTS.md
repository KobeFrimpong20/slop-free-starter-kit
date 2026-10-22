<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Frontend design

Use the Impeccable skill (`.claude/skills/impeccable`) for any UI work. `PRODUCT.md` records product context and `DESIGN.md` records the visual system. Read both before designing.

- **New UI:** run `/impeccable shape <feature>` before writing code.
- **After changing UI:** run `/impeccable critique`, then `/impeccable audit`, then `/impeccable polish` on what you touched.
- **Done means:** `npm run lint`, `npm run slop-score` and `npm run design:check` all pass. `design:check` needs a current `npm run build`.
- **Conflicts:** the slop-free lint rules in `eslint-rules/` win over Impeccable suggestions. If an Impeccable finding contradicts a deliberate choice in `DESIGN.md`, add an ignore with a reason rather than changing the design.
- If the system changes, update `DESIGN.md` in the same change (`/impeccable document`).
