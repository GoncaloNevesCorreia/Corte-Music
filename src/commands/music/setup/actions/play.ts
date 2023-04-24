import { IMessageCreateInteractionProps } from "../../../../types";
import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";
import { getMember } from "../../../../utils";

export async function playAction(props: IMessageCreateInteractionProps) {
  const { client, interaction } = props;

  const player = Player.singleton(client);

  const member = getMember(interaction);

  const guild = interaction.guild;

  if (!member?.voice?.channel || !guild) {
    return;
  }

  if (!interaction.content) return;

  const searchResult = await player.search(interaction.content, {
    requestedBy: interaction.author,
  });

  if (!searchResult?.tracks?.length) {
    return;
  }

  if (searchResult.playlist) {
    const tracks = searchResult.playlist.tracks;
    await MusicActions.enqueue(player, interaction, tracks);
  } else {
    const track = searchResult.tracks[0];

    MusicActions.enqueue(player, interaction, track);
  }

  await MusicActions.play(player, interaction, member.voice.channel);
}
