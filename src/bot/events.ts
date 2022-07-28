import { ChatInputCommandInteraction, Interaction } from 'discord.js';
import { getErrorEmbed } from './embeds';
import { resolve } from './register';

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

export default async function onInteraction(int: Interaction): Promise<void> {
  if (int.isChatInputCommand()) {
    await onCommand(int);
  }
}
