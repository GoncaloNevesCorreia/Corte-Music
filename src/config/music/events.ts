import { GuildQueue, Player } from "discord-player";
import { getChannelById } from "../../utils";
import { getServerData } from "../../keys/servers";

import { TextChannel } from "discord.js";
import { getMusicMenu } from "../../commands/music/setup/pages/musicMenu";

export function setupMusicEvents(player: Player) {
  player.events.on("playerStart", async (queue, track) => {
    updateEmbed(queue);
  });

  player.events.on("audioTrackAdd", (queue, track) => {
    updateEmbed(queue);
  });

  player.events.on("audioTracksAdd", (queue, track) => {
    updateEmbed(queue);
  });

  player.events.on("playerSkip", (queue, track) => {
    updateEmbed(queue);
  });

  player.events.on("disconnect", (queue) => {
    updateEmbed(queue);
  });
  player.events.on("emptyChannel", (queue) => {
    updateEmbed(queue);
  });
  player.events.on("emptyQueue", (queue) => {
    updateEmbed(queue);
  });
}

async function updateEmbed(queue: GuildQueue) {
  const guildId = queue.guild.id;

  const data = getServerData(guildId);

  if (!data?.musicChannelId || !data?.embedId) return;

  const channel = getChannelById(
    queue.guild,
    data.musicChannelId
  ) as TextChannel;

  const message = await channel.messages.fetch(data.embedId);

  if (!message) return;

  await message.edit(getMusicMenu(queue));
}
