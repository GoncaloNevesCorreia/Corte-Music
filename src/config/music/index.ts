import {
  Interaction,
  VoiceBasedChannel,
  Message,
  ButtonInteraction,
} from "discord.js";
import {
  GuildQueue,
  Player,
  QueueFilters,
  SearchQueryType,
  Track,
  useQueue,
} from "discord-player";
import { updateMusicMenu } from "./events";

import ytdl from "ytdl-core";

type Filters = keyof QueueFilters;

export const MusicActions = {
  play: async function (
    player: Player,
    interaction: Interaction | Message,
    channel: VoiceBasedChannel
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (queue.isPlaying()) return false;

    if (!queue.connection) {
      await queue.connect(channel);
    }

    queue.node.play();

    return true;
  },
  enqueue: async function (
    player: Player,
    interaction: Interaction | Message,
    track: Track | Track[]
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (Array.isArray(track) && track.length > 0) {
      const last = track.pop() as Track;

      queue.tracks.add(track);
      queue.addTrack(last);
      return true;
    }

    queue.addTrack(track);

    return true;
  },
  volume: async function (
    player: Player,
    interaction: Interaction | Message,
    volume: number
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    queue.node.setVolume(volume);

    return true;
  },
  togglePlay: async function (
    player: Player,
    interaction: Interaction | Message,
    pause?: boolean
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue?.connection) return false;

    if (queue.node.isPaused() || pause === false) {
      queue.node.resume();
    } else {
      queue.node.pause();
    }

    if (interaction instanceof ButtonInteraction)
      updateMusicMenu(queue, interaction);
    else updateMusicMenu(queue);

    return true;
  },
  skip: function (
    player: Player,
    interaction: Interaction | Message,
    trackNumber?: number
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (trackNumber) {
      queue.node.skipTo(trackNumber);
    } else {
      queue.node.skip();
    }

    return true;
  },
  shuffle: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (!queue.tracks.size && !queue.currentTrack) return false;

    queue.tracks.shuffle();

    if (interaction instanceof ButtonInteraction)
      updateMusicMenu(queue, interaction);
    else updateMusicMenu(queue);

    return true;
  },

  stop: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (!queue.connection && !queue.tracks.size && !queue.currentTrack)
      return false;

    queue.node.stop();

    if (queue.connection) {
      queue.connection.disconnect();
    }

    queue.setRepeatMode(0);

    queue.delete();

    return true;
  },

  repeat: async function (
    player: Player,
    interaction: Interaction | Message,
    repeatMode?: number
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (!queue.tracks.size && !queue.currentTrack) return false;

    const mode =
      repeatMode === undefined ? (queue.repeatMode + 1) % 4 : repeatMode;

    queue.setRepeatMode(mode);

    if (interaction instanceof ButtonInteraction)
      updateMusicMenu(queue, interaction);
    else updateMusicMenu(queue);

    return true;
  },

  filter: async function (
    player: Player,
    interaction: Interaction | Message,
    filter: Filters | null
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (!queue.tracks.size && !queue.currentTrack) return false;

    const enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();

    if (!filter) {
      await queue.filters.ffmpeg.toggle(enabledFilters);
      return true;
    }

    const filters = new Set<keyof QueueFilters>([...enabledFilters, filter]);

    await queue.filters.ffmpeg.toggle([...filters]);

    return true;
  },
  getQueue: function (player: Player, interaction: Interaction | Message) {
    if (!interaction.guild) return;

    const queue = player.nodes.get(interaction.guild);

    if (queue) return queue;

    return player.nodes.create(interaction.guild, {
      metadata: interaction,
      selfDeaf: true,
      volume: 20,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 300000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 300000,
      onBeforeCreateStream: async function (
        track: Track,
        queryType: SearchQueryType,
        queue: GuildQueue
      ) {
        switch (queryType) {
          case "youtubeVideo": {
            return ytdl(track.url, {
              filter: "audioonly",
              quality: "highestaudio",
              highWaterMark: 1 << 25,
            });
          }
          default:
            return null;
        }
      },
    });
  },
  getTracks: async function (
    player: Player,
    interaction: Interaction | Message
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    return queue.tracks.map((track, index) => {
      return {
        title: track.title,
        url: track.url,
        duration: track.duration,
        position: index + 1,
      };
    });
  },
};
