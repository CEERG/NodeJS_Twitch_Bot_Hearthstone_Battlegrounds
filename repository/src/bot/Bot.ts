import tmi, { ChatUserstate, Client } from 'tmi.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import LeaderRepositoryByName from '../leader_repository/LeaderRepositoryByName';
import LeaderRepositoryByRank from '../leader_repository/LeaderRepositoryByRank';

require('dotenv').config();
dayjs.extend(relativeTime);

class Bot {
  client: Client;
  leaderRepositoryByName: LeaderRepositoryByName;
  leaderRepositoryByRank: LeaderRepositoryByRank;

  constructor() {
    // Create a client with our options
    this.client = new tmi.client({
      options: { debug: true },
      identity: {
        username: process.env.bot_username,
        password: `oauth:${process.env.bot_password}`
      },
      channels: process.env.bot_channels!.split(',')
    });
    // Register our event handlers (defined below)
    this.client.on('message', this.onMessageHandler.bind(this));
    this.client.on('connected', this.onConnectedHandler.bind(this));

    this.leaderRepositoryByName = new LeaderRepositoryByName();
    this.leaderRepositoryByRank = new LeaderRepositoryByRank();
  }

  start() {
    this.client.connect();
  }

  stop() {
    this.client.disconnect();
  }

  private async onMessageHandler(channel: string, tags: ChatUserstate, message: string, self: boolean) {
    // Ignore echoed messages.
    if (self) return;

    const [command, param] = message.split(' ');

    switch (command) {
      case '!ping':
        this.client.say(channel, `@${tags.username} pong`);

        break;

      case '!bgrank':
        let searchString = param?.trim();

        if (!searchString) {
          this.client.say(channel, `@${tags.username} specify player.`)

          break;
        }

        if (Number(searchString)) {
          var leader = await this.leaderRepositoryByRank.findLeaderByRank(Number(searchString));
        } else {
          var leader = await this.leaderRepositoryByName.findLeaderByName(searchString);
        }

        if (leader === null) {
          this.client.say(channel, `@${ tags.username } player not found.`)
        } else {
          this.client.say(channel, `@${ tags.username } Player ${ leader.accountid } is rank ${ leader.rank } with ${ leader.rating } mmr (updated ${ dayjs(Number(leader.lastUpdateTimestamp)).fromNow() }).`)
        }

        break;
    }
  }

  private onConnectedHandler(addr: string, port: number) {
    console.log(`* Connected to ${addr}:${port}`);
  }
}

export default Bot;