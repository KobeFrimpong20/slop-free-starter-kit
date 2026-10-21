import { elementName, getAttr, jsxAncestors } from "../utils.mjs";

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/;
const URL_ = /\bhttps?:\/\/\S+|\bwww\.\S+/;
const LINKS = new Set(["a", "Link"]);

const rule = {
  meta: {
    type: "problem",
    docs: { description: "Emails, phone numbers and URLs shown to users must be clickable." },
    schema: [],
    messages: {
      email: "Email address is plain text. Wrap it in <a href=\"mailto:...\">.",
      phone: "Phone number is plain text. Wrap it in <a href=\"tel:...\">.",
      url: "URL is plain text. Wrap it in <a href=\"...\">.",
    },
  },
  create(context) {
    function inLink(node) {
      for (const el of jsxAncestors(node)) {
        if (LINKS.has(elementName(el.openingElement)) && getAttr(el.openingElement, "href")) return true;
      }
      return false;
    }
    function check(node, text) {
      if (inLink(node)) return;
      // Strip emails first so their digits and dots don't read as phones or URLs.
      const withoutEmail = text.replace(new RegExp(EMAIL, "g"), " ");
      if (EMAIL.test(text)) context.report({ node, messageId: "email" });
      if (URL_.test(withoutEmail)) context.report({ node, messageId: "url" });
      if (PHONE.test(withoutEmail)) context.report({ node, messageId: "phone" });
    }
    return {
      JSXText: (n) => check(n, n.value),
      // String literals used as JSX children: {"hello@x.com"}
      "JSXExpressionContainer > Literal"(n) {
        if (typeof n.value === "string") check(n, n.value);
      },
    };
  },
};

export default rule;
