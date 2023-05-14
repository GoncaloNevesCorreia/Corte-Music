import { ButtonInteraction, Client } from "discord.js";
import { GuildQueue, Player } from "discord-player";
import { getChannelById } from "../../utils";
import { getServerData, saveServerData } from "../../keys/servers";

import { TextChannel } from "discord.js";
import { getMusicMenu } from "../../commands/music/setup/pages/musicMenu";

export function setupMusicEvents(client: Client) {
  const player = Player.singleton(client, {
    ytdlOptions: {
      filter: "audioonly",
      highWaterMark: 1 << 25,
      dlChunkSize: 0,
    },
  });

  player.events.on("audioTrackAdd", async (queue) => {
    updateMusicMenu(queue);
  });
  player.events.on("audioTrackRemove", async (queue) => {
    updateMusicMenu(queue);
  });
  player.events.on("audioTracksAdd", async (queue) => {
    updateMusicMenu(queue);
  });
  player.events.on("audioTracksRemove", async (queue) => {
    updateMusicMenu(queue);
  });
  player.events.on("disconnect", async (queue) => {
    queue.node.stop();

    queue.setRepeatMode(0);

    if (!queue.deleted) queue.delete();

    updateMusicMenu(queue);
  });

  player.events.on("emptyQueue", async (queue) => {
    updateMusicMenu(queue);
  });
  player.events.on("playerSkip", async (queue) => {
    updateMusicMenu(queue);
  });
  player.events.on("playerStart", async (queue) => {
    updateMusicMenu(queue);
  });

  player.events.on("playerError", async (queue, error, track) => {
    console.error("[Player Error]: ", track.title, error);
  });
  player.events.on("error", async (queue, error) => {
    console.error("[ERROR]: ", error);
  });
}

export async function updateMusicMenu(
  queue: GuildQueue,
  interaction: ButtonInteraction | undefined = undefined
) {
  if (interaction) {
    await interaction.editReply(getMusicMenu(queue));
    return;
  }

  const guildId = queue.guild.id;

  const data = getServerData(guildId);

  if (!data?.musicChannelId || !data?.embedId) return;

  const channel = getChannelById(
    queue.guild,
    data.musicChannelId
  ) as TextChannel;

  if (!channel) saveServerData({ guildId });

  const message = await channel.messages.fetch(data.embedId).catch((error) => {
    const message = error?.rawError?.message as string;

    if (!message) return;

    if (message === "Unknown Message") {
      saveServerData({ guildId });
    }
  });

  if (!message) return;

  await message.edit(getMusicMenu(queue));
}
