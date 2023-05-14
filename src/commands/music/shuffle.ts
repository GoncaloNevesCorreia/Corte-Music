import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { Reply, command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffles all the tracks in the queue");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const wasShuffled = await MusicActions.shuffle(player, interaction);

  if (wasShuffled)
    return Reply.error(interaction, "No song to play... the queue is empty.");

  return Reply.success(interaction, "shuffling Queue...");
});
