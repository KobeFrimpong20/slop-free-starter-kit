# PRD — Production Launchpad v1

Oct 18, 2026 · @Kwabena

*Anti-slop SaaS starter kit with design guardrails. Timebox: 3 days.*

## Problem

AI-generated (vibe-coded) sites share a recognizable slop look: Inter for everything, purple-to-blue gradients, cards nested in cards, emoji overuse, fake-looking social proof. The tells are worst in combination. Kwabena is a back-end/data engineer without strong design instincts who relies on prompting AI for frontend, which produces exactly this look.

## Goal

A Next.js starter kit for shipping tasteful landing and auth pages fast, with design guardrails that stop AI output drifting into slop. Secondary goal: build design taste and document the learning publicly.

## Primary user

Kwabena himself. Others can borrow the rules, but v1 is built for his own speed and learning.

## Taste source

- Impeccable skill (GitHub) for design direction
- A small set of curated font pairings chosen by Kwabena

## Stack

- Next.js + Tailwind CSS
- Design tokens (fonts, colours, spacing) defined once in Tailwind config; components use token names only
- Supabase for auth and database

## In scope

1. Project setup with Tailwind tokens and curated font pairings
2. Supabase auth wired to designed login and signup screens
3. Landing page that passes all rules
4. Six lint rules:
   - **Typeface roles:** 2–3 font families max, each with a defined role (heading, body, accent/code); no hardcoded fonts outside tokens
   - **No purple gradients:** no purple stop in any linear, radial or conic gradient
   - **No nested cards**
   - **No emoji** (configurable limit, zero by default)
   - **Actionable contact info:** phone numbers, emails and links must be clickable
   - **No massive shadows:** nothing past `shadow-lg`; custom shadows blur 20px at most
5. Social-ready callouts: for each rule, the slop example, the rule, and the result

## Stretch goal (day 3, only if ahead)

- Slop score: a script that runs the lint rules and totals violations into a score

## Out of scope

- Security docs (RLS guides, env vars, API keys, public buckets)
- Code-quality guardrails
- Payments
- User-selectable fonts
- Full slop-detection engine
- Fake social proof detection (not lintable)
- RLS beyond a sane default on a single users table

## Plan

- **Day 1:** Setup, tokens, font pairings, Supabase auth. Have AI generate a rough landing page and note the slop.
- **Day 2:** Turn observed slop into the lint rules. Fix the landing page using them.
- **Day 3:** Login/signup screens, social callouts, polish. Slop score if time allows.

## Definition of done

- Landing page and login page look tasteful and pass all lint rules
- Auth works end to end via Supabase
- One callout per rule, ready to post

