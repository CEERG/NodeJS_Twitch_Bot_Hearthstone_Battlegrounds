FROM node:20

RUN npm install pm2 -g

WORKDIR /data_collector

ENTRYPOINT pm2 start data_collector.ts --watch --attach --interpreter=./node_modules/.bin/ts-node