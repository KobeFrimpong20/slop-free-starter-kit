import { classTokens, collectStrings, getAttr } from "../utils.mjs";

const ROLE_CLASSES = new Set(["font-heading", "font-body", "font-accent"]);
const GENERIC_FAMILY = /^font-(sans|serif|mono)$/;
const ARBITRARY_FAMILY = /^font-\[/;

const rule = {
  meta: {
    type: "problem",
    docs: { description: "Fonts come from the three typeface roles, and no more than three families load." },
    schema: [{ type: "object", properties: { maxFamilies: { type: "integer" } }, additionalProperties: false }],
    messages: {
      hardcoded: "'{{token}}' bypasses the typeface tokens. Use font-heading, font-body or font-accent.",
      inlineFamily: "Inline fontFamily bypasses the typeface tokens. Use font-heading, font-body or font-accent.",
      tooMany: "{{count}} font families loaded; the limit is {{max}} (heading, body, accent).",
    },
  },
  create(context) {
    const max = context.options[0]?.maxFamilies ?? 3;
    let families = 0;
    let lastFontImport = null;
    return {
      ImportDeclaration(node) {
        if (node.source.value === "next/font/google" || node.source.value === "next/font/local") {
          families += node.specifiers.length;
          lastFontImport = node;
        }
      },
      JSXOpeningElement(node) {
        for (const token of classTokens(node)) {
          if ((GENERIC_FAMILY.test(token) || ARBITRARY_FAMILY.test(token)) && !ROLE_CLASSES.has(token)) {
            context.report({ node, messageId: "hardcoded", data: { token } });
          }
        }
        const style = getAttr(node, "style");
        if (style?.value?.type === "JSXExpressionContainer") {
          const obj = style.value.expression;
          if (obj.type === "ObjectExpression") {
            for (const prop of obj.properties) {
              const key = prop.key?.name ?? prop.key?.value;
              if (key === "fontFamily" || key === "font-family") {
                const values = collectStrings(prop.value).join(" ");
                if (!/^\s*var\(--font-(heading|body|accent)\)\s*$/.test(values)) {
                  context.report({ node: prop, messageId: "inlineFamily" });
                }
              }
            }
          }
        }
      },
      "Program:exit"() {
        if (families > max && lastFontImport) {
          context.report({ node: lastFontImport, messageId: "tooMany", data: { count: families, max } });
        }
      },
    };
  },
};

export default rule;
