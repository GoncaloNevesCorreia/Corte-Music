import { ChatInputCommandInteraction, VoiceBasedChannel } from "discord.js";
import { Player, Track } from "discord-player";

export const MusicActions = {
  play: async function (
    player: Player,
    interaction: ChatInputCommandInteraction,
    channel: VoiceBasedChannel
  ) {
    const queue = getQueue(player, interaction);

    if (!queue) return;

    if (queue.isPlaying()) return;

    if (!queue.connection) {
      await queue.connect(channel);
    }

    queue.node.play();
  },
  enqueue: async function (
    player: Player,
    interaction: ChatInputCommandInteraction,
    track: Track
  ) {
    const queue = getQueue(player, interaction);

    if (!queue) return;

    queue.addTrack(track);
  },
  togglePlay: async function (
    player: Player,
    interaction: ChatInputCommandInteraction,
    pause: boolean
  ) {
    const queue = getQueue(player, interaction);

    if (!queue?.connection) return;

    if (pause) {
      queue.node.pause();
      return;
    }

    queue.node.resume();
  },
  skip: async function (
    player: Player,
    interaction: ChatInputCommandInteraction,
    trackNumber: number | null
  ) {
    const queue = getQueue(player, interaction);

    if (!queue) return;

    if (trackNumber) {
      queue.node.skipTo(trackNumber);
      return;
    }

    queue.node.skip();
  },
  shuffle: async function (
    player: Player,
    interaction: ChatInputCommandInteraction
  ) {
    const queue = getQueue(player, interaction);
    if (!queue) return;

    queue.tracks.shuffle();
  },

  stop: async function (
    player: Player,
    interaction: ChatInputCommandInteraction
  ) {
    const queue = getQueue(player, interaction);

    if (!queue) return;

    queue.node.stop();

    if (queue.connection) {
      queue.connection.disconnect();
    }

    queue.delete();
  },

  repeat: async function (
    player: Player,
    interaction: ChatInputCommandInteraction
  ) {
    const queue = getQueue(player, interaction);

    if (!queue) return false;

    if (queue.repeatMode === 0) {
      queue.setRepeatMode(1);
      return true;
    }

    queue.setRepeatMode(0);
    return false;
  },

  getTracks: async function (
    player: Player,
    interaction: ChatInputCommandInteraction
  ) {
    const queue = getQueue(player, interaction);

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

const getQueue = (player: Player, interaction: ChatInputCommandInteraction) => {
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
};
