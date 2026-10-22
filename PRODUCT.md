# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Kwabena, a back-end and data engineer without strong design instincts who prompts AI to write frontend code. He needs to ship landing and auth pages fast without them taking on the generated look.

Secondary: developers in the same position who start a project from this kit with `npx degit` and borrow its rules.

## Product Purpose

Production Launchpad is a Next.js and Supabase starter kit for shipping tasteful landing and auth pages quickly. Its design guardrails stop AI output from drifting into slop. A secondary goal is to build design taste and document what was learned in public.

Success: the landing and login pages look tasteful, pass every lint rule, and auth works end to end.

## Positioning

The kit enforces taste mechanically. Specific AI-slop tells are turned into ESLint rules and a weighted slop score that fail the build, instead of being left as style advice.

## Operating Context

- Work happens in an AI coding agent. The rules, `npm run lint`, `npm run slop-score` and `npm run design:check` are the feedback loop.
- CI runs the same checks on every push and pull request.
- Each lint rule has a social-ready callout (the slop, the rule, the result) in `src/content/rules.ts`, shown on the landing page.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), Tailwind CSS 4, Supabase auth through `@supabase/ssr`, Node 22.
- Design tokens are defined once in `src/app/globals.css`, and components use token names only.
- Nine slop-free lint rules in `eslint-rules/`: typeface roles, no purple gradients, no nested cards, no emoji, actionable contact info, no massive shadows, specific CTAs, sentence-case testimonials, no fade-in content.
- Out of scope: payments, user-selectable fonts, fake social proof detection, a full slop-detection engine, and RLS beyond the single users table.

## Brand Commitments

- Name: Production Launchpad.
- Font pairing is fixed: Lora for headings, Work Sans for body and UI, IBM Plex Mono for code and data. These were chosen from a small curated set of pairings.
- Voice: plain, specific and direct. Button labels name the action, never "Get started" or "Learn more".

## Evidence on Hand

- The nine rules and their callouts in `src/content/rules.ts`.
- A deliberately sloppy reference page in `eslint-rules/fixtures/slop.tsx` (not shipped).
- No testimonials, customers, usage numbers or press exist. Do not invent any.

## Product Principles

1. A guardrail that doesn't fail the build is only a suggestion.
2. Show the slop next to the fix, so the lesson is learnable and shareable.
3. Speed for a non-designer comes from good defaults, not from more options.
4. Credibility comes from real, specific content, never fabricated social proof.
