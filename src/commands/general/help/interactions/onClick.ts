import { ButtonInteraction } from "discord.js";

import { getHelpCategorySelection } from "../pages/categorySelection";
import { getHelpCategoryPage } from "../pages/categoryPage";
import { EVENT_NAMESPACES } from "../../../../keys/events";
import { IButtonInteractionProps } from "../../../../types";

export const HelpInteractionOnClick = async (
  props: IButtonInteractionProps
) => {
  const { interaction, namespace } = props;

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
