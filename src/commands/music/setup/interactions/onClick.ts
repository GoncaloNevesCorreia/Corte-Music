import { EVENT_NAMESPACES } from "../../../../keys/events";
import { IButtonInteractionProps } from "../../../../types";
import { readId } from "../../../../utils";
import { repeatAction } from "../actions/repeat";
import { shuffleAction } from "../actions/shuffle";
import { skipAction } from "../actions/skip";
import { stopAction } from "../actions/stop";
import { togglePlayAction } from "../actions/togglePlay";

export const SetupInteractionOnClick = async (
  props: IButtonInteractionProps
) => {
  const { interaction, namespace, log, client } = props;

  if (namespace !== EVENT_NAMESPACES.music.action) {
    throw new Error(`Unknown namespace ${namespace}`);
  }

  const id = interaction.customId;

  const [_, action] = readId(id);

  switch (action) {
    case EVENT_NAMESPACES.music.actions.togglePlay: {
      const response = await togglePlayAction(props);

      if (!response) return;

      return await interaction.editReply(response);
    }
    case EVENT_NAMESPACES.music.actions.stop: {
      const response = await stopAction(props);

      if (!response) return;

      return await interaction.editReply(response);
    }
    case EVENT_NAMESPACES.music.actions.skip: {
      const response = await skipAction(props);

      if (!response) return;

      return await interaction.editReply(response);
    }
    case EVENT_NAMESPACES.music.actions.shuffle: {
      const response = await shuffleAction(props);

      if (!response) return;

      return await interaction.editReply(response);
    }
    case EVENT_NAMESPACES.music.actions.repeat: {
      const response = await repeatAction(props);

      if (!response) return;

      return await interaction.editReply(response);
    }

    default:
      throw new Error(`Unknown Button Action ${namespace}`);
  }
};
