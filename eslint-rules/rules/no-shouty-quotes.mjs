import { classTokens, collectStrings, elementName, jsxText } from "../utils.mjs";

const QUOTE_KEYS = new Set(["quote", "testimonial", "review"]);

/** "ALL CAPS" or "Title Case" if the quote reads that way, else null. */
function shoutiness(text) {
  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length >= 12 && letters === letters.toUpperCase()) return "allCaps";
  // Skip each sentence's first word: sentence case capitalizes it anyway.
  const words = text
    .split(/[.!?]+/)
    .flatMap((sentence) => (sentence.match(/[A-Za-z][A-Za-z']*/g) ?? []).slice(1))
    .filter((w) => w.length >= 4);
  if (words.length < 3) return null;
  const capitalized = words.filter((w) => /^[A-Z]/.test(w)).length;
  return capitalized / words.length >= 0.8 ? "titleCase" : null;
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "Testimonial quotes are sentence case, not Title Case or ALL CAPS." },
    schema: [],
    messages: {
      titleCase: "Testimonial is in Title Case. Real quotes are sentence case.",
      allCaps: "Testimonial is in ALL CAPS. Real quotes are sentence case.",
    },
  },
  create(context) {
    function check(node, text) {
      const kind = shoutiness(text);
      if (kind) context.report({ node, messageId: kind });
    }
    return {
      JSXElement(node) {
        const name = elementName(node.openingElement);
        if (name !== "blockquote" && name !== "q") return;
        if (classTokens(node.openingElement).includes("uppercase")) {
          context.report({ node: node.openingElement, messageId: "allCaps" });
          return;
        }
        check(node.openingElement, jsxText(node));
      },
      // Testimonial data: [{ quote: "..." }, ...]
      Property(node) {
        const key = node.key?.name ?? node.key?.value;
        if (!QUOTE_KEYS.has(key)) return;
        if (node.parent?.type !== "ObjectExpression" || node.parent.parent?.type !== "ArrayExpression") return;
        const text = collectStrings(node.value).join(" ");
        if (text) check(node.value, text);
      },
    };
  },
};

export default rule;
