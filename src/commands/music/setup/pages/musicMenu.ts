import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  MessageCreateOptions,
  InteractionEditReplyOptions,
} from "discord.js";

import { EVENT_NAMESPACES } from "../../../../keys/events";
import { createId } from "../../../../utils";
import { createButton } from "../../../../utils/ui/button";
import { GuildQueue } from "discord-player";

function getMenu(queue: GuildQueue) {
  const embed = getEmbed(queue);

  const buttons = getButtons(queue.node.isPaused());

  return {
    embed: embed,
    row: buttons,
  };
}

export function createMusicMenu(queue: GuildQueue): MessageCreateOptions {
  const { embed, row } = getMenu(queue);

  return {
    embeds: [embed],
    components: [row],
  };
}

export function getMusicMenu(queue: GuildQueue): InteractionEditReplyOptions {
  const { embed, row } = getMenu(queue);

  return {
    embeds: [embed],
    components: [row],
  };
}

function getEmbed(queue: GuildQueue) {
  const embed = new EmbedBuilder();

  setTitle(embed, queue);
  setTrackList(embed, queue);

  return embed;
}

function setTitle(embed: EmbedBuilder, queue: GuildQueue) {
  if (!queue.currentTrack) {
    embed
      .setTitle("No song playing currently")
      .setDescription(
        "To add a song to the Queue, just place a **[YouTube](https://www.youtube.com)** url in the chat."
      );

    return;
  }

  embed
    .setTitle(`${queue.currentTrack.title}`)
    .setURL(queue.currentTrack.url)
    .setDescription(`Duration: ${queue.currentTrack.duration}`)
    .setImage(queue.currentTrack.thumbnail)
    .setThumbnail(queue.currentTrack.thumbnail);
}

function setTrackList(embed: EmbedBuilder, queue: GuildQueue) {
  if (queue.tracks.size < 1) return;

  const tracks = queue.tracks.map((track, index) => ({
    name: "\u200B",
    value: `**${index + 1}. **(${track.duration}) **[${track.title}](${
      track.url
    })**`,
    inline: false,
  }));

  embed.addFields(tracks);
}

function getButtons(isPaused: boolean) {
  const playId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.togglePlay
  );

  const playButtonEmoji = isPaused ? "⏸️" : "▶️";

  const playButton = createButton({ customId: playId, emoji: playButtonEmoji });

  const skipId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.skip
  );

  const skipButton = createButton({ customId: skipId, emoji: "⏭️" });

  const stopId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.stop
  );

  const stopButton = createButton({ customId: stopId, emoji: "⏹️" });

  const repeatId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.repeat
  );

  const repeatButton = createButton({ customId: repeatId, emoji: "🔁" });

  const shuffleId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.shuffle
  );

  const shuffleButton = createButton({ customId: shuffleId, emoji: "🔀" });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    playButton,
    stopButton,
    skipButton,
    repeatButton,
    shuffleButton,
  ]);

  return row;
}
