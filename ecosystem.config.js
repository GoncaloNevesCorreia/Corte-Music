module.exports = {
  apps: [
    {
      name: "discord-music-bot",
      script: "npm",
      args: "run start",

      watch: ["../"],
      watch_delay: 1000,
      ignore_watch: ["node_modules", "servers.json"],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
