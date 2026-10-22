import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { familiesOffTarget, scoreFindings } from "./score.mjs";

const f = (ruleId, messageId = "x") => ({ ruleId, messageId });

describe("familiesOffTarget", () => {
  it("is on target at exactly three families", () => assert.equal(familiesOffTarget(3), false));
  it("is off target under or over three", () => {
    assert.equal(familiesOffTarget(1), true);
    assert.equal(familiesOffTarget(5), true);
  });
  it("ignores projects with no families detected", () => assert.equal(familiesOffTarget(0), false));
});

describe("scoreFindings", () => {
  it("is 0 for a clean project with three families", () => {
    assert.equal(scoreFindings([], 3).score, 0);
  });

  it("scores 2 per tell however often it fires", () => {
    const { score } = scoreFindings(
      [f("no-purple-gradient"), f("no-purple-gradient"), f("specific-cta"), f("specific-cta"), f("limited-emoji")],
      3,
    );
    assert.equal(score, 2 * 3);
  });

  it("scores 2 when font families are off target", () => {
    assert.equal(scoreFindings([], 5).score, 2);
    assert.equal(scoreFindings([], 1).score, 2);
  });

  it("ignores typeface-roles' own family-count message", () => {
    assert.equal(scoreFindings([f("typeface-roles", "tooMany")], 3).score, 0);
    assert.equal(scoreFindings([f("typeface-roles", "tooMany"), f("typeface-roles", "hardcoded")], 3).score, 2);
  });

  it("scores 2 per Impeccable rule found, however often", () => {
    const imp = (antipattern) => ({ antipattern, name: antipattern });
    const { score, breakdown } = scoreFindings(
      [f("no-purple-gradient")],
      3,
      [imp("ai-color-palette"), imp("ai-color-palette"), imp("nested-cards")],
    );
    assert.equal(score, 2 * 3);
    assert.equal(breakdown.find((b) => b.ruleId === "impeccable/ai-color-palette").count, 2);
  });

  it("keeps the per-tell finding count in the breakdown", () => {
    const { breakdown } = scoreFindings([f("specific-cta"), f("specific-cta")], 3);
    assert.deepEqual(breakdown.find((b) => b.ruleId === "specific-cta"), {
      ruleId: "specific-cta",
      label: "Generic calls to action",
      count: 2,
      points: 2,
    });
  });
});
