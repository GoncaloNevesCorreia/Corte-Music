import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { command, createId } from "../../utils";

import { createSelectMenu } from "../../utils/ui/selectMenu";
import { EVENT_NAMESPACES } from "../../keys/events";
import { ChannelType } from "discord.js";

const meta = new SlashCommandBuilder()
  .setName("setup")
  .setDescription("Setup the music channel");

export default command(meta, async ({ interaction }) => {
  // const allChannels = await interaction.guild?.channels.fetch();

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

  const embed = new EmbedBuilder()
    .setTitle("Setup")
    .setDescription("Setup the music channel.");

  const selectId = createId(EVENT_NAMESPACES.setup.select);

  const selectMenu = createSelectMenu({ customId: selectId, options });

  await interaction.reply({
    embeds: [embed],
    components: [selectMenu],
    ephemeral: true,
  });
});
