import typefaceRoles from "./rules/typeface-roles.mjs";
import noPurpleBlueGradient from "./rules/no-purple-blue-gradient.mjs";
import noNestedCards from "./rules/no-nested-cards.mjs";
import limitedEmoji from "./rules/limited-emoji.mjs";
import actionableContactInfo from "./rules/actionable-contact-info.mjs";

const plugin = {
  meta: { name: "slop-free" },
  rules: {
    "typeface-roles": typefaceRoles,
    "no-purple-blue-gradient": noPurpleBlueGradient,
    "no-nested-cards": noNestedCards,
    "limited-emoji": limitedEmoji,
    "actionable-contact-info": actionableContactInfo,
  },
};

export default plugin;
