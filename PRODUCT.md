# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Kwabena, a back-end and data engineer without strong design instincts who prompts AI to write frontend code. He needs to ship landing and auth pages fast without them taking on the generated look.

Secondary: developers in the same position who start a project from this kit with `npx degit` and borrow its rules.

## Product Purpose

Production Launchpad is a Next.js and Supabase starter kit for shipping tasteful landing and auth pages quickly. Its design guardrails stop AI output from drifting into slop. A secondary goal is to build design taste and document what was learned in public.

The design guardrails are done (`PRD_1_Design_GuardRails.md`). The active work is idempotent Stripe billing, with pricing and FAQ sections on the landing page (`PRD_2_Billing.md`). The first real consumer will be an event space booking site.

Success: the landing and login pages look tasteful and pass every design check, auth works end to end, and one-time and subscription checkouts work end to end with all four idempotency tests passing.

## Positioning

The kit enforces taste mechanically. Specific AI-slop tells are turned into ESLint rules, a slop score and a design check that run in CI, instead of being left as style advice.

## Operating Context

- Work happens in an AI coding agent. The rules, `npm run lint`, `npm run slop-score` and `npm run design:check` are the feedback loop.
- CI runs the same checks on every push and pull request.
- Each lint rule has a social-ready callout (the slop, the rule, the result) in `src/content/rules.ts`. The landing page FAQ lists the rules by name.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), Tailwind CSS 4, Supabase auth through `@supabase/ssr`, Node 22. Stripe for billing, with Stripe as the source of truth.
- Design tokens are defined once in `src/app/globals.css`, and components use token names only.
- Nine slop-free lint rules in `eslint-rules/`: typeface roles, no purple gradients, no nested cards, no emoji, actionable contact info, no massive shadows, specific CTAs, sentence-case testimonials, no fade-in content.
- Out of scope, and binding: user-selectable fonts, fake social proof detection, a full slop-detection engine, multi-tenancy or organisations, trials, proration, plan upgrades, dead letter queues and hosted queues, an external logging service, booking-specific logic, and a guest purchase lookup page.

## Brand Commitments

- Name: Production Launchpad.
- Font pairing is fixed: Lora for headings, Work Sans for body and UI, IBM Plex Mono for code and data. These were chosen from a small curated set of pairings.
- Voice: plain, specific and direct. Button labels name the action, never "Get started" or "Learn more".

## Evidence on Hand

- The nine rules and their callouts in `src/content/rules.ts`.
- A deliberately sloppy reference page in `eslint-rules/fixtures/slop.tsx` (not shipped).
- No testimonials, customers, usage numbers or press exist. Do not invent any.
- Prices come from Stripe. Never hardcode or invent them.

## Product Principles

1. A guardrail that doesn't fail the build is only a suggestion.
2. Show the slop next to the fix, so the lesson is learnable and shareable.
3. Speed for a non-designer comes from good defaults, not from more options.
4. Credibility comes from real, specific content, never fabricated social proof.
