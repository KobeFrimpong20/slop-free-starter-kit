import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import slopFree from "./eslint-rules/index.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,jsx}"],
    plugins: { "slop-free": slopFree },
    rules: {
      "slop-free/typeface-roles": "error",
      "slop-free/no-purple-gradient": "error",
      "slop-free/no-nested-cards": "error",
      "slop-free/limited-emoji": "error",
      "slop-free/actionable-contact-info": "error",
      "slop-free/no-massive-shadows": "error",
      "slop-free/specific-cta": "error",
      "slop-free/no-shouty-quotes": "error",
      "slop-free/no-fade-animations": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Deliberately sloppy sample used by the rule tests.
    "eslint-rules/fixtures/**",
    // Vendored Impeccable skill scripts.
    ".claude/**",
  ]),
]);

export default eslintConfig;
