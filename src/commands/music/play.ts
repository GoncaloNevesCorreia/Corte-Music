import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { MusicActions } from "../../config/music";
import { Player } from "discord-player";
import { command } from "../../utils";

const meta = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Youtube URL or Song Title")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  );

export default command(meta, async ({ interaction, client }) => {
  const player = Player.singleton(client);

  const member = getMember(interaction);

  const guild = interaction.guild;

  if (!member?.voice?.channel || !guild) {
    return interaction.reply({
      content: "You are not in a voice channel!",
      ephemeral: true,
    });
  }

  const query = interaction.options.getString("query", true);

  const searchResult = await player.search(query, {
    requestedBy: interaction.user,
  });

  if (!searchResult?.tracks?.length) {
    return interaction.reply({
      content: "No results found!",
      ephemeral: true,
    });
  }

  const embed = new EmbedBuilder();

  if (searchResult.playlist) {
    const tracks = searchResult.playlist.tracks;

    await MusicActions.enqueue(player, interaction, tracks);

    embed.setDescription(
      `Playlist with **${tracks.length}** was added to the Queue`
    );
  } else {
    const track = searchResult.tracks[0];

    MusicActions.enqueue(player, interaction, track);

    embed
      .setDescription(
        `**[${track.title}](${track.url})** has been added to the Queue`
      )
      .setThumbnail(track.thumbnail)
      .setFooter({ text: `Duration: ${track.duration}` });
  }

  await MusicActions.play(player, interaction, member.voice.channel);

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
});

function getMember(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return;
  }

  const member = interaction.guild.members.cache.get(interaction.user.id);

  return member;
}
