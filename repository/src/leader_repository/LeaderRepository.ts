import Leader from './Leader';
import { converLeaderFromRaw } from '../converter/converter';
import RedisStorage from './RedisStorage';

abstract class LeaderRepository<KeyType> {
  private storage: RedisStorage<Leader>;

  constructor() {
    this.storage = new RedisStorage();
  }

  abstract formatKeyToString(key: KeyType): string;

  abstract getLeaderboardDatabase(): string;

  save(leader: Leader, keyString: KeyType) {
    const key = this.leaderKey(keyString);

    return this.storage.put(key, leader);
  }

  async find(keyString: KeyType) {
    const key = this.leaderKey(keyString);

    const data = await this.storage.get(key);

    if (data === null)
      return null;

    return converLeaderFromRaw(data);
  }

  private leaderKey(keyString: KeyType): string {
    return this.getLeaderboardDatabase() + ':' + this.formatKeyToString(keyString);
  }
}

export default LeaderRepository;