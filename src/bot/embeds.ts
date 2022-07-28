import { Colors, EmbedBuilder } from 'discord.js';
import { ArticlePost } from '../wordpress/article';

const MAX_DESC = 2047;

function getEmbed(): EmbedBuilder {
  return new EmbedBuilder();
}

export function getPostEmbed(article: ArticlePost): EmbedBuilder {
  const getDesc = () => {
    let result = article.caption;
    if (result.length > MAX_DESC) {
      const suffix = `... [View more here!](${article.url})`;
      const end = (MAX_DESC - 1) - suffix.length;
      const newDesc = result.substring(0, end);
      result = newDesc + suffix;
    }
    return result;
  };
  return getEmbed()
    .setTitle(article.title)
    .setDescription(getDesc())
    .setColor(Colors.Blue)
    .setURL(article.url)
    .setThumbnail(article.thumbnail_url)
    .setAuthor({
      name: article.author.profile_name,
      iconURL: article.author.profile_picture_url,
    })
    .setTimestamp(new Date(article.date));
}

export function getErrorEmbed(e: unknown): EmbedBuilder {
  const err = e instanceof Error ? e.message : `${e}`;
  const desc = `\`\`\`\n${err}\n\`\`\``;
  return getEmbed()
    .setColor(Colors.Red)
    .setTitle('An Error has Occurred')
    .setDescription(desc);
}
