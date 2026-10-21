const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu;

const rule = {
  meta: {
    type: "suggestion",
    docs: { description: "No emoji by default; set max to allow a few per file." },
    schema: [{ type: "object", properties: { max: { type: "integer" } }, additionalProperties: false }],
    messages: {
      none: "Emoji are not allowed. Use type or an icon system instead.",
      tooMany: "Emoji overuse: {{count}} in this file (limit {{max}}). Use type or an icon system instead.",
    },
  },
  create(context) {
    const max = context.options[0]?.max ?? 0;
    let count = 0;
    // One report per emoji over the limit, so counts (and the slop score) are exact.
    function check(node, text) {
      const found = text.match(EMOJI)?.length ?? 0;
      for (let i = 0; i < found; i++) {
        count += 1;
        if (count > max) {
          context.report({ node, messageId: max === 0 ? "none" : "tooMany", data: { count, max } });
        }
      }
    }
    return {
      JSXText: (n) => check(n, n.value),
      Literal: (n) => typeof n.value === "string" && check(n, n.value),
      TemplateElement: (n) => check(n, n.value.cooked ?? ""),
    };
  },
};

export default rule;
