import { IButtonInteractionProps } from "../../../../types";

import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";
import { getMusicMenu } from "../pages/musicMenu";

export async function skipAction(props: IButtonInteractionProps) {
  const { client, interaction } = props;

  const player = Player.singleton(client);

  MusicActions.skip(player, interaction);
}
