import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { familyPoints, scoreFindings } from "./score.mjs";

const f = (ruleId, messageId = "x") => ({ ruleId, messageId });

describe("familyPoints", () => {
  it("is 0 at exactly three families", () => assert.equal(familyPoints(3), 0));
  it("adds 3 per family short of three", () => {
    assert.equal(familyPoints(2), 3);
    assert.equal(familyPoints(1), 6);
  });
  it("adds 5 per family over three", () => {
    assert.equal(familyPoints(4), 5);
    assert.equal(familyPoints(6), 15);
  });
  it("scores nothing when no families are detected", () => assert.equal(familyPoints(0), 0));
});

describe("scoreFindings", () => {
  it("is 0 for a clean project with three families", () => {
    assert.equal(scoreFindings([], 3).score, 0);
  });

  it("counts once-rules a single time however often they fire", () => {
    const { score } = scoreFindings(
      [f("no-purple-gradient"), f("no-purple-gradient"), f("no-nested-cards"), f("no-nested-cards")],
      3,
    );
    assert.equal(score, 10 + 7);
  });

  it("counts each-rules per finding", () => {
    const { score } = scoreFindings(
      [f("specific-cta"), f("specific-cta"), f("actionable-contact-info"), f("limited-emoji"), f("limited-emoji")],
      3,
    );
    assert.equal(score, 5 * 2 + 7 + 2 * 2);
  });

  it("ignores typeface-roles' own family-count message", () => {
    const { score } = scoreFindings([f("typeface-roles", "tooMany"), f("typeface-roles", "hardcoded")], 3);
    assert.equal(score, 3);
  });

  it("caps at 100 and keeps the raw total", () => {
    const many = Array.from({ length: 30 }, () => f("actionable-contact-info"));
    const { score, raw } = scoreFindings(many, 3);
    assert.equal(score, 100);
    assert.equal(raw, 210);
  });
});
