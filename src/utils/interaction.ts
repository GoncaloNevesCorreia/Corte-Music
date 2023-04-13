import { ChatInputCommandInteraction } from "discord.js";

export function createId(namespace: string, ...args: unknown[]): string {
  return `${namespace};${args.join(";")}`;
}

export function readId(id: string): [namespace: string, ...args: string[]] {
  const [namespace, ...args] = id.split(";");
  return [namespace, ...args];
}

export function getMember(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return;
  }

  const member = interaction.guild.members.cache.get(interaction.user.id);

  return member;
}
