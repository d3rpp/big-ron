import { GuildConfig, prisma, PrismaClient } from '@prisma/client';
import { createClient, RedisClientType } from 'redis';
import { getRedisUrl } from './config';

let prismaInstance: PrismaClient | null = null;
let redisInstance: RedisClientType | null = null;

function getPrismaClient(): PrismaClient {
  if (prismaInstance !== null) {
    return prismaInstance;
  }
  prismaInstance = new PrismaClient();
  return prismaInstance;
}

function getRedisClient(): RedisClientType {
  if (redisInstance !== null) {
    return redisInstance;
  }
  const url = getRedisUrl();
  redisInstance = createClient({ url });
  return redisInstance;
}

async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const val = await client.get(key);
  if (val !== null) {
    return JSON.parse(val);
  }
  return val;
}

async function setCache<T>(key: string, val: T): Promise<void> {
  const client = getRedisClient();
  const valStr = JSON.stringify(val);
  await client.set(key, valStr);
}

export async function getLastChecked(guildId: string): Promise<Date | null> {
  const result = await getCache<string>(`${guildId}-last`);
  if (result !== null) {
    return new Date(result);
  }
  const client = getPrismaClient();
  const last = await client.lastChecked.findFirst({ where: { guildId } });
  if (last !== null) {
    await setCache(`${guildId}-last`, last.last.toString());
    return last.last;
  }
  return null;
}

export async function getConfig(guildId: string): Promise<GuildConfig | null> {
  const result = await getCache<GuildConfig>(`${guildId}-config`);
  if (result !== null) {
    return result;
  }
  const client = getPrismaClient();
  const config = await client.guildConfig.findFirst({ where: { guildId } });
  if (config !== null) {
    await setCache(`${guildId}-config`, result);
  }
  return config;
}

export async function setConfig(guildId: string, data: GuildConfig): Promise<GuildConfig> {
  const client = getPrismaClient();

  const oldConfig = await client.guildConfig.findFirst({ where: { guildId } });
  if (!oldConfig) return await createConfig(guildId, data);

  const config = await client.guildConfig.update({
    data,
    where: {
      guildId,
    },
  })

  await setCache(`${guildId}-config`, config);
  return config;
}

export async function createConfig(guildId: string, data: Omit<GuildConfig, "guildId">): Promise<GuildConfig> {
    const client = getPrismaClient();
    const config = await client.guildConfig.create({
      data: {
        guildId,
        ...data
      }
    });

    await setCache(`${guildId}-config`, config);
    return config;
}