#!/usr/bin/env node
// Usage: npm run slop-score -- [path] [--json] [--max <n>]
// Lints [path] (default: src) with the slop-free rules at their defaults and
// prints a 0-100 slop score. --max fails (exit 1) when the score is above n.

import path from "node:path";
import { ESLint } from "eslint";
import tsParser from "@typescript-eslint/parser";
import plugin from "../eslint-rules/index.mjs";
import { scoreFindings } from "../eslint-rules/score.mjs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const maxIndex = args.indexOf("--max");
const max = maxIndex === -1 ? null : Number(args[maxIndex + 1]);
const target = args.find((a, i) => !a.startsWith("--") && (maxIndex === -1 || i !== maxIndex + 1)) ?? "src";

// Reports every next/font family so the project-wide count can be totalled.
const fontFamilies = {
  meta: { type: "suggestion", schema: [], messages: { family: "{{name}}" } },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!String(node.source.value).startsWith("next/font/")) return;
        for (const s of node.specifiers) {
          const name = s.imported?.name ?? s.local.name;
          context.report({ node: s, messageId: "family", data: { name } });
        }
      },
    };
  },
};

// Fixed config so the score doesn't change with the project's lint settings.
const eslint = new ESLint({
  overrideConfigFile: true,
  errorOnUnmatchedPattern: false,
  overrideConfig: [
    { ignores: ["**/node_modules/**", "**/.next/**", "**/out/**", "**/build/**"] },
    {
      files: ["**/*.{js,jsx,mjs,ts,tsx}"],
      languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
      plugins: { "slop-free": plugin, "slop-score": { rules: { "font-families": fontFamilies } } },
      rules: {
        ...Object.fromEntries(Object.keys(plugin.rules).map((r) => [`slop-free/${r}`, "error"])),
        "slop-score/font-families": "warn",
      },
    },
  ],
});

const results = await eslint.lintFiles([target]);

const findings = [];
const families = new Set();
for (const result of results) {
  for (const m of result.messages) {
    if (m.ruleId === "slop-score/font-families") families.add(m.message);
    else if (m.ruleId?.startsWith("slop-free/")) {
      findings.push({
        ruleId: m.ruleId.slice("slop-free/".length),
        messageId: m.messageId,
        file: path.relative(process.cwd(), result.filePath),
        line: m.line,
        message: m.message,
      });
    }
  }
}

const { score, raw, breakdown } = scoreFindings(findings, families.size);

if (json) {
  console.log(JSON.stringify({ target, score, raw, families: [...families], breakdown, findings }, null, 2));
} else {
  const rows = breakdown.filter((b) => b.points > 0);
  console.log(`\nSlop score for ${target}: ${score}/100${raw > score ? ` (raw ${raw}, capped)` : ""}`);
  console.log(score === 0 ? "Clean.\n" : "");
  if (rows.length) {
    const width = Math.max(...rows.map((r) => r.label.length));
    for (const r of rows) {
      const how = r.mode === "once" ? "once" : r.mode === "each" ? `x${r.count}` : "";
      console.log(`  ${r.label.padEnd(width)}  ${how.padStart(4)}  +${r.points}`);
    }
    if (findings.length) {
      console.log("\nFindings:");
      for (const f of findings) console.log(`  ${f.file}:${f.line}  ${f.ruleId}  ${f.message}`);
    }
    console.log();
  }
  if (families.size) console.log(`Font families: ${[...families].join(", ")}\n`);
}

if (max !== null && score > max) {
  console.error(`Slop score ${score} is above the --max of ${max}.`);
  process.exitCode = 1;
}
