#!/usr/bin/env bash

echo "Kill all the running PM2 actions"
sudo pm2 stop all
sudo pm2 delete all

echo "Jump to app folder"
cd $TARGET

echo "Run new PM2 action"
sudo pm2 start npm --name "discord-music-bot" -- start
