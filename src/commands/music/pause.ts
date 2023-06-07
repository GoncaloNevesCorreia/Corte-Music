import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Reply, command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the music");

export default command(meta, async ({ interaction, client }) => {
  // return Reply.success(interaction, "ISTO É UM TESTE DE WORKFLOW");

  const player = Player.singleton(client);

  const wasPaused = await MusicActions.togglePlay(player, interaction, true);

  if (!wasPaused)
    return Reply.error(interaction, "No song to pause... the queue is empty.");

  return Reply.success(interaction, "The Current Song was paused!");
});
