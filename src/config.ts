// eslint-disable-next-line no-unused-vars
function getVal(key: string): string;
// eslint-disable-next-line no-unused-vars, no-redeclare
function getVal(key: string, force: boolean): string | null;
// eslint-disable-next-line no-redeclare
function getVal(key: string, force = true): string | null {
  const val = process.env[key];
  if (force && (val === undefined || val.length === 0)) {
    throw new Error(`Env var not defined "${key}"`);
  }
  return val || null;
}

export function getToken(): string {
  return getVal('BOT_TOKEN');
}

export function getRedisUrl(): string {
  return getVal('REDIS_URL');
}

export function getDevServer(): string | null {
  return getVal('DEV_SERVER', false);
}

export function getStatus(): string | null {
  return getVal('STATUS', false);
}
