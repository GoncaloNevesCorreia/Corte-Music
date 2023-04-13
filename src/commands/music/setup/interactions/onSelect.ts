import { EVENT_NAMESPACES } from "../../../../keys/events";
import { StringSelectMenuInteraction } from "discord.js";
import { ISelectInteractionProps } from "../../../../types";

export const SetupInteractionOnSelect = async (
  props: ISelectInteractionProps
) => {
  const { interaction, namespace } = props;

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
