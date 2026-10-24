# PRD — Production Launchpad Part 2: Billing

*Idempotent Stripe billing for the starter kit. Timebox: 3 days.*

## Goal

Add production-grade Stripe billing to the starter kit: one-time purchases, recurring subscriptions, a customer portal, and a webhook handler that is safe against duplicate, out-of-order and missed events. Also add pricing and FAQ sections to the landing page. Primary goal is learning to implement billing properly; the first real consumer will be an event space booking site.

## Architecture decision

**Stripe is the source of truth** (Theo's stripe-recommendations approach). Webhooks are treated as a nudge: on any relevant event, fetch the customer's current state from the Stripe API and upsert it into Supabase. The same sync runs on the checkout success page. Event ordering stops mattering because every write reflects Stripe's latest state.

## Billing models

- **Recurring subscriptions:** require sign-up or login before checkout. No trials, proration, or plan upgrades in v1.
- **One-time purchases:** generic product + price, repeatable (e.g. booking a space once, then again later). Guest checkout allowed, no account needed. The template user adds domain logic like bookings.

**Payment methods:** cards only in v1. Delayed bank methods (ACH, SEPA) are out of scope, so a completed checkout always means paid.

## Data model

- **accounts:** owns the Stripe customer ID. One user per account for now; leaves room for multi-tenancy later.
- **purchases:** one row per one-time purchase. Stripe checkout session ID (unique), amount, product/price, status (paid / refunded), optional user/account, customer email, and a metadata field (e.g. event date).
- **subscriptions:** synced subscription state per account.
- **webhook\_events:** every incoming event with type, status, and error, used for logging and debugging.

## Flows

- **Subscribe:** pricing page → sign up / log in → straight back to checkout for the selected plan, with their info prefilled (the Stripe customer is created before checkout).
- **One-time purchase:** pricing page → Stripe Checkout as guest or user → success page triggers sync. Guests rely on the Stripe receipt email. If a guest signs up later with the same email, link their past purchases.
- **Manage subscription:** Stripe-hosted customer portal (cancel, change card, invoices), opened with one button.
- **Refunds (one-time):** refund webhook flips purchase status to refunded.

## Webhook handling rules

1. **Always verify webhook signatures.**
2. **Idempotent handlers:** unique constraint on the checkout session ID, plus insert-on-conflict-do-nothing. The database decides, not a check-then-insert in code.
3. **Processing rule:** critical work (verify → log → fetch from Stripe → upsert) runs synchronously, then returns 200. If it fails, return an error so Stripe retries. Non-critical slow work (e.g. emails) goes in Next.js `after()`, and is idempotent and logged. Add a hosted queue only once handlers do slow work.
4. **Subscribe only to required events.**
5. **Separate endpoints and secrets for test and live mode.**
6. **Log every event** to webhook\_events, so failures are never silent.

**Event list:** `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`, plus `price.created`, `price.updated`, `price.deleted`, `product.created`, `product.updated`, `product.deleted` for pricing cache invalidation. Async payment events are excluded because checkout is cards only.

## Reliability

- **Short downtime:** covered by Stripe's automatic retries (up to 3 days in live mode).
- **Checkout gaps:** covered by the success-page sync.
- **Missed events:** a daily reconciliation cron job lists recent Stripe events and re-runs the sync. It's safe to run repeatedly because the sync is idempotent.

## Pricing and FAQ sections

- **Pricing:** prices pulled from Stripe and cached by Next.js. The cache is refreshed periodically and invalidated by price/product webhooks. Never hardcode prices. Follows the part 1 design rules.
- **FAQ:** static landing page section. Defaults focus on product value (for this kit: vibe-coded sites and how to avoid them), plus refund and cancellation entries.

## Testing

- **Duplicates:** resend the same event twice with the Stripe CLI → exactly one row.
- **Failures:** force the handler to error → Stripe retry succeeds cleanly.
- **Out of order:** delay one event so a newer one lands first → final state is correct.
- **Race:** script sending the same signed event twice at once (`Promise.all`) → exactly one row.

## Stretch goals

- Own confirmation email, sent in `after()` with an "email sent" flag.

## Out of scope

- Multi-tenancy / organisations
- Trials, proration, plan upgrades
- Dead letter queues, BullMQ, hosted queues
- External logging service (e.g. Sentry)
- Booking-specific logic (dates, capacity, double-booking)
- Guest purchase lookup page

## Known limitations

- After-response work in `after()` is not retried by Stripe, so it must be loss-tolerant.
- Guests have no in-app purchase history until they create an account.

## Plan

- **Day 1:** Schema (accounts, purchases, subscriptions, webhook\_events), Stripe customer creation, checkout for both models, webhook endpoint with sync.
- **Day 2:** Subscribe flow with redirect back to checkout, customer portal, refunds, reconciliation cron, idempotency tests.
- **Day 3:** Pricing and FAQ sections with cached Stripe prices, polish. Stretch goal if ahead.

## Definition of done

- One-time and subscription checkouts work end to end in test mode
- All four idempotency tests pass
- Portal, refunds, and cron reconciliation work
- Pricing and FAQ sections pass part 1 design rules

