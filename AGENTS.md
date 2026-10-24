<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Product requirements

Work is scoped by PRDs in the repo root. Read the active one before starting a task.

- **`PRD_2_Billing.md` is the active work:** idempotent Stripe billing, plus pricing and FAQ sections on the landing page.
- **`PRD_1_Design_GuardRails.md` is complete, and its design rules always apply.** Every UI change, including billing pages and the pricing section, follows the design guardrails below.
- **Check work against PRD 2's definition of done** before calling it finished. That includes all four idempotency tests: duplicate events, a forced failure then retry, out-of-order events, and the concurrent race. Each must leave exactly one correct row and the correct final state.
- **PRD 2's out of scope list is binding.** Don't build, stub or suggest anything on it (multi-tenancy, trials, proration, plan upgrades, queues, external logging, booking logic, a guest purchase lookup page). If a task seems to need one, stop and ask.

## Frontend design

Use the Impeccable skill (`.claude/skills/impeccable`) for any UI work. `PRODUCT.md` records product context and `DESIGN.md` records the visual system. Read both before designing.

- **New UI:** run `/impeccable shape <feature>` before writing code.
- **After changing UI:** run `/impeccable critique`, then `/impeccable audit`, then `/impeccable polish` on what you touched.
- **Done means:** `npm run lint`, `npm run slop-score` and `npm run design:check` all pass. `design:check` needs a current `npm run build`.
- **Conflicts:** the slop-free lint rules in `eslint-rules/` win over Impeccable suggestions. If an Impeccable finding contradicts a deliberate choice in `DESIGN.md`, add an ignore with a reason rather than changing the design.
- If the system changes, update `DESIGN.md` in the same change (`/impeccable document`).
