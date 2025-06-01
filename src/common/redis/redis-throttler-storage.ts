import { ThrottlerStorage } from '@nestjs/throttler';
import { createClient, RedisClientType } from 'redis';

// Define ThrottlerStorageRecord locally (matches the required return shape)
interface ThrottlerStorageRecord {
    totalHits: number;
    isBlocked: boolean;
    secondsUntilReset: number;
    timeToExpire: number;       // Add this
    timeToBlockExpire: number;  // And this
  }
  

export class RedisThrottlerStorage implements ThrottlerStorage {
  private client: RedisClientType;

  constructor(redisUrl: string) {
    this.client = createClient({ url: redisUrl });
    this.client.connect().catch(console.error);
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const now = Date.now();
  
    const val = await this.client.get(key);
    let timestamps: number[] = val ? JSON.parse(val) : [];
  
    timestamps = timestamps.filter(ts => now - ts < ttl * 1000);
    timestamps.push(now);
  
    await this.client.set(key, JSON.stringify(timestamps), {
      PX: ttl * 1000,
    });
  
    const timeToExpire = ttl * 1000 - (now - timestamps[0]);
    const timeToBlockExpire = timestamps.length > limit ? blockDuration * 1000 : 0;
  
    return {
      totalHits: timestamps.length,
      isBlocked: timestamps.length > limit,
      secondsUntilReset: blockDuration,
      timeToExpire,
      timeToBlockExpire,
    };
  }
  
}
