import { IButtonInteractionProps } from "../../../../types";

import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";
import { getMusicMenu } from "../pages/musicMenu";

export async function shuffleAction(props: IButtonInteractionProps) {
  const { client, interaction } = props;

  const player = Player.singleton(client);

  await MusicActions.shuffle(player, interaction);
}
