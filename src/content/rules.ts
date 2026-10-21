export const ruleGroups = ["Type", "Colour & depth", "Layout", "Copy", "Motion"] as const;

export type RuleGroup = (typeof ruleGroups)[number];

export type Rule = {
  id: string;
  group: RuleGroup;
  name: string;
  slop: string;
  rule: string;
};

// Ordered by group; the tour and the list number rules in this order.
export const rules: Rule[] = [
  {
    id: "typeface-roles",
    group: "Type",
    name: "Typeface roles",
    slop: "Inter for everything, set inline wherever a component needs it.",
    rule: "Three families, three roles: heading, body, accent. Fonts come from tokens only.",
  },
  {
    id: "no-shouty-quotes",
    group: "Type",
    name: "Sentence-case testimonials",
    slop: "“This Product Completely Transformed How We Work.”",
    rule: "Quotes in Title Case or all caps fail. People don’t talk in headlines.",
  },
  {
    id: "no-purple-gradient",
    group: "Colour & depth",
    name: "No purple gradients",
    slop: "A purple-to-blue hero, and another one behind the call to action.",
    rule: "Any gradient with purple in it, linear, radial or conic, fails the build.",
  },
  {
    id: "no-massive-shadows",
    group: "Colour & depth",
    name: "No massive shadows",
    slop: "A button floating on a shadow-xl, cards hovering on 50px of blur.",
    rule: "Nothing past shadow-lg. Custom shadows can blur 20px at most.",
  },
  {
    id: "no-nested-cards",
    group: "Layout",
    name: "No nested cards",
    slop: "A card on a panel on a section, each with its own shadow and radius.",
    rule: "A padded, rounded surface can't sit inside another one.",
  },
  {
    id: "specific-cta",
    group: "Copy",
    name: "Specific calls to action",
    slop: "Get Started Free, Learn More, and Submit on every button.",
    rule: "Button labels say what happens next. Vague stock phrases fail.",
  },
  {
    id: "limited-emoji",
    group: "Copy",
    name: "No emoji",
    slop: "A rocket in the headline, sparkles on the button, a heart by the testimonials.",
    rule: "Zero emoji by default. Type and spacing carry the tone.",
  },
  {
    id: "actionable-contact-info",
    group: "Copy",
    name: "Actionable contact info",
    slop: "An email and phone number printed as plain text.",
    rule: "Emails, phone numbers and URLs must be links people can tap.",
  },
  {
    id: "no-fade-animations",
    group: "Motion",
    name: "No fade-in content",
    slop: "Every section fades up as you scroll, so a fast scroll skips past blank space.",
    rule: "Page content shows immediately. Dialogs, menus and toasts may still fade.",
  },
];

export const ruleNumber = (i: number) => String(i + 1).padStart(2, "0");
