import { Client, GatewayIntentBits } from "discord.js";
import keys from "../keys";
import events from "../events";
import { registerEvents } from "../utils";
import { Player } from "discord-player";
import { setupMusicEvents } from "./music/events";

(async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  registerEvents(client, events);

  await client.login(keys.clientToken).catch((error) => {
    console.error("[Login Error]", error);
    process.exit(1);
  });

  const player = Player.singleton(client, {
    ytdlOptions: {
      filter: "audioonly",
      highWaterMark: 1 << 25,
      dlChunkSize: 0,
    },
  });

  setupMusicEvents(player);
})();
