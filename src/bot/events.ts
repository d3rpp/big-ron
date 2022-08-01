import { ChatInputCommandInteraction, Interaction } from 'discord.js';
import { getStatus } from '../config.js';
import { getErrorEmbed } from './embeds.js';
import { getBot } from './index.js';
import { registerAll, resolve } from './register';

async function onCommand(int: ChatInputCommandInteraction): Promise<void> {
  const name = int.commandName;
  const handleErr = async (e: unknown) => {
    const embed = getErrorEmbed(e);
    await int.reply({
      ephemeral: true,
      embeds: [embed],
    });
  };
  const cmd = resolve(name);
  if (cmd === null) {
    // NOTE(dylhack): this should not be possible unless
    //                commands are out of sync
    throw new Error(`Command "${name}" not found, how did we get here?`);
  }
  await cmd.handler(int).catch(handleErr);
}

export async function onInteraction(int: Interaction): Promise<void> {
  if (int.isChatInputCommand()) {
    await onCommand(int);
  }
}

export async function onReady(): Promise<void> {
  const status = getStatus();
  await registerAll();

  if (status !== null) {
    const bot = getBot();
    if (bot.user === null) {
      throw new Error('UserClient not definied upon ready');
    }

    bot.user.setPresence({
      status: 'online',
      activities: [
        {
          name: status,
        },
      ],
    });
  }
}
