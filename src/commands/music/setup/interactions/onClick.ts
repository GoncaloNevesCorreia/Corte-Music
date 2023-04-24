import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";
import { EVENT_NAMESPACES } from "../../../../keys/events";
import { IButtonInteractionProps } from "../../../../types";
import { readId } from "../../../../utils";
import { repeatAction } from "../actions/repeat";
import { shuffleAction } from "../actions/shuffle";
import { skipAction } from "../actions/skip";
import { stopAction } from "../actions/stop";
import { togglePlayAction } from "../actions/togglePlay";
import { getMusicMenu } from "../pages/musicMenu";

export const SetupInteractionOnClick = async (
  props: IButtonInteractionProps
) => {
  const { interaction, namespace, log, client } = props;

  if (namespace !== EVENT_NAMESPACES.music.action) {
    throw new Error(`Unknown namespace ${namespace}`);
  }

  const player = Player.singleton(client);

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
    case EVENT_NAMESPACES.music.actions.nextQueuePage: {
      const queue = MusicActions.getQueue(player, interaction);

      if (!queue) return;

      return await interaction.editReply(getMusicMenu(queue, 1));
    }
    case EVENT_NAMESPACES.music.actions.prevQueuePage: {
      const queue = MusicActions.getQueue(player, interaction);

      if (!queue) return;

      return await interaction.editReply(getMusicMenu(queue, -1));
    }

    case EVENT_NAMESPACES.music.actions.firstPage: {
      const queue = MusicActions.getQueue(player, interaction);

      if (!queue) return;

      return await interaction.editReply(getMusicMenu(queue, "first"));
    }
    case EVENT_NAMESPACES.music.actions.lastPage: {
      const queue = MusicActions.getQueue(player, interaction);

      if (!queue) return;

      return await interaction.editReply(getMusicMenu(queue, "last"));
    }

    default:
      throw new Error(`Unknown Button Action ${namespace}`);
  }
};
