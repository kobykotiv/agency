import Redis from 'ioredis';

export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  tls?: boolean;
}

const DEFAULT_CONFIG: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: 'crewai:',
};

export function createRedisClient(config?: RedisConfig): Redis {
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const client = new Redis({
    host: finalConfig.host,
    port: finalConfig.port,
    password: finalConfig.password,
    db: finalConfig.db,
    keyPrefix: finalConfig.keyPrefix,
    tls: finalConfig.tls ? {} : undefined,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  client.on('error', (error) => {
    console.error('Redis Client Error:', error);
  });

  client.on('connect', () => {
    console.log('Redis Client Connected');
  });

  return client;
}

export class RedisStore {
  private client: Redis;
  
  constructor(client: Redis) {
    this.client = client;
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value);
  }

  async set(key: string, value: any, expiresIn?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (expiresIn) {
      await this.client.setex(key, expiresIn, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);
    return exists === 1;
  }

  async clear(): Promise<void> {
    await this.client.flushdb();
  }
}