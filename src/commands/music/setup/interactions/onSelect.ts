import { EVENT_NAMESPACES } from "../../../../keys/events";
import { ISelectInteractionProps } from "../../../../types";
import { createMusicMenu } from "../pages/musicMenu";
import { MusicActions } from "../../../../config/music";
import { Player } from "discord-player";
import { saveServerData } from "../../../../keys/servers";

export const SetupInteractionOnSelect = async (
  props: ISelectInteractionProps
) => {
  const { interaction, namespace, client } = props;

  switch (namespace) {
    case EVENT_NAMESPACES.setup.select: {
      const channelId = interaction.values[0];
      const channel = interaction.guild?.channels.cache.get(channelId);

      if (!channel || !interaction.guild) {
        return await interaction.editReply({
          content: "Channel not found",
        });
      }

      if (!channel.isTextBased()) {
        return await interaction.editReply({
          content: "Channel is not text based",
        });
      }

      const player = Player.singleton(client);

      const queue = MusicActions.getQueue(player, interaction);

      if (!queue) break;

      const message = await channel.send(createMusicMenu(queue));

      saveServerData({
        guildId: interaction.guild.id,
        musicChannelId: channelId,
        embedId: message.id,
      });

      break;
    }
    default:
      throw new Error(`Unknown namespace ${namespace}`);
  }
};
