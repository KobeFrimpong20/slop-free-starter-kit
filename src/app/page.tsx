import Link from "next/link";
import { buttonStyles } from "@/components/button";
import { RuleDetails } from "@/components/rule-details";
import { RuleTour } from "@/components/rule-tour";
import { ruleGroups, ruleNumber, rules } from "@/content/rules";

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

export default function Home() {
  return (
    <>
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="font-heading text-lg text-foreground">
            Production Launchpad
          </Link>
          <div className="flex items-center gap-6 font-body text-sm">
            <a href="#rules" className="hidden text-muted-foreground hover:text-foreground sm:inline">
              Rules
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

        <section id="rules" className="border-t border-border bg-surface">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="font-heading text-3xl text-foreground">Nine rules, enforced by the linter</h2>
            <p className="mt-3 max-w-xl font-body text-muted-foreground">
              Each rule targets one slop tell. Break one and{" "}
              <code className="font-accent text-sm text-foreground">npm run lint</code> fails.
            </p>

            {/* Phones: the plain list, grouped. */}
            <div className="mt-12 flex flex-col gap-10 md:hidden">
              {ruleGroups.map((group) => (
                <div key={group}>
                  <h3 className="font-accent text-xs uppercase tracking-widest text-muted-foreground">{group}</h3>
                  <ol className="mt-3 divide-y divide-border border-y border-border">
                    {rules.map((rule, i) =>
                      rule.group === group ? (
                        <li key={rule.id} className="flex flex-col gap-4 py-6">
                          <span className="font-accent text-sm text-muted-foreground">{ruleNumber(i)}</span>
                          <RuleDetails rule={rule} />
                        </li>
                      ) : null,
                    )}
                  </ol>
                </div>
              ))}
            </div>

            {/* Tablets and up: the sticky, scroll-driven tour. */}
            <div className="mt-12 hidden md:block">
              <RuleTour rules={rules} groups={ruleGroups} />
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
