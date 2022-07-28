import { GuildConfig, PrismaClient } from '@prisma/client';
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

async function getRedisClient(): Promise<RedisClientType> {
  if (redisInstance !== null) {
    return redisInstance;
  }
  const url = getRedisUrl();
  redisInstance = createClient({ url });
  await redisInstance.connect();
  return redisInstance;
}

async function getCache<T>(key: string, field: string): Promise<T | null> {
  const client = await getRedisClient();
  const val = await client.hGet(key, field) || null;
  if (val !== null) {
    return JSON.parse(val.toString());
  }
  return val;
}

async function getCacheAll<T>(key: string): Promise<T[]> {
  const client = await getRedisClient();
  const vals = await client.hVals(key);
  return vals.map((str) => JSON.parse(str) as T);
}

async function setCache<T>(key: string, field: string, val: T): Promise<void> {
  const client = await getRedisClient();
  const valStr = JSON.stringify(val);
  await client.hSet(key, field, valStr);
}

export async function checkIdsInDB(ids: number[]) {
  const prismadb = getPrismaClient();
  const ret = await prismadb.postedId.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return ret.map((item) => item.id);
}

export async function afterIdPosted(id: number) {
  const prismadb = getPrismaClient();
  const insertResult = prismadb.postedId.create({
    data: {
      id,
    },
  });

  await insertResult;
}

export async function getLastChecked(guildId: string): Promise<Date | null> {
  const result = await getCache<string>('last-checked', guildId);
  if (result !== null) {
    return new Date(result);
  }
  const client = getPrismaClient();
  const last = await client.lastChecked.findFirst({ where: { guildId } });
  if (last !== null) {
    await setCache('last-checked', guildId, last.last.toString());
    return last.last;
  }
  return null;
}

export async function getConfig(guildId: string): Promise<GuildConfig | null> {
  const result = await getCache<GuildConfig>('config', guildId);
  if (result !== null) {
    return result;
  }
  const client = getPrismaClient();
  const config = await client.guildConfig.findFirst({ where: { guildId } });
  if (config !== null) {
    await setCache('config', guildId, result);
  }
  return config;
}

export async function createConfig(data: GuildConfig): Promise<GuildConfig> {
  const client = getPrismaClient();
  const config = await client.guildConfig.create({ data });
  await setCache('config', data.guildId, config);
  return config;
}

export async function setConfig(data: GuildConfig): Promise<GuildConfig> {
  const client = getPrismaClient();

  const oldConfig = await getConfig(data.guildId);
  if (!oldConfig) return createConfig(data);

  const newConfig = await client.guildConfig.update({
    data,
    where: {
      guildId: data.guildId,
    },
  });

  await setCache('config', data.guildId, newConfig);
  return newConfig;
}

export async function getAllConfigs(): Promise<GuildConfig[]> {
  const configs = await getCacheAll<GuildConfig>('config');
  if (configs.length > 0) {
    return configs;
  }
  const client = getPrismaClient();
  const result = await client.guildConfig.findMany();
  const tasks: Promise<unknown>[] = [];
  result.forEach((res) => tasks.push(setCache('config', res.guildId, res)));
  await Promise.all(tasks);
  return result;
}
