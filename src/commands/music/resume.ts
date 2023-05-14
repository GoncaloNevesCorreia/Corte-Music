import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Reply, command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the music");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const wasResumed = await MusicActions.togglePlay(player, interaction, false);

  if (!wasResumed)
    return interaction.reply(
      Reply.error("No song to resume... the queue is empty.")
    );

  return interaction.reply(Reply.success("Resuming..."));
});
