import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the music");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  await MusicActions.togglePlay(player, interaction, false);

  return interaction.reply({
    content: "Resuming...",
    ephemeral: true,
  });
});
