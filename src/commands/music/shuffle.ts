import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffles all the tracks in the queue");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  await MusicActions.shuffle(player, interaction);

  return interaction.reply({
    content: "shuffling...",
    ephemeral: true,
  });
});
