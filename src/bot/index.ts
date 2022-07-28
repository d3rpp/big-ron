import { Client, Guild } from 'discord.js';
import { getDevServer as getDevServerId, getToken } from '../config';
import onInteraction from './events';

let botInstance: Client | null = null;
let devServer: Guild | null | undefined;

export function getBot(): Client {
  if (botInstance !== null) {
    return botInstance;
  }
  botInstance = new Client({
    intents: ['Guilds'],
  });
  return botInstance;
}

export async function getDevServer(): Promise<Guild | null> {
  if (devServer !== undefined) {
    return devServer;
  }
  const devServerId = getDevServerId();
  if (devServerId === null) {
    devServer = null;
    return null;
  }
  const bot = getBot();
  devServer = await bot.guilds.fetch(devServerId);
  return devServer;
}

export default async function startBot(): Promise<void> {
  const token = getToken();
  const bot = getBot();

  bot.on('interactionCreate', onInteraction);

  await bot.login(token);
}
