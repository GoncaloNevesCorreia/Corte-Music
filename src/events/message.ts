import { Events, Message } from "discord.js";
import { event } from "../utils";
import { getServerData } from "../keys/servers";
import { playAction } from "../commands/music/setup/actions/play";

export default event(Events.MessageCreate, async ({ log, client }, message) => {
  const newMessage = await message.fetch();

  if (newMessage.author === client.user) return;

  if (!newMessage.guild || newMessage.author.bot) {
    return;
  }

  const serverData = getServerData(newMessage.guild.id);

  if (!serverData?.embedId || !serverData?.musicChannelId) {
    return;
  }

  if (newMessage.channelId !== serverData.musicChannelId) {
    return;
  }

  await playAction({ client, interaction: newMessage, log });

  await deleteMessage(newMessage);
});

async function deleteMessage(message: Message) {
  try {
    if (!message.deletable) return;

    await message.delete();
  } catch (error) {
    console.error(
      `Failed to delete message with content: ${message.content}`,
      error
    );
  }
}
