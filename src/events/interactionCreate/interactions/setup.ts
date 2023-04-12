import { ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { EVENT_NAMESPACES } from "../../../keys/events";

export const SetupInteractionCallback = async (
  interaction: StringSelectMenuInteraction | ButtonInteraction,
  namespace: string
) => {
  switch (namespace) {
    case EVENT_NAMESPACES.setup.select: {
      const value = (interaction as StringSelectMenuInteraction).values[0];
      console.log(value);

      break;
    }
    default:
      throw new Error(`Unknown namespace ${namespace}`);
  }
};
