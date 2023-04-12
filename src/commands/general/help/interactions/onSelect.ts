import { StringSelectMenuInteraction } from "discord.js";

import { getHelpCategoryPage } from "../pages/categoryPage";
import { EVENT_NAMESPACES } from "../../../../keys/events";
import { createId } from "../../../../utils";

export const HelpInteractionOnSelect = async (
  interaction: StringSelectMenuInteraction,
  namespace: string
) => {
  switch (namespace) {
    case EVENT_NAMESPACES.help.select: {
      const newId = createId(
        EVENT_NAMESPACES.help.select,
        (interaction as StringSelectMenuInteraction).values[0]
      );
      return await interaction.editReply(getHelpCategoryPage(newId));
    }

    default:
      throw new Error(`Unknown namespace ${namespace}`);
  }
};
