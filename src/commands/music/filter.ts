import { MusicActions } from "../../config/music";
import { Player, QueueFilters } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Reply, command } from "../../utils";

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

  const filterWasSet = await MusicActions.filter(player, interaction, filter);

  if (!filterWasSet) {
    return Reply.error(interaction, "Can't set a filter on a Empty Queue.");
  }

  if (!filter) return Reply.success(interaction, "Disabled Active Filters...");

  return Reply.success(interaction, `Setting Filter to ${filter}...`);
});
