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

    if (!queue) return;

    if (queue.isPlaying()) return;

    if (!queue.connection) {
      await queue.connect(channel);
    }

    queue.node.play();
  },
  enqueue: async function (
    player: Player,
    interaction: Interaction | Message,
    track: Track | Track[]
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    if (Array.isArray(track) && track.length > 0) {
      const last = track.pop() as Track;

      queue.tracks.add(track);
      queue.addTrack(last);
      return;
    }

    queue.addTrack(track);
  },
  volume: async function (
    player: Player,
    interaction: Interaction | Message,
    volume: number
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    queue.node.setVolume(volume);
  },
  togglePlay: async function (
    player: Player,
    interaction: Interaction | Message,
    pause?: boolean
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue?.connection) return;

    if (queue.node.isPaused() || pause === false) {
      queue.node.resume();
    } else {
      queue.node.pause();
    }

    if (interaction instanceof ButtonInteraction)
      updateMusicMenu(queue, interaction);
    else updateMusicMenu(queue);
  },
  skip: function (
    player: Player,
    interaction: Interaction | Message,
    trackNumber?: number
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    if (trackNumber) {
      queue.node.skipTo(trackNumber);
    } else {
      queue.node.skip();
    }
  },
  shuffle: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);
    if (!queue) return;

    queue.tracks.shuffle();

    if (interaction instanceof ButtonInteraction)
      updateMusicMenu(queue, interaction);
    else updateMusicMenu(queue);
  },

  stop: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    queue.node.stop();

    if (queue.connection) {
      queue.connection.disconnect();
    }

    queue.setRepeatMode(0);

    queue.delete();
  },

  repeat: async function (
    player: Player,
    interaction: Interaction | Message,
    repeatMode?: number
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    const mode =
      repeatMode === undefined ? (queue.repeatMode + 1) % 4 : repeatMode;

    queue.setRepeatMode(mode);

    if (interaction instanceof ButtonInteraction)
      updateMusicMenu(queue, interaction);
    else updateMusicMenu(queue);
  },

  filter: async function (
    player: Player,
    interaction: Interaction | Message,
    filter: Filters | null
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    const enabledFilters = queue.filters.ffmpeg.getFiltersEnabled();

    if (!filter) return await queue.filters.ffmpeg.toggle(enabledFilters);

    await queue.filters.ffmpeg.toggle([...enabledFilters, filter]);

    // if (filter) await queue.filters.ffmpeg.setFilters([filter]);
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
