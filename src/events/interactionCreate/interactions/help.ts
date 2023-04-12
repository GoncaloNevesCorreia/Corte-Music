import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { EVENT_NAMESPACES } from "../../../keys/events";
import { getCategoryPage, getCategoryRoot } from "../../../pages/help";
import { createId } from "../../../utils";

export const HelpInteractionCallback = async (
  interaction: StringSelectMenuInteraction | ButtonInteraction,
  namespace: string
) => {
  switch (namespace) {
    case EVENT_NAMESPACES.help.root:
      return await interaction.editReply(getCategoryRoot());
    case EVENT_NAMESPACES.help.select: {
      const newId = createId(
        EVENT_NAMESPACES.help.select,
        (interaction as StringSelectMenuInteraction).values[0]
      );
      return await interaction.editReply(getCategoryPage(newId));
    }
    case EVENT_NAMESPACES.help.action:
      return await interaction.editReply(getCategoryPage(interaction.customId));
    default:
      throw new Error(`Unknown namespace ${namespace}`);
  }
};
