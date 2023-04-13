import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("Leaves the channel and clears the queue");

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  if (!player) return;

  const repeatOn = await MusicActions.repeat(player, interaction);

  return interaction.reply({
    content: `Repeat mode is ${repeatOn ? "on" : "off"}`,
    ephemeral: true,
  });
});
