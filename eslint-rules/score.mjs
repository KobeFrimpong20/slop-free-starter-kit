// Slop score: 2 points per tell that appears anywhere, however often. Tells are the
// slop-free rules plus every Impeccable detector rule. 0 is clean, capped at 100.

export const POINTS_PER_TELL = 2;
export const TARGET_FAMILIES = 3;
export const MAX_SCORE = 100;

export const TELLS = {
  "no-shouty-quotes": "Title Case or ALL CAPS testimonials",
  "no-purple-gradient": "Purple gradients",
  "no-massive-shadows": "Massive shadows",
  "no-nested-cards": "Nested cards",
  "no-fade-animations": "Fade-in content",
  "specific-cta": "Generic calls to action",
  "actionable-contact-info": "Unclickable contact info",
  "limited-emoji": "Emoji",
  "typeface-roles": "Hardcoded fonts",
};

/** Off target when families are loaded but not exactly three. Zero means none detected. */
export function familiesOffTarget(count) {
  return count !== 0 && count !== TARGET_FAMILIES;
}

/**
 * @param {{ ruleId: string, messageId?: string }[]} findings slop-free findings, ruleId without prefix
 * @param {number} familyCount distinct font families loaded across the project
 * @param {{ antipattern: string, name: string }[]} impeccableFindings findings from `impeccable detect --json`
 */
export function scoreFindings(findings, familyCount, impeccableFindings = []) {
  const breakdown = Object.entries(TELLS).map(([ruleId, label]) => {
    // The family count is scored separately, so typeface-roles' own count message is skipped.
    const count = findings.filter((f) => f.ruleId === ruleId && f.messageId !== "tooMany").length;
    return { ruleId, label, count, points: count === 0 ? 0 : POINTS_PER_TELL };
  });
  breakdown.push({
    ruleId: "font-families",
    label: `Font families (${familyCount} loaded, target ${TARGET_FAMILIES})`,
    count: familyCount,
    points: familiesOffTarget(familyCount) ? POINTS_PER_TELL : 0,
  });
  const impeccable = new Map();
  for (const f of impeccableFindings) {
    const id = `impeccable/${f.antipattern}`;
    const entry = impeccable.get(id) ?? { ruleId: id, label: `Impeccable: ${f.name}`, count: 0, points: POINTS_PER_TELL };
    entry.count += 1;
    impeccable.set(id, entry);
  }
  breakdown.push(...impeccable.values());
  const raw = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score: Math.min(MAX_SCORE, raw), raw, breakdown };
}
