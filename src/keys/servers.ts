import { readFileSync, writeFileSync } from "fs";

const fileName = "servers.json";

interface ServerData {
  [guildId: string]: {
    musicChannelId?: string;
    embedId?: string;
  };
}

export function getServerData(guildId: string) {
  const servers = JSON.parse(
    readFileSync(fileName, "utf8") || "{}"
  ) as ServerData;

  const server = servers[guildId];

  if (!server) {
    return null;
  }

  return server;
}

interface SaveSererProps {
  guildId: string;
  musicChannelId?: string;
  embedId?: string;
}

export function saveServerData({
  guildId,
  musicChannelId,
  embedId,
}: SaveSererProps) {
  const serverData = {
    [guildId]: {
      musicChannelId: musicChannelId,
      embedId: embedId,
    },
  };

  writeFileSync(fileName, JSON.stringify(serverData, null, 2), "utf8");
}
