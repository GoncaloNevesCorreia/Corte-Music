import { SlashCommandBuilder } from "discord.js";

import { command } from "../../../utils";
import { getHelpCategorySelection } from "./pages/categorySelection";

const meta = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Get a list of all commands for the bot.");

export default command(meta, async ({ interaction }) => {
  interaction.reply(getHelpCategorySelection(true));
});
