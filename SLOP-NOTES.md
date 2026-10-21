# Slop notes — baseline draft

Source: `src/app/page.tsx` (this branch only), written the way an unguided prompt
produces a SaaS landing page. Each tell below maps to a lint rule (PRD rule #).

| # | Tell in the draft | Rule |
|---|---|---|
| 1 | Inter set inline on the root and again on the `h1`; no heading/body distinction | Typeface roles |
| 2 | Hero `from-purple-600 to-blue-600`; CTA band `from-indigo-600 via-purple-600 to-blue-500` | No purple-to-blue gradients |
| 3 | Feature grid: white card inside a gray rounded panel; icon in a tinted box inside the card | No nested cards |
| 4 | 🚀 ✨ 🎯 ❤️ 🎉 in headings and buttons, plus 🚀 🔒 ✨ as feature icons | Limited emoji |
| 5 | `hello@example.com` and `(555) 123-4567` are plain text, not `mailto:` / `tel:` | Actionable contact info |

Not lintable, noted for the callouts: invented testimonials ("Sarah Johnson, CEO"),
the "10,000+ teams" claim, and filler copy ("supercharge", "unlock their full
potential", "game-changing").

Next: turn each row into a lint rule (Day 2), then run them against the draft
to confirm every row fires.
