import { Events, Message } from "discord.js";
import { event } from "../utils";
import { getServerData } from "../keys/servers";
import { playAction } from "../commands/music/setup/actions/play";

export default event(Events.MessageCreate, async ({ log, client }, message) => {
  const newMessage = await message.fetch();

  if (newMessage.author === client.user) return;

  if (!newMessage.guild || newMessage.author.bot) {
    deleteMessage(newMessage);
    return;
  }

  const serverData = getServerData(newMessage.guild.id);

  if (!serverData?.embedId || !serverData?.musicChannelId) {
    deleteMessage(newMessage);
    return;
  }

  if (newMessage.channelId !== serverData.musicChannelId) {
    deleteMessage(newMessage);
    return;
  }

  await playAction({ client, interaction: newMessage, log });

  deleteMessage(newMessage);
});

async function deleteMessage(message: Message) {
  try {
    await message.delete();
    console.log(`Deleted message with content: ${message.content}`);
  } catch (error) {
    console.error(
      `Failed to delete message with content: ${message.content}`,
      error
    );
  }
}
