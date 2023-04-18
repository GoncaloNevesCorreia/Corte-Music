import { IButtonInteractionProps } from "../../../../types";

import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";
import { getMusicMenu } from "../pages/musicMenu";

export async function repeatAction(props: IButtonInteractionProps) {
  const { client, interaction, log } = props;

  const player = Player.singleton(client);

  await MusicActions.repeat(player, interaction);
}
