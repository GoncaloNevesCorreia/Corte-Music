import {
  ButtonBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
} from "discord.js";

type PropsProps = {
  customId: string;
  label?: string;
  style?: ButtonStyle;
  disabled?: boolean;
  emoji?: ComponentEmojiResolvable;
};

export const createButton = (props: PropsProps) => {
  const { customId, label, disabled, style, emoji } = props;

  const backButton = new ButtonBuilder()
    .setCustomId(customId)
    .setStyle(style ?? ButtonStyle.Primary)
    .setDisabled(!!disabled);

  if (label) {
    backButton.setLabel(label);
  }

  if (emoji) {
    backButton.setEmoji(emoji);
  }

  return backButton;
};
