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
      return await togglePlayAction(props);
    }
    case EVENT_NAMESPACES.music.actions.stop: {
      return await stopAction(props);
    }
    case EVENT_NAMESPACES.music.actions.skip: {
      return await skipAction(props);
    }
    case EVENT_NAMESPACES.music.actions.shuffle: {
      return await shuffleAction(props);
    }
    case EVENT_NAMESPACES.music.actions.repeat: {
      return await repeatAction(props);
    }
    default:
      throw new Error(`Unknown Button Action ${namespace}`);
  }
};
