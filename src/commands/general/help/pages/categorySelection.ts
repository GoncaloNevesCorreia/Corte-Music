import { EmbedBuilder, InteractionReplyOptions } from "discord.js";

import commands from "../../..";
import { EVENT_NAMESPACES } from "../../../../keys/events";
import { createId } from "../../../../utils";
import { createSelectMenu } from "../../../../utils/ui/selectMenu";

export function getHelpCategorySelection(
  ephemeral?: boolean
): InteractionReplyOptions {
  const mappedCategories = commands.map(({ name, description, emoji }) => ({
    label: name,
    description,
    emoji,
    value: name,
  }));

  const embed = new EmbedBuilder()
    .setTitle("Help Menu")
    .setDescription("Browse through all commands.");

  const selectId = createId(EVENT_NAMESPACES.help.select);

  const selectMenu = createSelectMenu({
    customId: selectId,
    placeholder: "Command Category",
    options: mappedCategories,
  });

  return {
    embeds: [embed],
    components: [selectMenu],
    ephemeral,
  };
}
