import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Linter, RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import plugin from "./index.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const jsx = (className) => `const a = <div className="${className}" />;`;

tester.run("typeface-roles", plugin.rules["typeface-roles"], {
  valid: [
    jsx("font-heading text-2xl"),
    jsx("font-body font-medium"),
    jsx("md:font-accent"),
    `const a = <p style={{ fontFamily: "var(--font-body)" }} />;`,
    `import { A, B, C } from "next/font/google";`,
  ],
  invalid: [
    { code: jsx("font-sans"), errors: [{ messageId: "hardcoded" }] },
    { code: jsx("font-[Inter]"), errors: [{ messageId: "hardcoded" }] },
    { code: `const a = <p style={{ fontFamily: "Inter, sans-serif" }} />;`, errors: [{ messageId: "inlineFamily" }] },
    { code: `import { A, B } from "next/font/google";\nimport { C, D } from "next/font/local";`, errors: [{ messageId: "tooMany" }] },
  ],
});

tester.run("no-purple-blue-gradient", plugin.rules["no-purple-blue-gradient"], {
  valid: [
    jsx("bg-gradient-to-r from-amber-100 to-orange-200"),
    jsx("from-blue-500 to-blue-700"),
    jsx("bg-accent"),
    `const bg = "linear-gradient(#fff, #eee)";`,
  ],
  invalid: [
    { code: jsx("bg-gradient-to-r from-purple-600 to-blue-600"), errors: [{ messageId: "gradient" }] },
    { code: jsx("bg-linear-to-br from-indigo-600 via-purple-600 to-sky-500"), errors: [{ messageId: "gradient" }] },
    { code: jsx("md:from-violet-500 md:to-cyan-400"), errors: [{ messageId: "gradient" }] },
    { code: `const bg = "linear-gradient(90deg, #7c3aed, #2563eb)";`, errors: [{ messageId: "gradient" }] },
  ],
});

tester.run("no-nested-cards", plugin.rules["no-nested-cards"], {
  valid: [
    `const a = <div className="rounded-lg border bg-surface p-6"><p>hi</p></div>;`,
    `const a = <div className="rounded-lg border bg-surface p-6"><button className="rounded-md bg-accent px-4 py-2">x</button></div>;`,
    `const a = <div className="grid overflow-hidden rounded-lg border"><div className="h-16" /></div>;`,
    `const a = <section><div className="rounded-lg border p-4" /><div className="rounded-lg border p-4" /></section>;`,
  ],
  invalid: [
    {
      code: `const a = <div className="rounded-3xl bg-gray-50 p-8"><div className="rounded-2xl bg-white p-6 shadow-md" /></div>;`,
      errors: [{ messageId: "nested" }],
    },
    {
      code: `const a = <div className="rounded-xl border p-4"><ul><li><div className="rounded-lg shadow p-2" /></li></ul></div>;`,
      errors: [{ messageId: "nested" }],
    },
  ],
});

tester.run("limited-emoji", plugin.rules["limited-emoji"], {
  valid: [
    `const a = <h1>Launch 🚀</h1>;`,
    `const a = <p>© 2026 Company ™</p>;`,
    { code: `const a = <p>🚀 ✨</p>;`, options: [{ max: 2 }] },
  ],
  invalid: [
    { code: `const a = <p>🚀 ✨</p>;`, errors: [{ messageId: "tooMany" }] },
    { code: `const a = <p>Hi ❤️</p>; const b = "🎉";`, errors: [{ messageId: "tooMany" }] },
  ],
});

tester.run("actionable-contact-info", plugin.rules["actionable-contact-info"], {
  valid: [
    `const a = <a href="mailto:hi@example.com">hi@example.com</a>;`,
    `const a = <a href="tel:+15551234567">(555) 123-4567</a>;`,
    `const a = <Link href="https://example.com">https://example.com</Link>;`,
    `const a = <p>Over 10,000 teams in 2026</p>;`,
    `const a = <p>Signed in as {user.email}</p>;`,
  ],
  invalid: [
    { code: `const a = <p>Email hi@example.com</p>;`, errors: [{ messageId: "email" }] },
    { code: `const a = <p>Call (555) 123-4567</p>;`, errors: [{ messageId: "phone" }] },
    { code: `const a = <p>See https://example.com/docs</p>;`, errors: [{ messageId: "url" }] },
    { code: `const a = <p>hi@example.com or 555-123-4567</p>;`, errors: [{ messageId: "email" }, { messageId: "phone" }] },
  ],
});

describe("slop fixture", () => {
  const rules = Object.fromEntries(Object.keys(plugin.rules).map((r) => [`slop-free/${r}`, "error"]));
  const linter = new Linter();
  const messages = linter.verify(
    readFileSync(new URL("./fixtures/slop.tsx", import.meta.url), "utf8"),
    [{
      files: ["**/*.tsx"],
      plugins: { "slop-free": plugin },
      languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
      rules,
    }],
    "slop.tsx",
  );

  for (const name of Object.keys(plugin.rules)) {
    it(`${name} fires on the slop baseline`, () => {
      assert.ok(messages.some((m) => m.ruleId === `slop-free/${name}`), `${name} did not fire`);
    });
  }

  it("catches both the phone number and the email", () => {
    const contact = messages.filter((m) => m.ruleId === "slop-free/actionable-contact-info");
    assert.equal(contact.length, 2);
  });
});
