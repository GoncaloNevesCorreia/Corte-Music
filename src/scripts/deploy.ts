import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "..", "..", ".env") });

import { REST, Routes, APIUser } from "discord.js";
import commands from "../commands";
import keys from "../keys";

const body = commands
  .map(({ commands }) => commands.map(({ meta }) => meta))
  .flat();

const rest = new REST({ version: "10" }).setToken(keys.clientToken);

function isProduction() {
  return process.env.NODE_ENV === "production";
}

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint = isProduction()
    ? Routes.applicationCommands(currentUser.id)
    : Routes.applicationGuildCommands(currentUser.id, keys.testGuild);

  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    const response = isProduction()
      ? `Successfully released commands in production as ${tag}!`
      : `Successfully released commands in development in ${keys.testGuild} as ${tag}!`;

    console.log(response);
  })
  .catch(console.error);
