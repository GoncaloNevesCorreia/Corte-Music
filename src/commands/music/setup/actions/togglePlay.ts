import { InteractionEditReplyOptions } from "discord.js";
import { Player } from "discord-player";

import { IButtonInteractionProps } from "../../../../types";
import { getMusicMenu } from "../pages/musicMenu";
import { MusicActions } from "../../../../config/music";

export async function togglePlayAction(
  props: IButtonInteractionProps
): Promise<InteractionEditReplyOptions | undefined> {
  const { client, interaction, log } = props;

  const player = Player.singleton(client);

  if (!player) return;

  await MusicActions.togglePlay(player, interaction);

  const queue = MusicActions.getQueue(player, interaction);

  if (!queue) return;

  return getMusicMenu(queue);
}