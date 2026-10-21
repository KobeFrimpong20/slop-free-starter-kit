import { classTokens, elementName, jsxAncestors } from "../utils.mjs";

const CONTROLS = new Set(["button", "a", "input", "select", "textarea", "label", "span"]);

/** A card is a padded, rounded (lg+) surface: filled, bordered, shadowed or ringed. */
function isCard(openingElement) {
  if (CONTROLS.has(elementName(openingElement))) return false;
  const t = classTokens(openingElement);
  const rounded = t.some((c) => /^rounded-(lg|xl|2xl|3xl|\[)/.test(c));
  const surface = t.some((c) => /^(bg-|border($|-)|shadow|ring)/.test(c) && !/^border-(0|none)$/.test(c) && !/^bg-(transparent|none)$/.test(c));
  const padded = t.some((c) => /^p[xy]?-/.test(c));
  return rounded && surface && padded;
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "A card must not contain another card." },
    schema: [],
    messages: { nested: "Card inside a card. Drop one surface; separate content with spacing or a divider." },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (!isCard(node)) return;
        for (const ancestor of jsxAncestors(node.parent)) {
          if (isCard(ancestor.openingElement)) {
            context.report({ node, messageId: "nested" });
            return;
          }
        }
      },
    };
  },
};

export default rule;
