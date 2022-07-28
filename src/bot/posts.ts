import { GuildConfig } from '@prisma/client';
import { EmbedBuilder } from 'discord.js';
import { getBot } from '.';
import { Article } from '../types/wordpress';

const MAX_DESC = 2047;

function getEmbed(article: Article): EmbedBuilder {
  const getDesc = () => {
    let result = article.yoast_head_json.og_description;
    if (result.length > MAX_DESC) {
      const suffix = `... [View more here!](${article.yoast_head_json.canonical})`;
      const end = (MAX_DESC - 1) - suffix.length;
      const newDesc = result.substring(0, end);
      result = newDesc + suffix;
    }
    return result;
  };
  return new EmbedBuilder()
    .setTitle(article.yoast_head_json.og_title)
    .setDescription(getDesc())
    .setURL(article.yoast_head_json.canonical)
    .setThumbnail(article.yoast_head_json.og_image[0]?.url || null)
    .setAuthor({
      name: article.yoast_head_json.author,
    })
    .setTimestamp(new Date(article.date_gmt));
}

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
  // NOTE(dylhack): this intentional to use over Role.prototype.toString
  //                so that the users can be informed that the role has not
  //                been updated.
  const role = `<&${guild.roleId}>`;
  const embed = getEmbed(article);
  await channel.send({
    content: role,
    embeds: [embed],
  });
}
