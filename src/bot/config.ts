import { ChatInputCommandInteraction } from 'discord.js';
import { setConfig } from '../database';
import { getUpdates } from '../wordpress/update';
import post from './posts';

export default async function cmdConfig(
  int: ChatInputCommandInteraction,
): Promise<void> {
  if (!int.guildId) {
    throw new Error('This command belongs in a server.');
  }
  const role = int.options.getRole('role', true);
  const channel = int.options.getChannel('channel', true);
  const wordpress = int.options.getString('website', true);

  await setConfig({
    guildId: int.guildId,
    roleId: role.id,
    channelId: channel.id,
    wordpress,
  });

  // check if we can send in the channel
  await getUpdates(post);
  await int.reply({
    ephemeral: true,
    content: 'Done.',
  });
}
