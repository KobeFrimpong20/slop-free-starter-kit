const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu;

const rule = {
  meta: {
    type: "suggestion",
    docs: { description: "Limit emoji per file." },
    schema: [{ type: "object", properties: { max: { type: "integer" } }, additionalProperties: false }],
    messages: { tooMany: "Emoji overuse: {{count}} in this file (limit {{max}}). Use type or an icon system instead." },
  },
  create(context) {
    const max = context.options[0]?.max ?? 1;
    let count = 0;
    function check(node, text) {
      const found = text.match(EMOJI)?.length ?? 0;
      if (!found) return;
      const before = count;
      count += found;
      if (count > max && before + found > max) {
        context.report({ node, messageId: "tooMany", data: { count, max } });
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
