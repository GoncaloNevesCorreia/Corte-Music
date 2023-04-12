import { ButtonBuilder, ButtonStyle } from "discord.js";

type PropsProps = {
  customId: string;
  label: string;
  style?: ButtonStyle;
  disabled?: boolean;
};

export const createButton = (props: PropsProps) => {
  const { customId, label, disabled } = props;

  const backButton = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!!disabled);

  return backButton;
};
