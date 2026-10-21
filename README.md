# Production Launchpad

A Next.js and Supabase starter kit with design tokens and ESLint rules that catch the telltale signs of AI-generated sites: Inter everywhere, purple gradients, cards inside cards, emoji, stock CTAs and more. Break a rule and `npm run lint` fails.

## Stack

- Next.js 16 (App Router, Cache Components, Turbopack)
- Tailwind CSS 4, with design tokens in `src/app/globals.css`
- Supabase auth through `@supabase/ssr`
- Node 22 (see `.nvmrc`)

## Getting started

```bash
npx degit KobeFrimpong20/slop-free-starter-kit my-app
cd my-app
nvm use            # Node 22, from .nvmrc
npm install
npm run dev
```

On an Apple silicon Mac, check that `node -p process.arch` prints `arm64`. An x64 Node running under Rosetta installs the wrong native binaries for Next.js and Tailwind.

## Supabase setup

1. Create a Supabase project.
2. Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable or anon key>
   ```
3. Run `supabase/migrations/0001_users.sql`, either in the SQL editor or with `supabase db push`. It creates `public.users`, with row-level security so each user can only read and update their own row, plus a trigger that adds a row on signup.
4. Under **Auth → URL Configuration**, add `http://localhost:3000/auth/confirm` and your production URL as redirect URLs.
5. Under **Auth → Email Templates → Confirm signup**, point the link at the confirm route:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

Restart `npm run dev` after changing `.env.local`.

### What's wired up

| Path | What it does |
|---|---|
| `/login`, `/signup` | Forms backed by the server actions in `src/app/auth/actions.ts` |
| `/auth/confirm` | Verifies the email confirmation link |
| `/account` | Protected page that shows the signed-in user |
| `src/proxy.ts` | Refreshes the session on every request. Redirects signed-out users away from `/account` and signed-in users away from `/login` and `/signup`. |

## Design tokens

All colours, fonts and radii are defined once, in `src/app/globals.css`. Components use token classes, such as `bg-accent`, `text-muted-foreground`, `font-heading` and `rounded-md`, and never raw values. The full set is shown at `/tokens`.

| Role | Font | Class |
|---|---|---|
| Headings | Lora | `font-heading` |
| Body and UI | Work Sans | `font-body` |
| Code and data | IBM Plex Mono | `font-accent` |

Buttons use `<Button variant="primary" | "secondary">` from `src/components/button.tsx`. A link that should look like a button uses `buttonStyles(variant)`.

## Slop-free lint rules

The rules live in `eslint-rules/` and are switched on in `eslint.config.mjs`. They read JSX and JS only, not `.css` files.

| Rule | Fails on | Options |
|---|---|---|
| `typeface-roles` | `font-sans`, `font-serif`, `font-mono` and `font-[…]` classes, inline `fontFamily`, more than 3 font families loaded | `maxFamilies` (3) |
| `no-purple-gradient` | A purple stop in any Tailwind or CSS gradient, whether linear, radial or conic | none |
| `no-nested-cards` | A padded, rounded, filled or bordered surface inside another one | none |
| `limited-emoji` | Any emoji | `max` (0) |
| `actionable-contact-info` | An email, phone number or URL in JSX text that isn't wrapped in a link | none |
| `no-massive-shadows` | `shadow-xl` or larger, `drop-shadow-2xl`, a custom shadow blur over the limit | `maxBlur` (20) |
| `specific-cta` | Stock button labels such as "Get started", "Learn more" and "Submit" | `banned`, `allow` |
| `no-shouty-quotes` | Testimonials in Title Case or ALL CAPS | none |
| `no-fade-animations` | Fade-in or slide-in on page content (overlays are exempt) | none |

To configure a rule, add its options in `eslint.config.mjs`:

```js
"slop-free/limited-emoji": ["error", { max: 1 }],
"slop-free/specific-cta": ["error", { allow: ["continue"], banned: ["upgrade"] }],
```

### Testing the rules

```bash
npm run test:rules
```

`eslint-rules/rules.test.mjs` has valid and invalid cases for each rule. It also lints `eslint-rules/fixtures/slop.tsx` and checks that every rule fires on it. That fixture is a deliberately sloppy landing page, mirrored on the `feature/slopSite` branch.

To add a rule:

1. Add the rule file in `eslint-rules/rules/`.
2. Register it in `eslint-rules/index.mjs` and `eslint.config.mjs`.
3. Add test cases.
4. Add matching slop to the fixture.
5. Add the rule's copy to `src/content/rules.ts` so it shows on the landing page.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production |
| `uat` | Testing. Features merge here first. |
| `feature/*` | One branch per change, cut from `uat` |
| `feature/slopSite` | The unguided slop baseline, kept for comparison. Never merged. |

The flow is `feature/*`, then a PR into `uat`, then testing, then a PR from `uat` into `main`.

CI (`.github/workflows/ci.yml`) runs lint, the rule tests and the build on every push to `main`, `uat` and `feature/**`, and on every pull request into `main` or `uat`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build, including type checking |
| `npm run lint` | ESLint, including the slop-free rules |
| `npm run test:rules` | Tests for the slop-free rules |
