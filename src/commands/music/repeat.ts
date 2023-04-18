import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("Changes the Repeat Mode")
  .addNumberOption((option) =>
    option
      .setName("mode")
      .setDescription("The first number")
      .setRequired(true)
      .addChoices(
        { name: "OFF", value: 0 },
        { name: "TRACK", value: 1 },
        { name: "QUEUE", value: 2 },
        { name: "AUTOPLAY", value: 3 }
      )
  );

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const mode = interaction.options.getNumber("mode", true);

  await MusicActions.repeat(player, interaction, mode);

  const modeName = ["OFF", "TRACK", "QUEUE", "AUTOPLAY"][mode];

  await interaction.reply({
    content: `Repeat mode is set to **${modeName}**`,
    ephemeral: true,
  });
});
