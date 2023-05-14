import {
  APIEmbedField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
} from "discord.js";
import { chunk, createId, readId } from "../../../../utils";

import { EVENT_NAMESPACES } from "../../../../keys/events";
import commands from "../../..";
import { createButton } from "../../../../utils/ui/button";

export function getHelpCategoryPage(
  interactionId: string
): InteractionReplyOptions {
  const [_namespace, categoryName, action, currentOffset] =
    readId(interactionId);

  const categoryChunks = commands.map((category) => {
    const commands: APIEmbedField[] = category.commands.map((command) => ({
      name: command.meta.name,
      value: command.meta.description,
    }));

    return {
      ...category,
      commands: chunk(commands, 5),
    };
  });

  const category = categoryChunks.find(({ name }) => name === categoryName);

  if (!category)
    throw new Error(
      "Invalid Interaction; Failed to find corresponding category page!"
    );

  let offset = parseInt(currentOffset);

  if (isNaN(offset)) offset = 0;

  if (action === EVENT_NAMESPACES.help.actions.next) offset++;
  else if (action === EVENT_NAMESPACES.help.actions.back) offset--;

  const emoji = category.emoji ? `${category.emoji} ` : "";
  const defaultDescription = `Browse through ${
    category.commands.flat().length
  } commands in ${emoji}${category.name}`;

  const embed = new EmbedBuilder()
    .setTitle(`${emoji}${category.name} Commands`)
    .setDescription(category.description ?? defaultDescription)
    .setFields(category.commands[offset])
    .setFooter({ text: `${offset + 1} / ${category.commands.length}` });

  const backId = createId(
    EVENT_NAMESPACES.help.action,
    category.name,
    EVENT_NAMESPACES.help.actions.back,
    offset
  );

  const rootId = createId(EVENT_NAMESPACES.help.root);

  const nextId = createId(
    EVENT_NAMESPACES.help.action,
    category.name,
    EVENT_NAMESPACES.help.actions.next,
    offset
  );

  const backButton = createButton({
    customId: backId,
    label: "Back",
    disabled: offset <= 0,
    style: ButtonStyle.Danger,
  });

  const rootButton = createButton({
    customId: rootId,
    label: "Categories",
    style: ButtonStyle.Secondary,
  });

  const nextButton = createButton({
    customId: nextId,
    label: "Next",
    style: ButtonStyle.Success,
    disabled: offset >= category.commands.length - 1,
  });

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(
    backButton,
    rootButton,
    nextButton
  );

  return {
    embeds: [embed],
    components: [component],
  };
}
