FROM node:20

RUN npm install pm2 -g

WORKDIR /bot

ENTRYPOINT pm2 start bot.ts --watch --attach --interpreter=./node_modules/.bin/ts-node