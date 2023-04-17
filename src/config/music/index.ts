import { Interaction, VoiceBasedChannel, Message } from "discord.js";
import { Player, Track } from "discord-player";

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

    if (!queue?.connection) return false;

    if (queue.node.isPaused() || pause) {
      queue.node.resume();
      return false;
    }

    queue.node.pause();
    return true;
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

      return;
    }

    queue.node.skip();
  },
  shuffle: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);
    if (!queue) return;

    queue.tracks.shuffle();
  },

  stop: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return;

    queue.node.stop();

    if (queue.connection) {
      queue.connection.disconnect();
    }

    queue.delete();
  },

  repeat: async function (player: Player, interaction: Interaction | Message) {
    const queue = this.getQueue(player, interaction);

    if (!queue) return false;

    if (queue.repeatMode === 0) {
      queue.setRepeatMode(1);
      return true;
    }

    queue.setRepeatMode(0);
    return false;
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
