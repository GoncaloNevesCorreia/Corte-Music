import {
  APISelectMenuOption,
  EmbedBuilder,
  InteractionReplyOptions,
} from "discord.js";

import { EVENT_NAMESPACES } from "../../../../keys/events";
import { createId } from "../../../../utils";
import { createSelectMenu } from "../../../../utils/ui/selectMenu";

export function getSetupChannelSelection(
  options: APISelectMenuOption[],
  ephemeral?: boolean
): InteractionReplyOptions {
  const embed = new EmbedBuilder()
    .setTitle("Setup")
    .setDescription("Setup the music channel.");

  const selectId = createId(EVENT_NAMESPACES.setup.select);

  const selectMenu = createSelectMenu({ customId: selectId, options });

  return {
    embeds: [embed],
    components: [selectMenu],
    ephemeral,
  };
}
