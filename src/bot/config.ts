import { ChatInputCommandInteraction } from 'discord.js';
import { getOwners } from '.';
import { getAllConfigs, setConfig } from '../database';

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

  await int.reply({
    ephemeral: true,
    content: 'Configured.',
  });
}

export async function cmdScan(
  int: ChatInputCommandInteraction,
): Promise<void> {
  const owners = await getOwners();
  if (!owners.includes(int.user.id)) {
    throw new Error('Sorry you are not a bot owner.');
  }
  const configs = await getAllConfigs();
  const content = JSON.stringify(configs);
  await int.reply({
    ephemeral: true,
    content: `\`\`\`json\n${content}\n\`\`\``,
  });
}
