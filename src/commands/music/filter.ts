import { MusicActions } from "../../config/music";
import { Player, QueueFilters } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

type Filters = keyof QueueFilters;

const filters: Filters[] = [
  "8D",
  "bassboost",
  "earrape",
  "karaoke",
  "chorus",
  "lofi",
  "nightcore",
];

const filterOptions = filters.map((filter) => ({
  name: filter,
  value: filter,
}));

const meta = new SlashCommandBuilder()
  .setName("filter")
  .setDescription("Allows you to add a filter to the player")

  .addStringOption((option) =>
    option
      .setName("filter")
      .setDescription("The filter you want to add")
      .setChoices(...filterOptions)
      .setRequired(false)
  );

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const filter = interaction.options.getString("filter") as Filters | null;

  await MusicActions.filter(player, interaction, filter);

  if (!filter)
    return interaction.reply({
      content: `Disabled Active Filters...`,
      ephemeral: true,
    });

  return interaction.reply({
    content: `Setting Filter to ${filter}...`,
    ephemeral: true,
  });
});
