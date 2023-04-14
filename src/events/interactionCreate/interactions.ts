import { EVENT_NAMESPACES } from "../../keys/events";
import { EditReply, Reply, event, readId } from "../../utils";
import { Events } from "discord.js";

export default event(
  Events.InteractionCreate,
  async ({ log, client }, interaction) => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

    const [namespace] = readId(interaction.customId);

    Object.values(EVENT_NAMESPACES).forEach(async (event) => {
      if (!Object.values(event).includes(namespace)) return;

      try {
        await interaction.deferUpdate();

        if (interaction.isButton()) {
          if ("onClick" in event) {
            event.onClick({ interaction, namespace, client, log });
          }
        } else {
          if ("onSelect" in event) {
            event.onSelect({ interaction, namespace, client, log });
          }
        }
      } catch (error) {
        log([`[${event.name} Error]`, error]);

        if (interaction.deferred)
          return interaction.editReply(
            EditReply.error("Something went wrong 😔")
          );

        return interaction.reply(Reply.error("Something went wrong 😔"));
      }
    });
  }
);
