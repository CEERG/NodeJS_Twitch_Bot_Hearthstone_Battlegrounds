import tmi, { ChatUserstate, Client } from 'tmi.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import LeaderRepository from '../leader_repository/LeaderRepository';

require('dotenv').config();
dayjs.extend(relativeTime);

class Bot {
  client: Client;
  leaderRepository: LeaderRepository;

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

    this.leaderRepository = new LeaderRepository();
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
        let name = param?.trim();

        if (!name) {
          this.client.say(channel, `@${tags.username} specify player.`)

          break;
        }

        const leader = await this.leaderRepository.findLeaderByName(name);

        if (leader === null) {
          this.client.say(channel, `@${tags.username} player not found.`)
        } else {
          this.client.say(channel, `@${tags.username} Player ${leader.accountid} is rank ${leader.rank} with ${leader.rating} mmr (updated ${dayjs(Number(leader.lastUpdateTimestamp)).fromNow()}).`)
        }

        break;
    }
  }

  private onConnectedHandler(addr: string, port: number) {
    console.log(`* Connected to ${addr}:${port}`);
  }
}

export default Bot;