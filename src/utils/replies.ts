import { InteractionReplyOptions, WebhookMessageEditOptions } from "discord.js";
import { createEmbed } from "./ui/embed";

export const Colors = {
  error: 0xed4245,
  success: 0x57f287,
  idle: 0xfee75c,
};

export const Reply = {
  error(msg: string): InteractionReplyOptions {
    return {
      ephemeral: true,
      embeds: [
        createEmbed({
          title: msg,
          color: Colors.error,
        }),
      ],
    };
  },
  success(msg: string): InteractionReplyOptions {
    return {
      ephemeral: true,
      embeds: [
        createEmbed({
          title: msg,
          color: Colors.success,
        }),
      ],
    };
  },
};

export const EditReply = {
  error(msg: string): WebhookMessageEditOptions {
    return {
      embeds: [
        createEmbed({
          title: msg,
          color: Colors.error,
        }),
      ],
    };
  },
  success(msg: string): WebhookMessageEditOptions {
    return {
      embeds: [
        createEmbed({
          title: msg,
          color: Colors.success,
        }),
      ],
    };
  },
};
