FROM node:20

RUN npm install ts-node nodemon -g

WORKDIR /data_collector

ENTRYPOINT ["nodemon", "data_collector.ts"]