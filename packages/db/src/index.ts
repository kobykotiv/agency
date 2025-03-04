import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { createRedisClient, type RedisConfig } from './redis';
import { createPrismaClient } from './prisma';

export * from '@prisma/client';

let prisma: PrismaClient;
let redis: Redis;

export function getDbClient() {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
}

export function getRedisClient(config?: RedisConfig) {
  if (!redis) {
    redis = createRedisClient(config);
  }
  return redis;
}

export async function disconnectDb() {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (redis) {
    await redis.quit();
  }
}

// Re-export utility functions
export * from './redis';
export * from './prisma';
export * from './types';