"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ruleNumber, type Rule, type RuleGroup } from "@/content/rules";
import { RuleDetails } from "@/components/rule-details";

type Props = { rules: Rule[]; groups: readonly RuleGroup[] };

// Wheel tuning: a new gesture starts after this much quiet, and one step needs
// this much travel. Trackpad momentum (shrinking deltas) never steps.
const GESTURE_GAP_MS = 150;
const STEP_DELTA = 30;
const REPEAT_MS = 350;

/**
 * Rule tour that captures scroll while the box sits in the middle of the
 * viewport: each gesture moves one rule. At the first or last rule, scrolling
 * past the end goes back to the page.
 */
export function RuleTour({ rules, groups }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const n = rules.length;

  const go = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(n - 1, i));
      indexRef.current = next;
      setIndex(next);
    },
    [n],
  );

  useEffect(() => {
    let lastEvent = 0;
    let lastStep = 0;
    let lastAbs = 0;
    let travel = 0;
    let steppedThisGesture = false;

    const inZone = () => {
      const box = boxRef.current;
      if (!box) return false;
      const r = box.getBoundingClientRect();
      const fullyVisible = r.top >= 0 && r.bottom <= window.innerHeight;
      const centreOffset = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
      return fullyVisible && centreOffset < window.innerHeight * 0.2;
    };

    const onWheel = (e: WheelEvent) => {
      if (!inZone() || e.deltaY === 0) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const current = indexRef.current;
      // At the ends, let the page scroll on.
      if ((dir > 0 && current === n - 1) || (dir < 0 && current === 0)) return;
      e.preventDefault();

      const now = performance.now();
      const abs = Math.abs(e.deltaY);
      const newGesture = now - lastEvent > GESTURE_GAP_MS;
      const momentum = !newGesture && abs < lastAbs;
      lastEvent = now;
      lastAbs = abs;
      if (newGesture) {
        travel = 0;
        steppedThisGesture = false;
      }
      travel += abs;

      const canStep = !steppedThisGesture || (!momentum && now - lastStep > REPEAT_MS);
      if (canStep && travel >= STEP_DELTA) {
        go(current + dir);
        lastStep = now;
        travel = 0;
        steppedThisGesture = true;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [go, n]);

  const firstIndexOf = (group: RuleGroup) => rules.findIndex((r) => r.group === group);
  const activeGroup = rules[index].group;

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const g = groups[(groups.indexOf(activeGroup) + step + groups.length) % groups.length];
    go(firstIndexOf(g));
    document.getElementById(`rule-tab-${groups.indexOf(g)}`)?.focus();
  };

  const onBoxKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" && index < n - 1) {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      go(index - 1);
    }
  };

  const rule = rules[index];
  const arrowClass =
    "flex size-9 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-accent hover:bg-accent-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      ref={boxRef}
      onKeyDown={onBoxKey}
      className="rounded-lg border border-border bg-background p-8"
    >
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
              onClick={() => go(firstIndexOf(group))}
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
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous rule"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className={arrowClass}
          >
            <Chevron direction="up" />
          </button>
          <button
            type="button"
            aria-label="Next rule"
            disabled={index === n - 1}
            onClick={() => go(index + 1)}
            className={arrowClass}
          >
            <Chevron direction="down" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "up" ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4"} />
    </svg>
  );
}
