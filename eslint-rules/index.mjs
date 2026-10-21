import typefaceRoles from "./rules/typeface-roles.mjs";
import noPurpleGradient from "./rules/no-purple-gradient.mjs";
import noNestedCards from "./rules/no-nested-cards.mjs";
import limitedEmoji from "./rules/limited-emoji.mjs";
import noMassiveShadows from "./rules/no-massive-shadows.mjs";
import actionableContactInfo from "./rules/actionable-contact-info.mjs";

const plugin = {
  meta: { name: "slop-free" },
  rules: {
    "typeface-roles": typefaceRoles,
    "no-purple-gradient": noPurpleGradient,
    "no-nested-cards": noNestedCards,
    "limited-emoji": limitedEmoji,
    "actionable-contact-info": actionableContactInfo,
    "no-massive-shadows": noMassiveShadows,
  },
};

export default plugin;
