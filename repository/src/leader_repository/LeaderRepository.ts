import Leader from './Leader';
import { converLeaderFromRaw } from '../converter/converter';
import RedisStorage from './RedisStorage';

class LeaderRepository {
  private storage: RedisStorage<Leader>;

  constructor() {
    this.storage = new RedisStorage();
  }

  save(leader: Leader) {
    return this.storage.put(LeaderRepository.leaderKey(leader.accountid), leader);
  }

  async findLeaderByName(name: string): Promise<Leader | null> {
    const data = await this.storage.get(LeaderRepository.leaderKey(name));

    if (data === null)
      return null;

    return converLeaderFromRaw(data);
  }

  private static leaderKey(name: string): string {
    return process.env.redis_leaderboard_database + ':' + name.toLowerCase();
  }
}

export default LeaderRepository;