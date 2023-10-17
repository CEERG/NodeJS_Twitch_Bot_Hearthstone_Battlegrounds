import { RedisClientType, createClient, RedisDefaultModules } from 'redis';

require('dotenv').config();

class RedisStorage<T extends {}> {
  private redisClient: Promise<RedisClientType<any, any, any>> | undefined;

  private getClient(): Promise<RedisClientType<any, any, any>> {
    if (this.redisClient)
      return this.redisClient;

    return this.redisClient = createClient({ url: process.env.redis_url })
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  }

  async put(key: string, entity: T) {
    const redisClient = await this.getClient();

    redisClient.hSet(key, entity);
  }

  async get(key: string): Promise<AllFieldsToStrings<T> | null> {
    const redisClient = await this.getClient();

    const data = await redisClient.hGetAll(key) as AllFieldsToStrings<T>;

    if (Object.keys(data).length)
      return data;

    return null;
  }
}

type AllFieldsToStrings<T> = {
  [k in keyof T]: string
}

export default RedisStorage;