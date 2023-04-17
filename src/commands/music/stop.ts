import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Leaves the channel and clears the queue");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  await MusicActions.stop(player, interaction);

  return interaction.reply({
    content: "Cya...",
    ephemeral: true,
  });
});
