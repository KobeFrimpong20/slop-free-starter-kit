import { classTokens, collectStrings, getAttr } from "../utils.mjs";

// Tailwind's named sizes past shadow-lg. shadow-xl blurs 25px, shadow-2xl 50px;
// drop-shadow-2xl blurs 25px.
const NAMED_BOX = new Set(["shadow-xl", "shadow-2xl"]);
const NAMED_DROP = new Set(["drop-shadow-2xl"]);
const ARBITRARY = /^(drop-)?shadow-\[(.+)\]$/;
const LENGTH = /^(-?[\d.]+)(px|rem|em)?$/;

const toPx = (n, unit) => Number(n) * (unit === "rem" || unit === "em" ? 16 : 1);

/** Split on commas that aren't inside parentheses: "0 1px red, 0 2px rgb(0,0,0)". */
function splitLayers(value) {
  const layers = [];
  let depth = 0;
  let current = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      layers.push(current);
      current = "";
    } else current += ch;
  }
  layers.push(current);
  return layers;
}

/** Largest blur radius in px across the layers of a box-shadow value. */
function maxBoxBlur(value) {
  let max = 0;
  for (const layer of splitLayers(value)) {
    const lengths = layer
      .replace(/\w+\([^)]*\)/g, " ") // drop colour functions
      .trim()
      .split(/\s+/)
      .map((t) => LENGTH.exec(t))
      .filter(Boolean);
    // offset-x offset-y blur spread: blur is the third length
    if (lengths[2]) max = Math.max(max, toPx(lengths[2][1], lengths[2][2]));
  }
  return max;
}

/** Largest blur in px across drop-shadow() calls in a filter value. */
function maxDropBlur(value) {
  let max = 0;
  for (const [, args] of value.matchAll(/drop-shadow\(([^()]*(?:\([^)]*\)[^()]*)*)\)/g)) {
    max = Math.max(max, maxBoxBlur(args));
  }
  return max;
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "No massive shadows: nothing past shadow-lg, no blur over the limit." },
    schema: [{ type: "object", properties: { maxBlur: { type: "number" } }, additionalProperties: false }],
    messages: {
      named: "'{{token}}' is a massive shadow. Use shadow-lg or smaller, or a border.",
      blur: "Shadow blur of {{blur}}px is over the {{max}}px limit. Use a tighter shadow or a border.",
    },
  },
  create(context) {
    const max = context.options[0]?.maxBlur ?? 20;
    function checkBlur(node, blur) {
      if (blur > max) context.report({ node, messageId: "blur", data: { blur, max } });
    }
    return {
      JSXOpeningElement(node) {
        for (const token of classTokens(node)) {
          if (NAMED_BOX.has(token) || NAMED_DROP.has(token)) {
            context.report({ node, messageId: "named", data: { token } });
            continue;
          }
          const arbitrary = ARBITRARY.exec(token);
          if (arbitrary) {
            // Arbitrary drop shadows use the same offset/offset/blur order.
            checkBlur(node, maxBoxBlur(arbitrary[2].replace(/_/g, " ")));
          }
        }
        const style = getAttr(node, "style");
        const obj = style?.value?.type === "JSXExpressionContainer" ? style.value.expression : null;
        if (obj?.type !== "ObjectExpression") return;
        for (const prop of obj.properties) {
          const key = prop.key?.name ?? prop.key?.value;
          const value = collectStrings(prop.value).join(" ");
          if (key === "boxShadow" || key === "box-shadow") checkBlur(prop, maxBoxBlur(value));
          if (key === "filter") checkBlur(prop, maxDropBlur(value));
        }
      },
    };
  },
};

export default rule;
