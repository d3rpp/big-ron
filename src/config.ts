function getVal(key: string): string {
  const val = process.env[key];
  if (val === undefined) {
    throw new Error(`Env var not defined "${key}"`);
  }
  return val;
}

export function getToken(): string {
  return getVal('BOT_TOKEN');
}

export function getRedisUrl(): string {
  return getVal('REDIS_URL');
}
