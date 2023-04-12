import { ButtonInteraction } from "discord.js";

import { getHelpCategorySelection } from "../pages/categorySelection";
import { getHelpCategoryPage } from "../pages/categoryPage";
import { EVENT_NAMESPACES } from "../../../../keys/events";

export const HelpInteractionOnClick = async (
  interaction: ButtonInteraction,
  namespace: string
) => {
  switch (namespace) {
    case EVENT_NAMESPACES.help.root:
      return await interaction.editReply(getHelpCategorySelection());
    case EVENT_NAMESPACES.help.action:
      return await interaction.editReply(
        getHelpCategoryPage(interaction.customId)
      );
    default:
      throw new Error(`Unknown namespace ${namespace}`);
  }
};
