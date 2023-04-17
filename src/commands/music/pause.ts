import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the music");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  await MusicActions.togglePlay(player, interaction, true);

  return interaction.reply({
    content: "Paused!",
    ephemeral: true,
  });
});
