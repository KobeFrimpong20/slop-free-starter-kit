import { classTokens } from "../utils.mjs";

// Tailwind colour families that read as purple. Indigo is included: it's the
// most common "AI SaaS" gradient stop.
const PURPLE_FAMILIES = new Set(["purple", "violet", "fuchsia", "indigo"]);

// CSS named colours in the purple range.
const PURPLE_NAMES =
  /\b(purple|violet|indigo|fuchsia|magenta|orchid|plum|lavender|thistle|mediumpurple|rebeccapurple|darkviolet|blueviolet|darkorchid|mediumorchid|darkmagenta|mediumslateblue|slateblue|darkslateblue)\b/i;

const STOP = /^(?:from|via|to)-(.+)$/;
const HEX = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi;
const RGB = /rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/gi;
const HSL = /hsla?\(\s*(-?[\d.]+)(?:deg)?[\s,]+([\d.]+)%/gi;
const OKLCH = /oklch\(\s*[\d.]+%?\s+([\d.]+)\s+([\d.]+)/gi;

/** Hue in degrees for an RGB triple (0–1), or null for near-grays. */
function hue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 0.15) return null;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

const isPurpleHue = (h) => h !== null && h >= 255 && h < 320;

/** True when a CSS colour string contains a purple colour. */
function containsPurple(value) {
  if (PURPLE_NAMES.test(value)) return true;
  for (const [, hex] of value.matchAll(HEX)) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
    if (isPurpleHue(hue(r, g, b))) return true;
  }
  for (const [, r, g, b] of value.matchAll(RGB)) {
    if (isPurpleHue(hue(r / 255, g / 255, b / 255))) return true;
  }
  for (const [, h, s] of value.matchAll(HSL)) {
    if (Number(s) >= 15 && isPurpleHue((Number(h) % 360 + 360) % 360)) return true;
  }
  // OKLCH hues run differently: Tailwind's indigo sits near 277, blue near 262.
  for (const [, c, h] of value.matchAll(OKLCH)) {
    if (Number(c) >= 0.05 && Number(h) >= 270 && Number(h) < 335) return true;
  }
  return false;
}

/** True for a Tailwind stop class with a purple colour: from-violet-500, to-[#7c3aed]. */
function isPurpleStop(token) {
  const color = STOP.exec(token)?.[1];
  if (!color) return false;
  if (color.startsWith("[")) return containsPurple(color.slice(1, -1).replace(/_/g, " "));
  return PURPLE_FAMILIES.has(color.split("-")[0]);
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "No purple in gradients: linear, radial, conic or Tailwind stops." },
    schema: [],
    messages: { gradient: "Purple gradient. Use a flat token colour, or a gradient without purple." },
  },
  create(context) {
    function checkCss(node, value) {
      if (/gradient\(/i.test(value) && containsPurple(value)) {
        context.report({ node, messageId: "gradient" });
      }
    }
    return {
      JSXOpeningElement(node) {
        if (classTokens(node).some(isPurpleStop)) context.report({ node, messageId: "gradient" });
      },
      Literal(node) {
        if (typeof node.value === "string") checkCss(node, node.value);
      },
      TemplateElement(node) {
        checkCss(node, node.value.cooked ?? "");
      },
    };
  },
};

export default rule;
