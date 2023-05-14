import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Reply, command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Sets the volume of the player")
  .addNumberOption((option) =>
    option
      .setName("volume")
      .setDescription("The volume of the player from 1 to 100")
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
  );

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const volume = interaction.options.getNumber("volume", true);

  await MusicActions.volume(player, interaction, volume);

  return interaction.reply(Reply.success(`Setting Volume to ${volume}...`));
});
