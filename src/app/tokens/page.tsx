import { Button } from "@/components/button";

const neutralSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const accentSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col gap-16 px-6 py-24">
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-5xl text-foreground">
          Design tokens
        </h1>
        <p className="max-w-lg font-body text-lg text-muted-foreground">
          Production Launchpad&rsquo;s token preview, not the landing page. Heading, body, and accent
          type, plus the neutral and accent color ramps, so we can eyeball
          the system before building real screens.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl text-foreground">Typeface roles</h2>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-6">
          <p className="font-heading text-3xl text-foreground">
            Lora sets every heading
          </p>
          <p className="font-body text-base text-foreground">
            Work Sans carries all body copy, UI labels, and buttons. It should
            never appear in a heading, and Lora should never appear in a
            paragraph.
          </p>
          <p className="font-accent text-sm text-accent">
            IBM Plex Mono — reserved for code, data, and numeric callouts
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl text-foreground">Neutral scale (warm gray)</h2>
        <div className="grid grid-cols-11 overflow-hidden rounded-lg border border-border">
          {neutralSteps.map((step) => (
            <div
              key={step}
              className="flex h-16 items-end justify-center pb-1"
              style={{
                backgroundColor: `var(--color-neutral-${step})`,
                color: step >= 500 ? "var(--color-neutral-50)" : "var(--color-neutral-950)",
              }}
            >
              <span className="font-accent text-xs">{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl text-foreground">Accent scale (navy)</h2>
        <div className="grid grid-cols-11 overflow-hidden rounded-lg border border-border">
          {accentSteps.map((step) => (
            <div
              key={step}
              className="flex h-16 items-end justify-center pb-1"
              style={{
                backgroundColor: `var(--color-accent-${step})`,
                color: step >= 500 ? "var(--color-accent-50)" : "var(--color-accent-950)",
              }}
            >
              <span className="font-accent text-xs">{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl text-foreground">Shape &amp; interactive states</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
          <span className="rounded-sm bg-accent-subtle px-3 py-1 font-body text-xs font-medium text-accent-700">
            Soft tag
          </span>
        </div>
      </section>
    </main>
  );
}
