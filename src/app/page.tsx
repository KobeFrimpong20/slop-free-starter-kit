import type { ReactNode } from "react";
import Link from "next/link";
import { buttonStyles } from "@/components/button";
import { rules } from "@/content/rules";

const repoUrl = "https://github.com/KobeFrimpong20/slop-free-starter-kit";

const included = [
  { name: "Design tokens", body: "Colours, type, and radii defined once in globals.css. Components use token names, never raw values." },
  { name: "Font pairing", body: "Lora for headings, Work Sans for body copy, IBM Plex Mono for code and data." },
  { name: "Supabase auth", body: "Login, signup, and email confirmation with server actions, plus a users table behind row-level security." },
  { name: "Lint guardrails", body: "Nine ESLint rules that catch the slop tells before they ship, with tests against a real slop baseline." },
];

const steps = [
  { label: "Copy the kit", command: "npx degit KobeFrimpong20/slop-free-starter-kit my-app" },
  {
    label: "Add your Supabase keys",
    command: "echo 'NEXT_PUBLIC_SUPABASE_URL=...\nNEXT_PUBLIC_SUPABASE_ANON_KEY=...' > .env.local",
  },
  { label: "Run it", command: "npm install && npm run dev" },
  { label: "Check for slop", command: "npm run lint" },
];

function Code({ children }: { children: ReactNode }) {
  return <code className="font-accent text-sm text-foreground">{children}</code>;
}

const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: "What does the kit check for?",
    answer: (
      <>
        <p>Two things. Nine ESLint rules in <Code>eslint-rules/</Code>, one per slop tell:</p>
        <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule.id}>{rule.name}</li>
          ))}
        </ul>
        <p className="mt-3">
          And the Impeccable detector, which looks for broader design problems such as low contrast, tiny text and
          generic hero layouts.
        </p>
      </>
    ),
  },
  {
    question: "How is the slop score worked out?",
    answer: (
      <p>
        <Code>npm run slop-score</Code> runs the nine rules and Impeccable, then adds 2 points for each tell it finds.
        A tell counts once whether it shows up one time or fifty. Loading more or fewer than three font families also
        counts as a tell. 0 is clean, and the score is capped at 100.
      </p>
    ),
  },
  {
    question: "How is the design check different from the linter?",
    answer: (
      <p>
        The linter reads your source code. <Code>npm run design:check</Code> runs Impeccable over <Code>src/</Code> and
        over the built pages at desktop and phone widths, so it catches what only shows up once a page renders, such
        as text contrast and text under 11px.
      </p>
    ),
  },
  {
    question: "What happens in CI?",
    answer: (
      <p>
        Every push and pull request runs lint, the rule tests, the slop score, the build and the design check. Lint,
        the tests, the build and the design check fail the run when they find something. The slop score is reported
        without failing; add <Code>--max</Code> to make it a gate, for example <Code>npm run slop-score -- --max 10</Code>.
      </p>
    ),
  },
  {
    question: "Can I turn a rule off?",
    answer: (
      <p>
        Yes. Set it to <Code>&quot;off&quot;</Code> in <Code>eslint.config.mjs</Code>. The slop score still runs every
        rule at its defaults, so it stays comparable between projects.
      </p>
    ),
  },
  {
    question: "Can I use different fonts?",
    answer: (
      <p>
        Yes. Swap the families in <Code>src/app/layout.tsx</Code> and keep one each for headings, body and accent.
        Components use the <Code>font-heading</Code>, <Code>font-body</Code> and <Code>font-accent</Code> classes, so
        nothing else changes.
      </p>
    ),
  },
  {
    question: "Does it work with AI coding agents?",
    answer: (
      <p>
        That&rsquo;s what it&rsquo;s for. <Code>AGENTS.md</Code> tells agents to run the checks before calling UI work
        done, and the Impeccable skill for Claude Code ships in <Code>.claude/skills</Code>, with hooks that run the
        detector after each edit.
      </p>
    ),
  },
];

export default function Home() {
  return (
    <>
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="font-heading text-lg text-foreground">
            Production Launchpad
          </Link>
          <div className="flex items-center gap-6 font-body text-sm">
            <a href="#faq" className="hidden text-muted-foreground hover:text-foreground sm:inline">
              FAQ
            </a>
            <a href="#get-started" className="hidden text-muted-foreground hover:text-foreground sm:inline">
              Get started
            </a>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Link href="/signup" className={buttonStyles("primary")}>
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 sm:pt-32">
          <h1 className="max-w-3xl font-heading text-5xl leading-tight text-foreground sm:text-6xl">
            Ship pages that don&rsquo;t look generated.
          </h1>
          <p className="mt-6 max-w-xl font-body text-lg text-muted-foreground">
            A Next.js and Supabase starter with design tokens and lint rules that catch the
            telltale signs of AI-built sites before they reach production.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#get-started" className={buttonStyles("primary")}>
              Clone the starter
            </a>
            <a href={repoUrl} className={buttonStyles("secondary")}>
              View on GitHub
            </a>
          </div>
        </section>

        <section id="faq" className="border-t border-border bg-surface">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1fr_2fr] md:gap-16">
            <h2 className="font-heading text-3xl text-foreground">Questions</h2>
            {/* A shared name keeps one answer open at a time. */}
            <div className="divide-y divide-border border-y border-border">
              {faqs.map((faq, i) => (
                <details key={faq.question} name="faq" open={i === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading text-xl text-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </summary>
                  <div className="max-w-prose pb-6 font-body text-muted-foreground">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-heading text-3xl text-foreground">What&rsquo;s in the box</h2>
          <dl className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {included.map((item) => (
              <div key={item.name} className="border-t-2 border-accent pt-4">
                <dt className="font-heading text-lg text-foreground">{item.name}</dt>
                <dd className="mt-2 font-body text-muted-foreground">{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="get-started" className="border-t border-border bg-surface">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="font-heading text-3xl text-foreground">Get started</h2>
            <ol className="mt-10 flex flex-col gap-6">
              {steps.map((step, i) => (
                <li key={step.label} className="grid gap-2 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-8">
                  <p className="font-body text-sm font-medium text-foreground">
                    <span className="mr-2 font-accent text-muted-foreground">{i + 1}.</span>
                    {step.label}
                  </p>
                  <pre className="overflow-x-auto rounded-sm bg-neutral-900 px-4 py-3 font-accent text-sm text-neutral-100">
                    <code>{step.command}</code>
                  </pre>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 font-body text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Built by Kwabena as a learning project.</p>
          <div className="flex gap-6">
            <Link href="/tokens" className="hover:text-foreground">
              Design tokens
            </Link>
            <a href={repoUrl} className="hover:text-foreground">
              GitHub
            </a>
            <a href={`${repoUrl}/issues`} className="hover:text-foreground">
              Report an issue
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
