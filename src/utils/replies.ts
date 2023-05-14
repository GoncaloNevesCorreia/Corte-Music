import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import { createEmbed } from "./ui/embed";

export const Colors = {
  error: 0xed4245,
  success: 0x57f287,
  idle: 0xfee75c,
};

type PossibleInteractions =
  | ButtonInteraction
  | ChatInputCommandInteraction
  | StringSelectMenuInteraction;

export const Reply = {
  async error(
    interaction: PossibleInteractions,
    msg: string,
    deleteMsg = true
  ) {
    return await interaction
      .reply({
        ephemeral: true,
        embeds: [
          createEmbed({
            title: msg,
            color: Colors.error,
          }),
        ],
      })
      .then((msg) => {
        if (!deleteMsg) return;

        setTimeout(() => msg.delete(), 10000);
      });
  },
  async success(
    interaction: PossibleInteractions,
    msg: string,
    deleteMsg = true
  ) {
    return await interaction
      .reply({
        ephemeral: true,
        embeds: [
          createEmbed({
            title: msg,
            color: Colors.success,
          }),
        ],
      })
      .then((msg) => {
        if (!deleteMsg) return;

        setTimeout(() => msg.delete(), 10000);
      });
  },
};

export const EditReply = {
  async error(
    interaction: PossibleInteractions,
    msg: string,
    deleteMsg = false
  ) {
    return await interaction
      .editReply({
        embeds: [
          createEmbed({
            title: msg,
            color: Colors.error,
          }),
        ],
      })
      .then((msg) => {
        if (!deleteMsg) return;

        setTimeout(() => msg.delete(), 10000);
      });
  },
  async success(
    interaction: PossibleInteractions,
    msg: string,
    deleteMsg = false
  ) {
    return await interaction
      .editReply({
        embeds: [
          createEmbed({
            title: msg,
            color: Colors.success,
          }),
        ],
      })
      .then((msg) => {
        if (!deleteMsg) return;

        setTimeout(() => msg.delete(), 10000);
      });
  },
};
