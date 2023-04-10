import { Client, GatewayIntentBits } from "discord.js";
import keys from "../keys";
import events from "../events";
import { registerEvents } from "../utils";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

registerEvents(client, events);

client.login(keys.clientToken).catch((error) => {
  console.error("[Login Error]", error);
  process.exit(1);
});
