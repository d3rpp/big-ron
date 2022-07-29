import {
  ApplicationCommand,
  ApplicationCommandManager,
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  RESTPostAPIApplicationCommandsJSONBody,
  SlashCommandBuilder,
} from 'discord.js';
import { getBot, getDevServer } from './index';
import cmdConfig from './config';

// eslint-disable-next-line no-unused-vars
type CommandHandler = (int: ChatInputCommandInteraction) => Promise<void>;

export type Command = {
    name: string;
    handler: CommandHandler;
};

type CommandDraft = {
    builder: RESTPostAPIApplicationCommandsJSONBody;
    handler: CommandHandler;
};

const registry: Command[] = [];
const commands: CommandDraft[] = [
  {
    handler: cmdConfig,
    builder: new SlashCommandBuilder()
      .setName('config')
      .setDescription('configure the bot.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addRoleOption((opt) => opt
        .setName('role')
        .setDescription('The role to ping for new posts.')
        .setRequired(true))
      .addChannelOption((opt) => opt
        .setName('channel')
        .setDescription('The channel to send new posts to.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
      .addStringOption((opt) => opt
        .setName('website')
        .setDescription('The WordPress site to utilize.')
        .setRequired(true))
      .toJSON(),
  },
];

async function register<T, K, H>(
  draft: CommandDraft,
  target: ApplicationCommandManager<T, K, H>,
): Promise<void> {
  await target.create(draft.builder);
  registry.push({ name: draft.builder.name, handler: draft.handler });
}

export async function registerAll(): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  const bot = getBot();
  const devServer = await getDevServer();

  if (bot.application === null) {
    throw new Error(
      "The instance's application data has not reachable,"
      + ' how did we get here?',
    );
  }
  // clear currently registered
  const clear = (c: ApplicationCommand) => tasks.push(c.delete());
  if (devServer !== null) {
    devServer.commands.cache.forEach(clear);
  } else {
    bot.application.commands.cache.forEach(clear);
  }

  const target = devServer !== null
    ? devServer.commands
    : bot.application.commands;

  commands.forEach((cmd: CommandDraft) => {
    const task = register(cmd, target);
    task.catch((err) => {
      console.error(`Failed to register "${cmd.builder.name}"\n`, err);
    });
    tasks.push(task);
  });

  await Promise.all(tasks);
}

export function resolve(name: string): Command | null {
  for (let i = 0; i < registry.length; i += 1) {
    const cmd = registry[i];
    if (cmd.name === name) {
      return cmd;
    }
  }
  return null;
}
