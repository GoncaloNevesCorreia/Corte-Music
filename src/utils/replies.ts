import { InteractionReplyOptions, WebhookMessageEditOptions } from "discord.js";

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
        {
          color: Colors.error,
          description: msg,
        },
      ],
    };
  },
};

export const EditReply = {
  error(msg: string): WebhookMessageEditOptions {
    return {
      embeds: [
        {
          color: Colors.error,
          description: msg,
        },
      ],
    };
  },
};
