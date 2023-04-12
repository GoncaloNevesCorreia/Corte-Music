import { SlashCommandBuilder } from "discord.js";

import { ChannelType } from "discord.js";
import { command } from "../../../utils";

import { getSetupChannelSelection } from "./pages/channelSelection";

const meta = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Setup the music channel");

export default command(meta, async ({ interaction }) => {
  const textChannels = interaction.guild?.channels.cache.filter(
    (channel) => channel.type === ChannelType.GuildText
  );

  if (!textChannels) {
    await interaction.reply({
      content: "There are no channels in this guild",
      ephemeral: true,
    });
    return;
  }

  const options = textChannels.map((channel) => ({
    label: channel.name,
    value: channel.id,
  }));

  await interaction.reply(getSetupChannelSelection(options, true));
});
