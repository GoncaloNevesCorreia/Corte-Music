import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  MessageCreateOptions,
  InteractionEditReplyOptions,
  APIEmbedField,
  ButtonStyle,
} from "discord.js";

import { EVENT_NAMESPACES } from "../../../../keys/events";
import { createId } from "../../../../utils";
import { createButton } from "../../../../utils/ui/button";
import { GuildQueue } from "discord-player";

function getMenu(queue: GuildQueue) {
  const embed = getEmbed(queue);

  const buttons = getButtons(queue.node.isPaused(), queue.repeatMode);

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

  setMetaData(embed, queue);
  setTitle(embed, queue);
  setTrackList(embed, queue);

  return embed;
}

function setMetaData(embed: EmbedBuilder, queue: GuildQueue) {
  embed
    .setFooter({
      text: queue.guild.client.user.tag,
      iconURL: queue.guild.client.user.displayAvatarURL(),
    })
    .setAuthor({
      name: "Github Repository",
      url: "https://github.com/GoncaloNevesCorreia/Corte-Music",
      iconURL:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    })
    .setTimestamp();
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

  if (!queue.currentTrack.requestedBy) return;

  embed.setFooter({
    text: `Requested by ${queue.currentTrack.requestedBy.tag}`,
    iconURL: queue.currentTrack.requestedBy.displayAvatarURL(),
  });
}

function setTrackList(embed: EmbedBuilder, queue: GuildQueue) {
  const tracks = queue.tracks.map((track, index) => ({
    name: "\u200B",
    value: `**${index + 1}. **(${track.duration}) **[${track.title}](${
      track.url
    })**`,
    inline: false,
  }));

  if (tracks.length > 0) {
    tracks.unshift({
      name: "\u200B",
      value: "**Next Tracks in Queue**",
      inline: false,
    });
  }

  const statusFields = getStatusFields(queue);

  embed.addFields([...statusFields, ...tracks]);
}

function getStatusFields(queue: GuildQueue): APIEmbedField[] {
  const totalTime = getFullDuration(queue);

  const hasCurrentTrack = !!queue.currentTrack;

  return [
    {
      name: "Status",
      value: "\u200B",
      inline: false,
    },
    {
      name: "Playing 🎶",
      value: queue.node.isPlaying() ? "Yes" : "No",
      inline: true,
    },
    {
      name: "Nº of Tracks",
      value: `${queue.tracks.size + (hasCurrentTrack ? 1 : 0)}`,
      inline: true,
    },
    {
      name: "Repeate Mode 🔁",
      value: ["OFF", "TRACK", "QUEUE", "AUTOPLAY"][queue.repeatMode],
      inline: true,
    },
    {
      name: "Total Time of Queue ⌛",
      value: totalTime,
      inline: true,
    },
  ];
}

function getFullDuration(queue: GuildQueue) {
  const queueDuration = queue.estimatedDuration;

  const currentTrackDuration = queue.currentTrack?.durationMS ?? 0;

  const durationMs = queueDuration + currentTrackDuration;

  const seconds = Math.floor(durationMs / 1000) % 60;
  const minutes = Math.floor(durationMs / 1000 / 60) % 60;
  const hours = Math.floor(durationMs / 1000 / 60 / 60);

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  }
  if (seconds > 0 || !parts.length) {
    parts.push(`${seconds} second${seconds === 1 ? "" : "s"}`);
  }

  return parts.join(", ");
}

function getButtons(isPaused: boolean, repeatMode: number) {
  const playId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.togglePlay
  );

  const playButtonEmoji = isPaused ? "⏸️" : "▶️";

  const playButton = createButton({
    customId: playId,
    emoji: playButtonEmoji,
  });

  const skipId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.skip
  );

  const skipButton = createButton({ customId: skipId, emoji: "⏭️" });

  const repeatId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.repeat
  );

  const repeatButtonEmoji = ["↪", "🔂", "🔁", "♾"];

  const repeatButton = createButton({
    customId: repeatId,
    emoji: repeatButtonEmoji[repeatMode],
  });

  const shuffleId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.shuffle
  );

  const shuffleButton = createButton({
    customId: shuffleId,
    emoji: "🔀",
  });

  const stopId = createId(
    EVENT_NAMESPACES.music.action,
    EVENT_NAMESPACES.music.actions.stop
  );

  const stopButton = createButton({
    customId: stopId,
    emoji: "⏹️",
    style: ButtonStyle.Danger,
  });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    playButton,
    skipButton,
    repeatButton,
    shuffleButton,
    stopButton,
  ]);

  return row;
}
