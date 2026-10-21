// Slop score: weighted total of slop-free findings. 0 is clean, capped at 100.

/** Points per rule. "once" scores if the tell appears anywhere; "each" per finding. */
export const WEIGHTS = {
  "no-shouty-quotes": { points: 10, mode: "once", label: "Title Case or ALL CAPS testimonials" },
  "no-purple-gradient": { points: 10, mode: "once", label: "Purple gradients" },
  "no-massive-shadows": { points: 8, mode: "once", label: "Massive shadows" },
  "no-nested-cards": { points: 7, mode: "once", label: "Nested cards" },
  "no-fade-animations": { points: 4, mode: "once", label: "Fade-in content" },
  "specific-cta": { points: 5, mode: "each", label: "Generic calls to action" },
  "actionable-contact-info": { points: 7, mode: "each", label: "Unclickable contact info" },
  "limited-emoji": { points: 2, mode: "each", label: "Emoji" },
  "typeface-roles": { points: 3, mode: "each", label: "Hardcoded fonts" },
};

export const TARGET_FAMILIES = 3;
const BELOW_TARGET_POINTS = 3;
const ABOVE_TARGET_POINTS = 5;
export const MAX_SCORE = 100;

/** +3 per family short of three, +5 per family over. Zero families means none detected: 0. */
export function familyPoints(count) {
  if (count === 0) return 0;
  if (count < TARGET_FAMILIES) return (TARGET_FAMILIES - count) * BELOW_TARGET_POINTS;
  return (count - TARGET_FAMILIES) * ABOVE_TARGET_POINTS;
}

/**
 * @param {{ ruleId: string, messageId?: string }[]} findings slop-free findings, ruleId without prefix
 * @param {number} familyCount distinct font families loaded across the project
 */
export function scoreFindings(findings, familyCount) {
  const breakdown = Object.entries(WEIGHTS).map(([ruleId, w]) => {
    // The family count is scored separately, so typeface-roles' own count message is skipped.
    const count = findings.filter((f) => f.ruleId === ruleId && f.messageId !== "tooMany").length;
    const points = count === 0 ? 0 : w.mode === "once" ? w.points : w.points * count;
    return { ruleId, label: w.label, mode: w.mode, count, points };
  });
  breakdown.push({
    ruleId: "font-families",
    label: `Font families (${familyCount} loaded, target ${TARGET_FAMILIES})`,
    mode: "families",
    count: familyCount,
    points: familyPoints(familyCount),
  });
  const raw = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score: Math.min(MAX_SCORE, raw), raw, breakdown };
}
