module.exports = {
  apps: [
    {
      name: "discord-music-bot",
      script: "npm",
      args: "run start",
      ignore_watch: ["node_modules", "servers.json"],
      watch: ["src"],
      watch_delay: 1000,
    },
  ],
};
