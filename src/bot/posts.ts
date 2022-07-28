import { GuildConfig } from '@prisma/client';
import { getBot } from './index.js';
import { Article } from '../types/wordpress/Article';
import { getPostEmbed } from './embeds';

export default async function post(
  guild: GuildConfig,
  article: Article,
): Promise<void> {
  const bot = getBot();
  const channel = await bot.channels.fetch(guild.channelId);
  if (channel === null) {
    console.error(
      `${guild.guildId} is missing a channel (previously: ${guild.channelId})`,
    );
    return;
  }
  if (!channel.isTextBased()) {
    console.error(
      `${guild.guildId} mistakenly set a non-text-based channel`
      + ` (currently: ${guild.channelId})`,
    );
    return;
  }

  //                                             (in discord.js package)
  // NOTE(dylhack): this is intentional use over Role.prototype.toString
  //                so that the users can be informed that the role has not
  //                been updated.
  const role = `<&${guild.roleId}>`;
  const embed = getPostEmbed(article);
  await channel.send({
    content: role,
    embeds: [embed],
  });
}
