import { classTokens, elementName, getAttr, jsxAncestors } from "../utils.mjs";

// Overlays may fade: it signals they appeared. Page content shouldn't.
const OVERLAY_ROLES = new Set(["dialog", "alertdialog", "tooltip", "menu", "listbox", "status"]);
const FADE_CLASS = /^(animate-fade|fade-(in|out)|animate-\[fade)/;
const ENTER_CLASS = /^(fade-|slide-in-)/;
const MOTION_PROPS = ["initial", "whileInView", "animate"];

function isOverlay(openingElement) {
  if (elementName(openingElement) === "dialog") return true;
  const role = getAttr(openingElement, "role")?.value;
  return role?.type === "Literal" && OVERLAY_ROLES.has(role.value);
}

function isMotionElement(openingElement) {
  const n = openingElement.name;
  return n.type === "JSXMemberExpression" && (n.object.name === "motion" || n.object.name === "m");
}

/** True when a motion prop's object sets opacity to 0: initial={{ opacity: 0 }}. */
function startsTransparent(attr) {
  const obj = attr?.value?.type === "JSXExpressionContainer" ? attr.value.expression : null;
  if (obj?.type !== "ObjectExpression") return false;
  return obj.properties.some(
    (p) => (p.key?.name ?? p.key?.value) === "opacity" && p.value.type === "Literal" && Number(p.value.value) === 0,
  );
}

function hasFade(openingElement) {
  const tokens = classTokens(openingElement);
  if (tokens.some((t) => FADE_CLASS.test(t))) return true;
  if (tokens.includes("animate-in") && tokens.some((t) => ENTER_CLASS.test(t))) return true;
  const aos = getAttr(openingElement, "data-aos")?.value;
  if (aos?.type === "Literal" && String(aos.value).startsWith("fade")) return true;
  return isMotionElement(openingElement) && MOTION_PROPS.some((p) => startsTransparent(getAttr(openingElement, p)));
}

const rule = {
  meta: {
    type: "problem",
    docs: { description: "No fade-in animations on page content; overlays may fade." },
    schema: [],
    messages: { fade: "Fade-in on page content. People scroll past it; show content immediately." },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (!hasFade(node)) return;
        for (const el of jsxAncestors(node)) {
          if (isOverlay(el.openingElement)) return;
        }
        context.report({ node, messageId: "fade" });
      },
    };
  },
};

export default rule;
