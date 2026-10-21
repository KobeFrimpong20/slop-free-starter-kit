import { classTokens, elementName, getAttr, jsxText } from "../utils.mjs";

const DEFAULT_BANNED = [
  "get started", "get started free", "get started now",
  "learn more", "read more", "find out more", "discover more",
  "click here", "submit", "start now", "try it free", "try now", "try for free",
  "join now", "sign up now", "explore", "continue", "go", "let's go",
  "see more", "view more", "start free trial",
];

/** True when an AST subtree contains a call to buttonStyles(...). */
function callsButtonStyles(node) {
  if (!node || typeof node.type !== "string") return false;
  if (node.type === "CallExpression" && node.callee.name === "buttonStyles") return true;
  return Object.keys(node).some((key) => {
    if (key === "parent") return false;
    const child = node[key];
    if (Array.isArray(child)) return child.some(callsButtonStyles);
    return child && typeof child.type === "string" && callsButtonStyles(child);
  });
}

function isCta(openingElement) {
  const name = elementName(openingElement);
  if (name === "button" || name === "Button") return true;
  if (name !== "a" && name !== "Link") return false;
  return (
    callsButtonStyles(getAttr(openingElement, "className")?.value) ||
    classTokens(openingElement).includes("bg-accent")
  );
}

/** "Get Started Free →" becomes "get started free". */
const normalize = (label) =>
  label.toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim();

const rule = {
  meta: {
    type: "suggestion",
    docs: { description: "Calls to action say what happens, not 'Get started' or 'Learn more'." },
    schema: [
      {
        type: "object",
        properties: {
          banned: { type: "array", items: { type: "string" } },
          allow: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      generic: "'{{label}}' is a generic CTA. Say what happens: 'Clone the starter', 'Book a demo'.",
    },
  },
  create(context) {
    const { banned = [], allow = [] } = context.options[0] ?? {};
    const allowed = new Set(allow.map(normalize));
    const blocked = new Set([...DEFAULT_BANNED, ...banned].map(normalize).filter((p) => !allowed.has(p)));
    return {
      JSXElement(node) {
        if (!isCta(node.openingElement)) return;
        const label = jsxText(node);
        if (blocked.has(normalize(label))) {
          context.report({ node: node.openingElement, messageId: "generic", data: { label } });
        }
      },
    };
  },
};

export default rule;
