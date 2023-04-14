import { Interaction, Guild, Message } from "discord.js";

export function createId(namespace: string, ...args: unknown[]): string {
  return `${namespace};${args.join(";")}`;
}

export function readId(id: string): [namespace: string, ...args: string[]] {
  const [namespace, ...args] = id.split(";");
  return [namespace, ...args];
}

export function getMember(interaction: Interaction | Message) {
  if (!interaction.guild) {
    return;
  }

  if (interaction instanceof Message) {
    return interaction.member;
  }

  return interaction.guild.members.cache.get(interaction.user.id);
}

export function getChannelById(guild: Guild, channelId: string) {
  const channel = guild.channels.cache.get(channelId);
  return channel;
}
