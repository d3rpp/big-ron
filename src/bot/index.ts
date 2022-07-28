import { Client } from 'discord.js';
import { getToken } from '../config';
import onInteraction from './events';

let botInstance: Client | null = null;

export function getBot(): Client {
  if (botInstance !== null) {
    return botInstance;
  }
  botInstance = new Client({
    intents: ['Guilds'],
  });
  return botInstance;
}

export default async function startBot(): Promise<void> {
  const token = getToken();
  const bot = getBot();

  bot.on('interactionCreate', onInteraction);

  await bot.login(token);
}
