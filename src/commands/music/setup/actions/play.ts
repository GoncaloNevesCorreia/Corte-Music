import { EmbedBuilder } from "discord.js";

import { IMessageCreateInteractionProps } from "../../../../types";
import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";
import { getMember } from "../../../../utils";

export async function playAction(props: IMessageCreateInteractionProps) {
  const { client, interaction, log } = props;

  const player = Player.singleton(client);

  if (!player) return;

  const member = getMember(interaction);

  const guild = interaction.guild;

  if (!member?.voice?.channel || !guild) {
    return;
  }

  if (!interaction.content) return;

  const searchResult = await player.search(interaction.content);

  if (!searchResult?.tracks?.length) {
    return;
  }

  const track = searchResult.tracks[0];

  MusicActions.enqueue(player, interaction, track);

  await MusicActions.play(player, interaction, member.voice.channel);
}
