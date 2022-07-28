import {
  Client, Guild, Team, User,
} from 'discord.js';
import { getDevServer as getDevServerId, getToken } from '../config.js';
import { onReady, onInteraction } from './events';

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

export async function getOwners(): Promise<string[]> {
  const bot = getBot();
  if (bot.application === null) {
    // NOTE(dylhack): This function should not be called if the
    //                bot isn't running.
    throw new Error('Failed to get owner, how did we get here?');
  }
  const { owner } = await bot.application.fetch();
  if (owner instanceof User) {
    return [owner.id];
  }
  if (owner instanceof Team) {
    return Array.from(owner.members.keys());
  }
  // NOTE(dylhack): this should be impossible.
  return [];
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
  bot.once('ready', onReady);

  await bot.login(token);
}
