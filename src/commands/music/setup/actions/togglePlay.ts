import { Player } from "discord-player";

import { IButtonInteractionProps } from "../../../../types";

import { MusicActions } from "../../../../config/music";
import { Reply } from "../../../../utils";

export async function togglePlayAction(props: IButtonInteractionProps) {
  const { client, interaction } = props;

  const player = Player.singleton(client);

  await MusicActions.togglePlay(player, interaction);
}
