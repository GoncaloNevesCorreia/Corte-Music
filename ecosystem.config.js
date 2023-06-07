module.exports = {
  apps: [
    {
      name: "discord-music-bot",
      script: "npm",
      args: "run start",

      watch: true,
      ignore_watch: ["node_modules", "servers.json"],
      watch_options: {
        usePolling: true,
        interval: 1000,
      },
    },
  ],
};
