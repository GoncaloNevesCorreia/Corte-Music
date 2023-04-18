import { IButtonInteractionProps } from "../../../../types";

import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";

export async function stopAction(props: IButtonInteractionProps) {
  const { client, interaction, log } = props;

  const player = Player.singleton(client);

  await MusicActions.stop(player, interaction);
}
