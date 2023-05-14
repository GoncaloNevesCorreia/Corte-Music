import { EmbedBuilder, ColorResolvable } from "discord.js";

type PropsProps = {
  title: string;
  description?: string;
  color?: ColorResolvable;
};

export const createEmbed = (props: PropsProps) => {
  const { title, description, color } = props;

  const embed = new EmbedBuilder().setTitle(title).setColor(color ?? "Random");

  if (description) embed.setDescription(description);

  return embed;
};
