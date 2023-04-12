import {
  APISelectMenuOption,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

type SelectMenuProps = {
  customId: string;
  placeholder?: string;
  options: APISelectMenuOption[];
};

export const createSelectMenu = (props: SelectMenuProps) => {
  const { customId, placeholder, options } = props;

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder ?? "Nothing selected")
      .addOptions(...options)
  );

  return row;
};
