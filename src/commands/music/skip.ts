import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Reply, command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip to next track in queue")
  .addNumberOption((option) =>
    option
      .setName("track-number")
      .setDescription("The number of the track in the queue to skip to")
      .setRequired(false)
  );

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const trackNumber = interaction.options.getNumber("track-number");

  if (trackNumber === undefined || trackNumber === null) {
    const wasSkipped = MusicActions.skip(player, interaction);

    if (!wasSkipped) {
      return await interaction.reply(
        Reply.error("No song to skip... The Queue is Empty.")
      );
    }
  } else {
    const trackIndex = trackNumber - 1;
    const tracks = await MusicActions.getTracks(player, interaction);

    if (trackIndex <= 0 || !tracks || trackIndex > tracks.length)
      return await interaction.reply(Reply.error("Track not found..."));

    MusicActions.skip(player, interaction, trackIndex);
  }

  return await interaction.reply(Reply.success("Skiping track..."));
});
