import { classTokens } from "../utils.mjs";

const PURPLE = new Set(["purple", "violet", "fuchsia", "indigo"]);
const BLUE = new Set(["blue", "sky", "cyan", "indigo"]);
const STOP = /^(?:from|via|to)-([a-z]+)(?:-\d+)?(?:\/\d+)?$/;
const HEX = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi;

function hueOfHex(hex) {
  const h = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 0.15) return null; // gray: no hue
  const d = max - min;
  let hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  return (hue * 60 + 360) % 360;
}

/** True when a set of stops contains both a purple and a blue (distinct stops). */
function purpleToBlue(stops) {
  return stops.some((a, i) => PURPLE.has(a) && stops.some((b, j) => i !== j && BLUE.has(b)));
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "No purple-to-blue gradients." },
    schema: [],
    messages: { gradient: "Purple-to-blue gradient. Use a flat token colour instead." },
  },
  create(context) {
    function checkGradientString(node, value) {
      if (!/gradient\(/i.test(value)) return;
      const lower = value.toLowerCase();
      const stops = [];
      for (const word of lower.match(/[a-z]+/g) ?? []) {
        if (PURPLE.has(word) || BLUE.has(word) || word === "violet") stops.push(word);
      }
      for (const [, hex] of value.matchAll(HEX)) {
        const hue = hueOfHex(hex);
        if (hue === null) continue;
        if (hue >= 200 && hue < 255) stops.push("blue");
        else if (hue >= 255 && hue < 320) stops.push("purple");
      }
      if (purpleToBlue(stops)) context.report({ node, messageId: "gradient" });
    }
    return {
      JSXOpeningElement(node) {
        const stops = classTokens(node)
          .map((t) => STOP.exec(t)?.[1])
          .filter(Boolean);
        if (purpleToBlue(stops)) context.report({ node, messageId: "gradient" });
      },
      Literal(node) {
        if (typeof node.value === "string") checkGradientString(node, node.value);
      },
      TemplateElement(node) {
        checkGradientString(node, node.value.cooked ?? "");
      },
    };
  },
};

export default rule;
