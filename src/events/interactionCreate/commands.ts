import commands from "../../commands";
import { ICommand } from "../../types";
import { EditReply, Reply, event } from "../../utils";

const allCommands = commands.map(({ commands }) => commands).flat();

const allCommandsMap = new Map<string, ICommand>(
  allCommands.map((command) => [command.meta.name, command])
);

export default event(
  "interactionCreate",
  async ({ log, client }, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
      const commandName = interaction.commandName;
      const command = allCommandsMap.get(commandName);

      if (!command) throw new Error(`Unknown command: ${commandName}`);

      await command.exec({
        client,
        interaction,
        log(...args) {
          log(`[${command.meta.name}]`, ...args);
        },
      });
    } catch (error) {
      log(["[Command Error]", error]);

      if (interaction.deferred)
        return interaction.editReply(
          EditReply.error("Something went wrong 😔")
        );

      return interaction.reply(Reply.error("Something went wrong 😔"));
    }
  }
);
