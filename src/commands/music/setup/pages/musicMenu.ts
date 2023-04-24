import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  MessageCreateOptions,
  InteractionEditReplyOptions,
  APIEmbedField,
  ButtonStyle,
  Guild,
} from "discord.js";

import { EVENT_NAMESPACES } from "../../../../keys/events";
import { Colors, chunk, createId } from "../../../../utils";
import { createButton } from "../../../../utils/ui/button";
import { GuildQueue, Track } from "discord-player";

const SONGS_PER_PAGE = 5;
type PageActionType = "last" | "first" | -1 | 1 | 0;

function getMenu(queue: GuildQueue, pageAction?: PageActionType) {
  const action = pageAction ?? 0;

  const trackChunks = chunk(queue.tracks.toArray(), SONGS_PER_PAGE);

  const page = changeQueuePage(queue.guild, trackChunks.length, action);

  const tracks = trackChunks[page];

  const embed = getEmbed(queue, tracks ?? [], page + 1);

  const rows = getButtons({
    isPaused: queue.node.isPaused(),
    repeatMode: queue.repeatMode,
    queuePageNumber: page,
    totalPages: trackChunks.length,
  });

  return {
    embed: embed,
    rows: rows,
  };
}

export function createMusicMenu(queue: GuildQueue): MessageCreateOptions {
  const { embed, rows } = getMenu(queue);

  return {
    embeds: [embed],
    components: rows,
  };
}

export function getMusicMenu(
  queue: GuildQueue,
  pageAction?: PageActionType
): InteractionEditReplyOptions {
  const { embed, rows } = getMenu(queue, pageAction);

  return {
    embeds: [embed],
    components: rows,
  };
}

function getEmbed(queue: GuildQueue, tracks: Track[], currentPage: number) {
  const embed = new EmbedBuilder();

  setColor(embed, queue);
  setMetaData(embed, queue);
  setTitle(embed, queue);
  setTrackList(embed, queue, tracks, currentPage);

  return embed;
}

function setColor(embed: EmbedBuilder, queue: GuildQueue) {
  const isPlaying = queue.node.isPlaying();
  const isEmpty = queue.isEmpty() && !queue.currentTrack;

  if (isEmpty) {
    embed.setColor(Colors.error);
    return;
  }

  if (isPlaying) {
    embed.setColor(Colors.success);
    return;
  }

  embed.setColor(Colors.idle);
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

function setTrackList(
  embed: EmbedBuilder,
  queue: GuildQueue,
  chunkedTracks: Track[],
  currentPage: number
) {
  const tracks = chunkedTracks.map((track, index) => ({
    name: "\u200B",
    value: `**${SONGS_PER_PAGE * (currentPage - 1) + index + 1}. **(${
      track.duration
    }) **[${track.title}](${track.url})**`,
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

interface CreateButtonsProps {
  isPaused: boolean;
  repeatMode: number;
  queuePageNumber: number;
  totalPages: number;
}

function getButtons(props: CreateButtonsProps) {
  const { isPaused, repeatMode, queuePageNumber, totalPages } = props;

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
    emoji: "✖",
    style: ButtonStyle.Danger,
  });

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
    playButton,
    skipButton,
    repeatButton,
    shuffleButton,
    stopButton,
  ]);

  const rows = [actionRow];

  if (totalPages > 1) {
    const prevQueuePageId = createId(
      EVENT_NAMESPACES.music.action,
      EVENT_NAMESPACES.music.actions.prevQueuePage
    );

    const nextQueuePageId = createId(
      EVENT_NAMESPACES.music.action,
      EVENT_NAMESPACES.music.actions.nextQueuePage
    );

    const gotoLastQueuePageId = createId(
      EVENT_NAMESPACES.music.action,
      EVENT_NAMESPACES.music.actions.lastPage
    );

    const gotoFirstQueuePageId = createId(
      EVENT_NAMESPACES.music.action,
      EVENT_NAMESPACES.music.actions.firstPage
    );

    const prevQueuePageButton = createButton({
      customId: prevQueuePageId,
      emoji: "⬅",
      style: ButtonStyle.Primary,
      disabled: queuePageNumber - 1 < 0,
    });
    const nextQueuePageButton = createButton({
      customId: nextQueuePageId,
      emoji: "➡",
      style: ButtonStyle.Primary,
      disabled: queuePageNumber + 1 >= totalPages,
    });

    const goToFirstQueuePageButton = createButton({
      customId: gotoFirstQueuePageId,
      label: "First",
      style: ButtonStyle.Secondary,
      disabled: queuePageNumber === 0,
    });
    const clearQueuePageButton = createButton({
      customId: "current_page_number",
      label: `${queuePageNumber + 1} / ${totalPages}`,
      style: ButtonStyle.Success,
      disabled: true,
    });
    const goToLastQueuePageButton = createButton({
      customId: gotoLastQueuePageId,
      label: "Last",
      style: ButtonStyle.Secondary,
      disabled: queuePageNumber >= totalPages - 1,
    });

    const paginationRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      prevQueuePageButton,
      goToFirstQueuePageButton,
      clearQueuePageButton,
      goToLastQueuePageButton,
      nextQueuePageButton,
    ]);

    rows.push(paginationRow);
  }

  return rows;
}

type GuildPagination = {
  queue: number;
};

const serverPages = new Map<string, GuildPagination>();

function changeQueuePage(
  guild: Guild,
  totalPages: number,
  pageAction: PageActionType
) {
  const guildData = getGuildPage(guild.id);

  if (pageAction === 0) {
    if (totalPages <= 1) {
      guildData.queue = 0;
    } else if (guildData.queue + 1 >= totalPages) {
      guildData.queue = totalPages - 1;
    }

    return guildData.queue;
  }

  if (pageAction === "first") {
    guildData.queue = 0;
    return 0;
  }

  if (pageAction === "last") {
    guildData.queue = totalPages - 1;
    return totalPages - 1;
  }

  if (guildData.queue + pageAction >= totalPages) {
    guildData.queue = totalPages - 1;
    return guildData.queue;
  }

  if (guildData.queue + pageAction < 0) {
    guildData.queue = 0;
    return 0;
  }

  guildData.queue += pageAction;

  return guildData.queue;
}

function getGuildPage(id: string): GuildPagination {
  const guildData = serverPages.get(id);

  if (guildData) return guildData;

  const data = { queue: 0 };
  serverPages.set(id, data);
  return data;
}
