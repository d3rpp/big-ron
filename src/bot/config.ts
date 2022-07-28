import { GuildConfig } from '@prisma/client';
import { ChatInputCommandInteraction } from 'discord.js';
import { createConfig, getConfig, setConfig } from '../database';

const defaultConfig: Omit<GuildConfig, "guildId"> = {
  roleId: "",
  channelId: "",
  wordpress: ""
}

export default async function cmdConfig(
  int: ChatInputCommandInteraction,
): Promise<void> {
  const option = int.options.get("value");
  if (!option || !int.guildId) return;

  const oldConfig = await getConfig(int.guildId);
  if (!oldConfig) {
    await createConfig(int.guildId, { ...defaultConfig, [int.options.getSubcommand()]: option.value });
    return;
  }

  const config: GuildConfig = {
    ...oldConfig,
    [int.options.getSubcommand()]: option.value,
  }

  await setConfig(int.guildId, config);
}
