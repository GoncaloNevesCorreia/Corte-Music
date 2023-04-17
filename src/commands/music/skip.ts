import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip to next track in queue")
  .addNumberOption((option) =>
    option
      .setName("track-number")
      .setDescription("Provide the bot a message to respond with.")
      .setRequired(false)
  );

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const trackNumber = interaction.options.getNumber("trackNumber");

  if (!trackNumber === undefined || trackNumber === null) {
    await MusicActions.skip(player, interaction);
  } else {
    await MusicActions.skip(player, interaction, trackNumber);
  }

  return interaction.reply({
    content: "Skiping track...",
    ephemeral: true,
  });
});
