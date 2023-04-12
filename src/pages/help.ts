import {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuOptionBuilder,
} from "discord.js";

import CategoryRoot from "../commands";
import { chunk, createId, readId } from "../utils";
import { StringSelectMenuBuilder } from "discord.js";
import { ActionRowBuilder } from "discord.js";
import { APIEmbedField } from "discord.js";
import { EVENT_NAMESPACES } from "../keys/events";

export function getCategoryRoot(ephemeral?: boolean): InteractionReplyOptions {
  const mappedCategories = CategoryRoot.map(
    ({ name, description, emoji }) =>
      new StringSelectMenuOptionBuilder({
        label: name,
        description,
        emoji,
        value: name,
      })
  );

  const embed = new EmbedBuilder()
    .setTitle("Help Menu")
    .setDescription("Browse through all commands.");

  const selectId = createId(EVENT_NAMESPACES.help.select);

  const select = new StringSelectMenuBuilder()
    .setCustomId(selectId)
    .setPlaceholder("Command Category")
    .setMaxValues(1)
    .setOptions(mappedCategories);

  const component =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

  return {
    embeds: [embed],
    components: [component],
    ephemeral,
  };
}

export function getCategoryPage(
  interactionId: string
): InteractionReplyOptions {
  const [_namespace, categoryName, action, currentOffset] =
    readId(interactionId);

  const categoryChunks = CategoryRoot.map((category) => {
    const commands: APIEmbedField[] = category.commands.map((command) => ({
      name: command.meta.name,
      value: command.meta.description,
    }));

    return {
      ...category,
      commands: chunk(commands, 10),
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

  const backButton = new ButtonBuilder()
    .setCustomId(backId)
    .setLabel("Back")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(offset <= 0);

  const rootId = createId(EVENT_NAMESPACES.help.root);
  const rootButton = new ButtonBuilder()
    .setCustomId(rootId)
    .setLabel("Categories")
    .setStyle(ButtonStyle.Secondary);

  const nextId = createId(
    EVENT_NAMESPACES.help.action,
    EVENT_NAMESPACES.help.actions.next,
    offset
  );

  const nextButton = new ButtonBuilder()
    .setCustomId(nextId)
    .setLabel("Next")
    .setStyle(ButtonStyle.Success)
    .setDisabled(offset >= category.commands.length - 1);

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
