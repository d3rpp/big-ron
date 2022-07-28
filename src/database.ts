import { GuildConfig, PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;
// let redisInstance: RedisClientType | null = null;

function getPrismaClient(): PrismaClient {
  if (prismaInstance !== null) {
    return prismaInstance;
  }
  prismaInstance = new PrismaClient();
  return prismaInstance;
}

// TODO(dylhack): cache
// function getRedisClient(): RedisClientType {
//   if (redisInstance !== null) {
//     return redisInstance;
//   }
//   const url = getRedisUrl();
//   redisInstance = createClient({ url });
//   promisifyAll(redisInstance);
//   return redisInstance;
// }

// eslint-disable-next-line no-unused-vars
async function getCache(key: string): Promise<string | null> {
  // TODO(dylhack): cache
  return null;
}

// eslint-disable-next-line no-unused-vars
async function setCache(key: string, val: string): Promise<void> {
  // TODO(dylhack): cache
}

export async function getLastChecked(guildId: string): Promise<Date | null> {
  const result = await getCache(`${guildId}-last`);
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
  const result = await getCache(`${guildId}-configj`);
  if (result !== null) {
    return JSON.parse(result);
  }
  const client = getPrismaClient();
  const config = await client.guildConfig.findFirst({ where: { guildId } });
  return config;
}
