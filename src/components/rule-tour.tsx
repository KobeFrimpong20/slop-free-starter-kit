"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ruleNumber, type Rule, type RuleGroup } from "@/content/rules";
import { RuleDetails } from "@/components/rule-details";

type Props = { rules: Rule[]; groups: readonly RuleGroup[] };

/**
 * Sticky, scroll-driven tour: the section is tall, the box sticks, and scroll
 * position picks the rule. Native scrolling is never intercepted.
 */
export function RuleTour({ rules, groups }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = rules.length;

  /** Scrollable distance through the section, and its top in page coordinates. */
  const measure = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { rect, top: rect.top + window.scrollY, span: rect.height - window.innerHeight };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const m = measure();
      if (!m || m.span <= 0) return;
      const progress = Math.min(1, Math.max(0, -m.rect.top / m.span));
      const next = Math.min(n - 1, Math.floor(progress * n));
      setIndex((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [measure, n]);

  const scrollToIndex = (i: number) => {
    const m = measure();
    if (!m) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Land mid-band so the target rule is stable, not on a boundary.
    window.scrollTo({ top: m.top + ((i + 0.5) / n) * m.span, behavior: reduced ? "auto" : "smooth" });
  };

  const firstIndexOf = (group: RuleGroup) => rules.findIndex((r) => r.group === group);
  const activeGroup = rules[index].group;

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const g = groups[(groups.indexOf(activeGroup) + step + groups.length) % groups.length];
    scrollToIndex(firstIndexOf(g));
    document.getElementById(`rule-tab-${groups.indexOf(g)}`)?.focus();
  };

  const rule = rules[index];

  return (
    <div ref={sectionRef} style={{ height: `calc(${n} * 60vh + 100vh)` }}>
      {/* Full-height sticky layer centres the box in the viewport. */}
      <div className="sticky top-0 flex h-screen items-center">
        <div className="w-full rounded-lg border border-border bg-background p-8">
          <div role="tablist" aria-label="Rule groups" onKeyDown={onTabKey} className="flex gap-6 border-b border-border">
            {groups.map((group, g) => {
              const selected = group === activeGroup;
              return (
                <button
                  key={group}
                  id={`rule-tab-${g}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="rule-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => scrollToIndex(firstIndexOf(group))}
                  className={`-mb-px border-b-2 pb-3 font-body text-sm font-medium ${
                    selected ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>

          <div
            id="rule-panel"
            role="tabpanel"
            aria-labelledby={`rule-tab-${groups.indexOf(activeGroup)}`}
            aria-live="polite"
            className="grid min-h-64 gap-8 py-10 md:grid-cols-[4rem_1fr_1fr]"
          >
            <span className="font-accent text-sm text-muted-foreground">{ruleNumber(index)}</span>
            <RuleDetails rule={rule} size="lg" />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-0.5 flex-1 bg-border">
              <div className="h-full bg-accent" style={{ width: `${((index + 1) / n) * 100}%` }} />
            </div>
            <span className="font-accent text-xs text-muted-foreground">
              {ruleNumber(index)} / {ruleNumber(n - 1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
