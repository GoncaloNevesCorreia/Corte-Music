import { InteractionEditReplyOptions } from "discord.js";

import { IButtonInteractionProps } from "../../../../types";
import { getMusicMenu } from "../pages/musicMenu";
import { Player } from "discord-player";
import { MusicActions } from "../../../../config/music";

export async function repeatAction(
  props: IButtonInteractionProps
): Promise<InteractionEditReplyOptions | undefined> {
  const { client, interaction, log } = props;

  const player = Player.singleton(client);

  await MusicActions.repeat(player, interaction);

  const queue = MusicActions.getQueue(player, interaction);

  if (!queue) return;

  return getMusicMenu(queue);
}
