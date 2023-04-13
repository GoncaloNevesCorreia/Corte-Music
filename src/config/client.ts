import { Client, GatewayIntentBits } from "discord.js";
import keys from "../keys";
import events from "../events";
import { registerEvents } from "../utils";
import { Player } from "discord-player";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

registerEvents(client, events);

Player.singleton(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.login(keys.clientToken).catch((error) => {
  console.error("[Login Error]", error);
  process.exit(1);
});
