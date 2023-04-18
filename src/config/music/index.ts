import {
  Interaction,
  VoiceBasedChannel,
  Message,
  ButtonInteraction,
} from "discord.js";
import { Player, Track } from "discord-player";
import { updateMusicMenu } from "./events";

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
    track: Track
  ) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    queue.addTrack(track);
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
  getQueue: function (player: Player, interaction: Interaction | Message) {
    if (!interaction.guild) return;

    const queue = player.nodes.get(interaction.guild);

    if (!queue)
      return player.nodes.create(interaction.guild, {
        metadata: interaction,
        selfDeaf: true,
        volume: 80,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000,
      });

    return queue;
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
