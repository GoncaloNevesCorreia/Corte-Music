import { StringSelectMenuInteraction } from "discord.js";

import { getHelpCategoryPage } from "../pages/categoryPage";
import { EVENT_NAMESPACES } from "../../../../keys/events";
import { createId } from "../../../../utils";
import { ISelectInteractionProps } from "../../../../types";

export const HelpInteractionOnSelect = async (
  props: ISelectInteractionProps
) => {
  const { interaction, namespace } = props;
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
